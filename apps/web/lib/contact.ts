// Shared by the contact form (instant feedback) and the server action (the real check).

export type ContactField = "name" | "email" | "message"
export type ContactValues = Record<ContactField, string>
export type ContactErrors = Partial<Record<ContactField, string>>

export type ContactState = {
  status: "idle" | "sent" | "error"
  values?: ContactValues
  errors?: ContactErrors
  // Set when the message was valid but could not be sent.
  failed?: boolean
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function readContact(formData: FormData): ContactValues {
  return {
    name: String(formData.get("name") ?? "")
      .replace(/[\r\n]+/g, " ")
      .trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  }
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {}

  if (!values.name) errors.name = "Required"
  else if (values.name.length > 200) errors.name = "Too long"

  if (!values.email) errors.email = "Required"
  else if (!EMAIL.test(values.email)) errors.email = "Invalid email"

  if (!values.message) errors.message = "Required"
  else if (values.message.length > 5000) errors.message = "Too long"

  return errors
}
