"use server"

import { readContact, validateContact, type ContactState } from "@/lib/contact"
import { site } from "@/lib/site"

// Sends the contact form to site.email through Resend's API.
// Needs RESEND_API_KEY; CONTACT_FROM is the sender once your domain is verified in Resend.
export async function sendMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("company")) return { status: "sent" }

  const values = readContact(formData)
  const errors = validateContact(values)
  if (Object.keys(errors).length) return { status: "error", values, errors }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set")
    return { status: "error", values, failed: true }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: values.email,
        subject: `Message from ${values.name}`,
        text: `${values.message}\n\n— ${values.name} <${values.email}>`,
      }),
    })

    if (!res.ok) {
      console.error("Resend error", res.status, await res.text())
      return { status: "error", values, failed: true }
    }
  } catch (error) {
    console.error("Resend request failed", error)
    return { status: "error", values, failed: true }
  }

  return { status: "sent" }
}
