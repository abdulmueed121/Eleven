# Project enquiry email

Set these server-only environment variables locally and in the deployment environment:

- `RESEND_API_KEY`: a Resend API key with permission to send mail.
- `RESEND_FROM_EMAIL`: a sender on your verified Resend domain, such as `ELEVEN <projects@your-verified-domain>`.
- `PROJECT_ENQUIRY_TO`: the internal destination mailbox; intended default is `hello@elev1.us`.

The local Cloudflare development runtime reads `.env` through the Vite integration; copy `.env.example` to `.env` and restart development after filling it in. Never use a `NEXT_PUBLIC_` prefix for these values. Hosted settings must be added as runtime secrets/environment variables through Sites, not committed to source. The handler reads Cloudflare Worker environment bindings.

The form sends a plain-text email to the configured internal mailbox with the visitor's address as `reply_to`. It does not email the visitor, create a CRM record, or save a browser draft. Success means Resend accepted the email, not that inbox delivery is guaranteed. Check Resend delivery events when testing the final configuration.

Missing settings return HTTP 503 with an honest not-sent message. Invalid briefs return 400; cross-origin requests are rejected; request bodies are limited to 20 KB. A hidden field filters basic bots. Requests with unchanged content reuse an idempotency key during retries in the same mounted form, consistent with Resend's idempotency window. Edited briefs get new keys. Apply durable hosting-level rate limits or a challenge before exposing the endpoint to substantial public traffic; browser origin checks and honeypots do not stop dedicated clients.

After configuring credentials, submit one authorised test brief and verify it arrives in the destination mailbox, includes all fields, and replies to the visitor. No live test message was sent during implementation because credentials were not supplied.

Reference: https://resend.com/docs/api-reference/emails/send-email and https://resend.com/docs/dashboard/emails/idempotency-keys

# Content confirmations before public release

- Confirm VID's meaning and product scope; its page currently invites a walkthrough without inventing specifications.
- Confirm exact billing/POS, SMS and KYC capabilities. The copy describes implementation considerations where availability is not established and makes no accuracy, certification or regulatory-approval claims.
- Review legal text against the actual legal entity, business address, jurisdiction, retention schedule, suppliers and product agreements. Website policies are general drafts, not a product DPA or signed commercial contract. The website privacy notice expressly excludes KYC processing and model training from enquiry consent.
- Privacy drafting reference: https://ico.org.uk/global/privacy-notice/your-data-protection-rights/
