/**
 * EmailJS helper
 * 
 * 1. Create account at https://www.emailjs.com
 * 2. Add an Email Service (Gmail, Outlook, etc.)
 * 3. Create a template (e.g. "welcome")
 * 4. Put the IDs in .env
 *
 * Template variables you can use:
 *   {{to_name}}  {{to_email}}  {{message}}  {{plan}}
 */

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/**
 * Send a welcome email after sign-up
 */
export async function sendWelcomeEmail({ toName, toEmail, plan = 'free' }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured – skipping welcome email')
    return
  }

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      to_name: toName || 'there',
      to_email: toEmail,
      plan,
      message: `Welcome to Unrestricted AI! Your ${plan} plan is ready. Ask anything — there are no content limits.`
    }
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('EmailJS error:', text)
    throw new Error('Failed to send welcome email')
  }

  return true
}

/**
 * Generic send (for contact form, receipts, etc.)
 */
export async function sendEmail({ toName, toEmail, subject, message }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured')
    return
  }

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      to_name: toName,
      to_email: toEmail,
      subject: subject || 'Message from Unrestricted AI',
      message
    }
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) throw new Error(await res.text())
  return true
}
