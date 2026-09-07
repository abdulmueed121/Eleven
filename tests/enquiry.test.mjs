import test from 'node:test';
import assert from 'node:assert/strict';
import { handleEnquiry, validateEnquiry } from '../lib/enquiry.ts';

const brief = { name: 'Test Person', email: 'test@example.com', company: 'Example', role: 'Founder', location: 'Pakistan / UTC+5', project: 'Retail system', description: 'We need a connected billing system for three stores.', services: ['Billing & POS'], stage: 'New build', budget: '$5,000–$15,000', timeline: '1–3 months', consent: true, requestId: '11111111-1111-4111-8111-111111111111' };
const env = { RESEND_API_KEY: 'test-key', RESEND_FROM_EMAIL: 'test@example.com', PROJECT_ENQUIRY_TO: 'internal@example.com' };
const request = (body = brief, origin = 'https://example.com') => new Request('https://example.com/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body) });
test('required fields, privacy acknowledgement and allowed selections are enforced', () => {
  assert.ok(validateEnquiry(brief).data);
  for (const patch of [{ consent: false }, { email: 'a\nb@example.com' }, { services: [] }, { budget: 'bogus' }, { description: 'Short' }, { website: 'javascript:alert(1)' }, { name: '' }]) assert.ok(validateEnquiry({ ...brief, ...patch }).error);
});
test('missing configuration never returns false success', async () => {
  const result = await handleEnquiry(request(), {}, () => { throw new Error('Must not send'); });
  assert.equal(result.status, 503);
});
test('rejects foreign origins, honeypots, invalid JSON and excessive bodies', async () => {
  assert.equal((await handleEnquiry(request(brief, 'https://foreign.example'), env)).status, 403);
  assert.equal((await handleEnquiry(request({ ...brief, company_fax: 'spam' }), env)).status, 400);
  assert.equal((await handleEnquiry(new Request('https://example.com/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' }), env)).status, 400);
  assert.equal((await handleEnquiry(request({ ...brief, description: 'a'.repeat(21000) }), env)).status, 413);
});
test('sends all brief fields only to configured recipient with safe reply-to and retry key', async () => {
  let sent;
  const result = await handleEnquiry(request({ ...brief, phone: '+92 123', website: 'https://example.com', technology: 'ERP integration', references: '<b>Literal text</b>' }), env, async (url, options) => { sent = { url, options, body: JSON.parse(options.body) }; return Response.json({ id: 'test-message' }); });
  assert.equal(result.status, 200);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.deepEqual(sent.body.to, ['internal@example.com']);
  assert.equal(sent.body.reply_to, brief.email);
  assert.equal(sent.options.headers['Idempotency-Key'], `project-enquiry/${brief.requestId}`);
  for (const value of ['ERP integration', '+92 123', '<b>Literal text</b>', 'Billing & POS', brief.budget, brief.timeline, brief.location]) assert.ok(sent.body.text.includes(value));
  assert.equal(sent.body.html, undefined);
});
test('provider rejection, missing message id and network failures remain failures', async () => {
  for (const send of [async () => new Response('', { status: 429 }), async () => Response.json({}), async () => { throw new Error('network'); }]) {
    const result = await handleEnquiry(request(), env, send); assert.equal(result.status, 502); assert.ok((await result.json()).error);
  }
});
