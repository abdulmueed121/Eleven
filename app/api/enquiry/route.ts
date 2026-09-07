import { env } from 'cloudflare:workers';
import { handleEnquiry } from '../../../lib/enquiry';
export async function POST(request: Request) {
  return handleEnquiry(request, env as { RESEND_API_KEY?: string; RESEND_FROM_EMAIL?: string; PROJECT_ENQUIRY_TO?: string });
}
