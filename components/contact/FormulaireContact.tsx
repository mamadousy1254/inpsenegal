"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const subjects = [
  "Demande d'information générale",
  "Demande de service technique",
  "Collaboration / partenariat",
  "Candidature / stage",
  "Presse / communication",
  "Réclamation",
  "Autre",
] as const;

const schema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  institution: z.string().optional(),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Veuillez choisir un objet"),
  message: z.string().min(10, "Veuillez rédiger votre message (min. 10 caractères)"),
  // Honeypot
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const fieldBase =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--inp-vert)] focus:ring-offset-1";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FormulaireContact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data.website) return;
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          institution: data.institution,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          website: data.website,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Erreur lors de l'envoi");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Erreur lors de l'envoi");
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-10 text-center shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--inp-vert)]/10">
          <CheckCircle className="h-8 w-8 text-[var(--inp-vert)]" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Message envoyé avec succès
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Nous avons bien reçu votre message. Notre équipe vous répondra dans
          les meilleurs délais.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-[var(--inp-vert)]/15 bg-white p-7 shadow-sm sm:p-8"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      noValidate
    >
      <h2 className="mb-6 text-lg font-semibold text-foreground">
        Envoyer un message
      </h2>

      {submitError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nom */}
        <div>
          <label htmlFor="ct-name" className="mb-1.5 block text-xs font-medium text-foreground">
            Nom complet *
          </label>
          <input
            id="ct-name"
            {...register("fullName")}
            className={cn(fieldBase, errors.fullName && "ring-2 ring-red-400")}
            placeholder="Ex : Dr Aminata Ba"
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        {/* Institution */}
        <div>
          <label htmlFor="ct-inst" className="mb-1.5 block text-xs font-medium text-foreground">
            Institution
          </label>
          <input
            id="ct-inst"
            {...register("institution")}
            className={fieldBase}
            placeholder="Ex : Ministère de l'Agriculture"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="ct-email" className="mb-1.5 block text-xs font-medium text-foreground">
            Adresse e-mail *
          </label>
          <input
            id="ct-email"
            type="email"
            {...register("email")}
            className={cn(fieldBase, errors.email && "ring-2 ring-red-400")}
            placeholder="email@institution.sn"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="ct-phone" className="mb-1.5 block text-xs font-medium text-foreground">
            Téléphone
          </label>
          <input
            id="ct-phone"
            type="tel"
            {...register("phone")}
            className={fieldBase}
            placeholder="+221 77 000 00 00"
          />
        </div>

        {/* Objet */}
        <div className="sm:col-span-2">
          <label htmlFor="ct-subject" className="mb-1.5 block text-xs font-medium text-foreground">
            Objet *
          </label>
          <select
            id="ct-subject"
            {...register("subject")}
            className={cn(fieldBase, "appearance-none", errors.subject && "ring-2 ring-red-400")}
            defaultValue=""
          >
            <option value="" disabled>
              Sélectionnez l&apos;objet de votre message
            </option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="ct-msg" className="mb-1.5 block text-xs font-medium text-foreground">
            Message *
          </label>
          <textarea
            id="ct-msg"
            rows={6}
            {...register("message")}
            className={cn(fieldBase, "resize-none", errors.message && "ring-2 ring-red-400")}
            placeholder="Décrivez votre demande…"
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>
      </div>

      {/* Honeypot — hidden from humans */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* Submit */}
      <div className="mt-7 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--inp-vert)] px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)] focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Envoi en cours…" : "Envoyer le message"}
        </button>
      </div>
    </motion.form>
  );
}
