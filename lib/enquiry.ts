export const serviceOptions = ['Product & experience', 'Software engineering', 'Cloud & infrastructure', 'Growth', 'APIs & integrations', 'Infrastructure', 'Automation', 'Communications', 'Billing & POS', 'SMS gateway API', 'KYC & identity matching', 'VID', 'Eleven Solutions'];
export const stages = ['Idea / discovery', 'New build', 'Existing product', 'Rebuild / migration', 'Scaling', 'Ongoing support'];
export const budgets = ['Under $5,000', '$5,000–$15,000', '$15,000–$50,000', '$50,000–$100,000', '$100,000+', 'To be discussed'];
export const timelines = ['As soon as possible', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible / exploring'];
export const fields = [
  ['name', 'Full name', 120, true], ['email', 'Work email', 254, true], ['company', 'Company / independent status', 160, true],
  ['role', 'Role', 120, true], ['phone', 'Phone', 60, false], ['location', 'Country / time zone', 160, true], ['website', 'Website', 500, false],
  ['project', 'Project name', 160, true], ['description', 'Project details', 6000, true], ['technology', 'Existing technology / integrations', 2000, false],
  ['references', 'Reference links / additional context', 2000, false],
] as const;
export type Enquiry = Record<(typeof fields)[number][0], string> & { services: string[]; stage: string; budget: string; timeline: string; consent: true };
export function validateEnquiry(value: unknown): { data?: Enquiry; error?: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { error: 'Please provide a valid project brief.' };
  const input = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, label, max, required] of fields) {
    const raw = input[key];
    if (raw !== undefined && typeof raw !== 'string') return { error: `${label} must be text.` };
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (required && !text) return { error: `Please complete ${label.toLowerCase()}.` };
    if (text.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) return { error: `Please shorten or correct ${label.toLowerCase()}.` };
    result[key] = text;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email as string)) return { error: 'Enter a valid email address.' };
  if ((result.description as string).length < 30) return { error: 'Add at least 30 characters about your project.' };
  if (result.website) { try { const url = new URL(result.website as string); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); } catch { return { error: 'Enter a website beginning with https:// or http://.' }; } }
  if (!Array.isArray(input.services) || !input.services.length || input.services.length > serviceOptions.length || input.services.some(x => typeof x !== 'string' || !serviceOptions.includes(x))) return { error: 'Select at least one service.' };
  result.services = [...new Set(input.services)];
  for (const [key, allowed] of [['stage', stages], ['budget', budgets], ['timeline', timelines]] as const) {
    if (typeof input[key] !== 'string' || !allowed.includes(input[key] as string)) return { error: `Select your project ${key}.` };
    result[key] = input[key];
  }
  if (input.consent !== true) return { error: 'Please acknowledge the privacy notice before submitting.' };
  result.consent = true;
  return { data: result as Enquiry };
}

type Env = { RESEND_API_KEY?: string; RESEND_FROM_EMAIL?: string; PROJECT_ENQUIRY_TO?: string };
export async function handleEnquiry(request: Request, env: Env, send: typeof fetch = fetch): Promise<Response> {
  const reply = (status: number, error: string) => Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return reply(403, 'Please submit the form from this website.');
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, 'Send the project brief as JSON.');
  if (Number(request.headers.get('content-length')) > 20000) return reply(413, 'Your brief is too long. Please shorten it.');
  let value: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'Your project brief is missing.');
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const part = await reader.read(); if (part.done) break; size += part.value.byteLength; if (size > 20000) { await reader.cancel(); return reply(413, 'Your brief is too long. Please shorten it.'); } chunks.push(part.value); }
    const bytes = new Uint8Array(size); let offset = 0; for (const part of chunks) { bytes.set(part, offset); offset += part.byteLength; }
    value = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply(400, 'The project brief could not be read. Please try again.'); }
  const validation = validateEnquiry(value);
  if (validation.error || !validation.data) return reply(400, validation.error || 'Please check your brief.');
  if (value.company_fax) return reply(400, 'The form could not be submitted. Please email hello@elev1.us.');
  if (typeof value.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.requestId)) return reply(400, 'Please refresh the page and try again.');
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.PROJECT_ENQUIRY_TO) return reply(503, 'Online enquiries are not available yet. Your details have not been sent. Please email hello@elev1.us.');
  const data = validation.data;
  const text = ['New ELEVEN project enquiry', '', ...fields.map(([key, label]) => `${label}:\n${data[key] || 'Not provided'}\n`), `Services: ${data.services.join(', ')}`, `Stage: ${data.stage}`, `Budget (USD): ${data.budget}`, `Timeline: ${data.timeline}`, 'Privacy notice acknowledged: yes', 'Notice version: 7 September 2026', `Submitted: ${new Date().toISOString()}`].join('\n');
  try {
    const response = await send('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `project-enquiry/${value.requestId}` }, body: JSON.stringify({ from: env.RESEND_FROM_EMAIL, to: [env.PROJECT_ENQUIRY_TO], reply_to: data.email, subject: `Project enquiry: ${data.project.replace(/[\r\n]/g, ' ')}`, text }), signal: AbortSignal.timeout(15000) });
    if (!response.ok) return reply(502, 'We could not confirm your enquiry was sent. Please try again or email hello@elev1.us.');
    const result = await response.json() as { id?: string };
    if (!result.id) return reply(502, 'We could not confirm your enquiry was sent. Please try again or email hello@elev1.us.');
    return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return reply(502, 'We could not confirm delivery to our email service. Please retry or email hello@elev1.us.'); }
}
