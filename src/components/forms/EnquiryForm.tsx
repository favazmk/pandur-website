"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MagneticButton } from "@/components/motion/Magnetic";
import { CookieRingDraw } from "@/components/brand/Marks";
import { ease } from "@/lib/motion";

export type Fields = {
  name: string;
  company: string;
  email: string;
  interest: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please enter your name.";
  if (!f.company.trim()) e.company = "Please enter your company.";
  if (!f.email.trim()) e.email = "Please enter your email.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "That email doesn't look right.";
  return e;
}

/**
 * SINGLE INTEGRATION POINT for every form on the site.
 *
 * The client has not supplied a destination for enquiries yet. Everything else
 * about these forms is finished — when the address or endpoint arrives, replace
 * the body of this function and nothing else changes.
 */
async function submitEnquiry(fields: Fields, topic: string): Promise<void> {
  // TODO(client): POST to the real endpoint / email service.
  console.info(`[pandur] ${topic} enquiry (not yet delivered anywhere):`, fields);
  await new Promise((r) => setTimeout(r, 700));
}

const EMPTY: Fields = {
  name: "",
  company: "",
  email: "",
  interest: "",
  message: "",
};

export default function EnquiryForm({
  topic = "general",
  interestOptions,
  submitLabel = "Send Enquiry",
}: {
  topic?: string;
  interestOptions?: string[];
  submitLabel?: string;
}) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const set =
    (k: keyof Fields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFields((f) => ({ ...f, [k]: e.target.value }));
      setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`enq-${first}`)?.focus();
      return;
    }
    setState("sending");
    await submitEnquiry(fields, topic);
    setState("done");
  };

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div
          key="done"
          role="status"
          className="flex flex-col items-center rounded-[2rem] border border-ink/12 bg-white/60 px-8 py-20 text-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: ease.pop }}
        >
          <CookieRingDraw
            className="h-20 w-20 text-red-deep"
            strokeWidth={5}
            duration={1.1}
          />
          <h3 className="text-title mt-8 font-display font-black text-ink">
            Thank you.
          </h3>
          <p className="text-lead mt-3 text-ash">
            We&rsquo;ll be in touch shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setFields(EMPTY);
              setState("idle");
            }}
            className="text-eyebrow mt-8 text-ash underline underline-offset-4 hover:text-ink"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
        >
          <Field
            id="enq-name"
            label="Name"
            value={fields.name}
            onChange={set("name")}
            error={errors.name}
            autoComplete="name"
          />
          <Field
            id="enq-company"
            label="Company"
            value={fields.company}
            onChange={set("company")}
            error={errors.company}
            autoComplete="organization"
          />
          <Field
            id="enq-email"
            label="Email"
            type="email"
            value={fields.email}
            onChange={set("email")}
            error={errors.email}
            autoComplete="email"
            className={interestOptions ? "" : "md:col-span-2"}
          />
          {interestOptions && (
            <Field
              id="enq-interest"
              label="I'm interested in"
              value={fields.interest}
              onChange={set("interest")}
              options={interestOptions}
            />
          )}
          <Field
            id="enq-message"
            label="Message (optional)"
            value={fields.message}
            onChange={set("message")}
            textarea
            className="md:col-span-2"
          />

          <div className="mt-4 flex justify-center md:col-span-2">
            <MagneticButton
              label={state === "sending" ? "Sending…" : submitLabel}
              type="submit"
            />
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
  options,
  className,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  options?: string[];
  className?: string;
  autoComplete?: string;
}) {
  const describedBy = error ? `${id}-error` : undefined;
  const base =
    "w-full rounded-2xl border-2 bg-white/70 px-5 py-4 text-ink outline-none transition-colors placeholder:text-ash focus:border-ink";
  const tone = error ? "border-red" : "border-ink/15";

  return (
    <div className={className}>
      <label htmlFor={id} className="text-eyebrow mb-2 block text-ash">
        {label}
      </label>

      {options ? (
        <select id={id} value={value} onChange={onChange} className={`${base} ${tone}`}>
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${base} ${tone} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${base} ${tone}`}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-2 text-sm font-semibold text-red-deep"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
