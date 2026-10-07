'use client'

import {useId, useState, type FormEvent, type ReactNode} from 'react'

type Props = {heading: string; body: string | null; buttonLabel: string; consent: ReactNode}

export function NewsletterForm({heading, body, buttonLabel, consent}: Props) {
  const id = useId()
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'needsConsent' | 'done'>('idle')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!agreed) return setStatus('needsConsent')
    // No newsletter provider is wired up for this replica; acknowledge locally.
    setStatus('done')
    e.currentTarget.reset()
    setAgreed(false)
  }

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <h3 className="mb-2 text-base leading-6 font-medium text-ash">{heading}</h3>
        {body && <p className="mb-4 text-sm text-zinc-500">{body}</p>}
        <div className="flex gap-0.5">
          <label htmlFor={`${id}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="flex h-11 w-full flex-1 border-0 bg-white px-3 py-1 text-base font-light text-ash placeholder:text-ash focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:outline-none md:text-sm"
          />
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center bg-white px-4 py-2 text-base font-medium text-ash transition-colors duration-300 hover:bg-neutral-500 hover:text-white"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={agreed}
            aria-labelledby={`${id}-consent`}
            onClick={() => setAgreed((v) => !v)}
            className={`mb-0.5 h-4 w-4 shrink-0 rounded-full border border-gray-400 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none ${
              agreed ? 'bg-gray-400' : ''
            }`}
          />
          <div id={`${id}-consent`} className="text-base text-ash [&_a]:text-slate [&_a]:transition-colors [&_a:hover]:text-zinc-900 [&_p]:m-0">
            {consent}
          </div>
        </div>
        {status === 'needsConsent' && (
          <p className="text-sm text-red-600" role="alert">
            Please agree to the privacy policy.
          </p>
        )}
        {status === 'done' && (
          <p className="text-sm text-slate" role="status">
            Thank you for subscribing.
          </p>
        )}
      </div>
    </form>
  )
}
