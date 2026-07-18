"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Loader2, AlertCircle, EyeOffIcon, EyeIcon, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TricolorUnderline from "@/components/TricolorUnderline";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

const fieldBase =
  "h-11 w-full rounded-xl border border-[#E5DCC2] bg-white pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-[color,box-shadow,border-color] duration-200 focus:border-[var(--inp-vert)] focus:outline-none focus:ring-2 focus:ring-[var(--inp-vert)]/25 sm:h-12";

function LoginLoading() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F8F1E0]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--inp-vert)]" aria-label="Chargement" />
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [serverError, setServerError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Identifiants invalides ou compte inaccessible.");
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  // La redirection des sessions déjà actives est gérée par proxy.ts
  // (évite une boucle client login ↔ dashboard).
  if (status === "loading") {
    return <LoginLoading />;
  }

  return (
    <div className="min-h-dvh">
      {/* Panneau gauche — 50 % fixe */}
      <aside
        className="fixed inset-y-0 left-0 z-10 hidden w-1/2 flex-col justify-between overflow-hidden bg-[var(--inp-vert)] p-10 text-white lg:flex xl:p-14"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div className="relative">
          <Image
            src="/images/logo-inp.png"
            alt=""
            width={64}
            height={64}
            className="mb-8 rounded-xl bg-white/10 p-2"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Institut national de Pédologie
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight xl:text-4xl">
            Intranet professionnel
          </h2>
          <TricolorUnderline className="mt-4 origin-left" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/75">
            Espace sécurisé réservé aux agents et collaborateurs de l&apos;INP : gestion du
            contenu, absences, convocations et outils internes.
          </p>
        </div>
        <p className="relative text-xs text-white/50">
          République du Sénégal — Ministère de l&apos;Agriculture
        </p>
      </aside>

      {/* Panneau droit — 50 %, scroll si hauteur insuffisante */}
      <div className="relative min-h-dvh w-full overflow-y-auto overscroll-y-contain bg-[#F8F1E0] lg:ml-[50%] lg:w-1/2">
        <div
          className="pointer-events-none fixed inset-y-0 right-0 -z-10 w-full opacity-40 lg:w-1/2"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #C9A57433 0%, transparent 45%), radial-gradient(circle at 85% 80%, #7B4F2A18 0%, transparent 40%)",
          }}
          aria-hidden
        />

        <div className="relative flex min-h-dvh w-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <motion.div
            className="relative w-full max-w-[400px] shrink-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
          <Link
            href="/"
            className="mb-6 flex flex-col items-center gap-3 text-center lg:mb-8 lg:hidden"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl border border-[#E5DCC2] bg-white p-2 shadow-sm sm:size-16">
              <Image
                src="/images/logo-inp.png"
                alt="INP"
                width={56}
                height={56}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--inp-vert)]">INP Intranet</p>
              <p className="text-xs tracking-wide text-[#5A4733]">Espace professionnel</p>
            </div>
          </Link>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-[#E5DCC2] bg-white p-6 shadow-lg sm:p-8"
            noValidate
          >
            <h1 className="text-xl font-bold text-[#2A1F18] sm:text-2xl">Connexion</h1>
            <p className="mt-1 text-sm text-[#5A4733]">
              Identifiez-vous pour accéder au tableau de bord.
            </p>

            {serverError && (
              <div
                className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-semibold text-[#2A1F18]"
                >
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7355]" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    {...register("email")}
                    className={cn(fieldBase, errors.email && "border-red-400 ring-2 ring-red-200")}
                    placeholder="email@inp.gouv.sn"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-pwd"
                  className="mb-1.5 block text-xs font-semibold text-[#2A1F18]"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B7355]" />
                  <input
                    id="login-pwd"
                    type={isPasswordVisible ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password")}
                    className={cn(
                      fieldBase,
                      "pr-11",
                      errors.password && "border-red-400 ring-2 ring-red-200",
                    )}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={
                      isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
                    }
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-[#8B7355] outline-none transition-colors hover:text-[var(--inp-vert)] focus-visible:ring-2 focus-visible:ring-[var(--inp-vert)]/30"
                    onClick={() => setIsPasswordVisible((visible) => !visible)}
                  >
                    {isPasswordVisible ? (
                      <EyeOffIcon className="size-4" aria-hidden />
                    ) : (
                      <EyeIcon className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--inp-vert)] text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:mt-7 sm:h-12"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <Lock className="h-4 w-4" aria-hidden />
              )}
              {isSubmitting ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-[#7B4F2A] transition-colors hover:text-[#4A2F1A]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Retour au site public
          </Link>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthSessionProvider>
      <LoginForm />
    </AuthSessionProvider>
  );
}
