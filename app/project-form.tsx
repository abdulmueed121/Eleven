'use client';
import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { budgets, fields, serviceOptions, stages, timelines, validateEnquiry } from '../lib/enquiry';

export function ProjectForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const interest = useSearchParams().get('interest') || '';
  const statusRef = useRef<HTMLDivElement>(null);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const pending = useRef(false);
  useEffect(() => { if (status === 'success' || error) statusRef.current?.focus(); }, [status, error]);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return;
    const form = new FormData(event.currentTarget);
    const value = { ...Object.fromEntries(form.entries()), services: form.getAll('services'), consent: form.get('consent') === 'on' };
    const checked = validateEnquiry(value);
    if (checked.error) { setError(checked.error); return; }
    const payload = JSON.stringify(value);
    if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
    pending.current = true; setStatus('sending'); setError('');
    try {
      const response = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...value, requestId: attempt.current!.id }), signal: AbortSignal.timeout(20000) });
      const result = await response.json() as { success?: boolean; error?: string };
      if (!response.ok || result.success !== true) throw new Error(result.error || 'Your enquiry could not be sent. Please try again.');
      setStatus('success');
    } catch (err) { setStatus('idle'); setError(err instanceof Error && err.name !== 'TimeoutError' ? err.message : 'We could not confirm submission. Please retry or email hello@elev1.us.'); }
    finally { pending.current = false; }
  }
  if (status === 'success') return <div className="confirmation" ref={statusRef} tabIndex={-1} aria-live="polite"><CheckCircle2 size={40} /><p className="eyebrow">Brief submitted</p><h2>Thank you. Let’s talk.</h2><p>Your brief has been accepted by our email service for delivery to the ELEVEN team. We’ll review the details and respond to your work email.</p><a className="text-link" href="/products">Explore our products ↗</a></div>;
  return <form onSubmit={submit} aria-busy={status === 'sending'}>
    <div className="full form-intro"><p className="eyebrow">01 / About you</p><h2>The people behind the project.</h2><p>Required fields are marked *. Share business contact details; please leave sensitive information out of this brief.</p></div>
    {fields.slice(0, 7).map(([name, label, max, required]) => <label key={name}>{label}{required ? ' *' : ' (optional)'}<input name={name} required={required} maxLength={max} type={name === 'email' ? 'email' : name === 'website' ? 'url' : name === 'phone' ? 'tel' : 'text'} autoComplete={({ name: 'name', email: 'email', company: 'organization', role: 'organization-title', phone: 'tel', website: 'url' } as Record<string, string>)[name]} placeholder={name === 'website' ? 'https://' : name === 'location' ? 'Country and time zone' : undefined} /></label>)}
    <div className="form-honeypot" aria-hidden="true"><label>Leave this blank<input name="company_fax" tabIndex={-1} autoComplete="off" maxLength={200} /></label></div>
    <div className="full form-intro"><p className="eyebrow">02 / Your brief</p><h2>What are we building together?</h2></div>
    <label className="full">Project name *<input name="project" required maxLength={160} placeholder="A short name for your project" /></label>
    <fieldset><legend>Services or products of interest * <span className="field-hint">Select at least one</span></legend><div className="checks" key={interest}>{serviceOptions.map(x => <label key={x}><input type="checkbox" name="services" value={x} defaultChecked={interest === x} />{x}</label>)}</div></fieldset>
    {([['stage', 'Project stage', stages], ['budget', 'Budget range (USD)', budgets], ['timeline', 'Preferred timeline', timelines]] as const).map(([name, label, options]) => <label key={name}>{label} *<select name={name} required defaultValue=""><option value="" disabled>Select an option</option>{options.map(x => <option key={x}>{x}</option>)}</select></label>)}
    <label className="full">Project details *<textarea name="description" required minLength={30} maxLength={6000} rows={7} placeholder="Describe the problem, intended users, required features, business goals and what success would look like. Include any fixed deadlines or constraints." /></label>
    <label className="full">Existing technology & integrations (optional)<textarea name="technology" maxLength={2000} rows={3} placeholder="Current stack, systems to connect, migration needs or infrastructure requirements." /></label>
    <label className="full">References & additional context (optional)<textarea name="references" maxLength={2000} rows={3} placeholder="Public reference links, stakeholders, procurement requirements or questions for us. If you need an NDA, mention it here before sharing confidential details." /></label>
    <label className="full privacy-check"><input name="consent" type="checkbox" required /><span>I have read the <a href="/legal/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a> and understand that ELEVEN will use these details to assess and respond to my enquiry. *</span></label>
    <p className="full form-note">No marketing signup. Do not include identity documents, passwords, payment information or sensitive personal data. Website <a href="/legal/terms" target="_blank" rel="noopener noreferrer">terms & conditions</a> apply.</p>
    <div className="full form-error" ref={statusRef} tabIndex={-1} role={error ? 'alert' : undefined}>{error}</div>
    <button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending your brief…' : 'Send project brief'}<ArrowUpRight size={18} /></button>
    <p className="full form-note">Prefer email? <a href="mailto:hello@elev1.us">hello@elev1.us</a></p>
  </form>;
}
