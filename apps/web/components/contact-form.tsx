"use client"

import * as React from "react"

import { sendMessage } from "@/app/actions"
import {
  readContact,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactState,
} from "@/lib/contact"
import { cn } from "@workspace/ui/lib/utils"
import { site } from "@/lib/site"

const small = "text-[10.4px] leading-[1.2] font-[450]"

function ContactForm() {
  // Bumping the key remounts the form, clearing it for another message.
  const [round, setRound] = React.useState(0)
  return <Form key={round} onReset={() => setRound((r) => r + 1)} />
}

function Form({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = React.useActionState<ContactState, FormData>(
    sendMessage,
    { status: "idle" }
  )
  const [clientErrors, setClientErrors] = React.useState<ContactErrors>({})
  const [edited, setEdited] = React.useState<Set<ContactField>>(new Set())

  if (state.status === "sent") {
    return (
      <div className="max-w-[345px] space-y-4">
        <p>Thank you, your message was sent.</p>
        <button type="button" onClick={onReset}>
          (Send another)
        </button>
      </div>
    )
  }

  const errorFor = (field: ContactField) =>
    pending || edited.has(field)
      ? undefined
      : (clientErrors[field] ?? state.errors?.[field])

  return (
    <form
      action={action}
      noValidate
      onSubmit={(e) => {
        const errors = validateContact(
          readContact(new FormData(e.currentTarget))
        )
        setClientErrors(errors)
        setEdited(new Set())
        if (Object.keys(errors).length) e.preventDefault()
      }}
      onChange={(e) => {
        const target = e.target as EventTarget
        if (
          !(target instanceof HTMLInputElement) &&
          !(target instanceof HTMLTextAreaElement)
        ) {
          return
        }
        const name = target.name as ContactField
        if (!edited.has(name)) setEdited(new Set(edited).add(name))
      }}
      aria-busy={pending}
      className="flex max-w-[345px] flex-col gap-5"
    >
      <Field
        label="Name"
        error={errorFor("name")}
        input={(props) => (
          <input
            {...props}
            name="name"
            autoComplete="name"
            defaultValue={state.values?.name}
          />
        )}
      />
      <Field
        label="Email"
        error={errorFor("email")}
        input={(props) => (
          <input
            {...props}
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.values?.email}
          />
        )}
      />
      <Field
        label="Message"
        error={errorFor("message")}
        input={(props) => (
          <textarea
            {...props}
            name="message"
            rows={6}
            defaultValue={state.values?.message}
            className={cn(props.className, "resize-none")}
          />
        )}
      />

      {/* Honeypot for bots; hidden from people and screen readers. */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="space-y-2">
        <button
          type="submit"
          disabled={pending}
          className="disabled:text-black/40"
        >
          {pending ? "Sending…" : "Send"}
        </button>
        {state.failed && !pending && (
          <p role="alert" className={small}>
            (Couldn&apos;t send your message. Please try again, or write
            directly to{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            )
          </p>
        )}
      </div>
    </form>
  )
}

type InputProps = {
  id: string
  className: string
  "aria-invalid": boolean
  "aria-describedby": string | undefined
}

// A label row ("Name … (Required)") above an underlined input.
function Field({
  label,
  error,
  input,
}: {
  label: string
  error: string | undefined
  input: (props: InputProps) => React.ReactNode
}) {
  const id = React.useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn(
          small,
          "flex justify-between gap-4",
          error ? "text-black/85" : "text-black/40"
        )}
      >
        <label htmlFor={id}>{label}</label>
        {error && (
          <span id={errorId} role="alert" className="animate-in fade-in">
            ({error})
          </span>
        )}
      </div>
      {input({
        id,
        className: cn(
          "w-full border-b bg-transparent pb-1 transition-colors outline-none",
          error ? "border-black/85" : "border-black/20 focus:border-black/85"
        ),
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })}
    </div>
  )
}

export { ContactForm }
