"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock3Icon, ShieldCheckIcon } from "lucide-react";

type MaintenancePageContentProps = {
  message?: string;
  loginHref?: string;
};

export function MaintenancePageContent({
  message,
  loginHref = "/login",
}: MaintenancePageContentProps) {
  const customMessage =
    message?.trim() ||
    "Nous réalisons actuellement une intervention technique pour améliorer nos services. Merci de votre compréhension.";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#2A1F18] text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(145deg, #1f1611 0%, #7B4F2A 42%, #3a2a1f 78%, #2A1F18 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 15% 20%, rgba(216,195,165,0.35) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 85% 75%, rgba(201,165,116,0.28) 0%, transparent 50%), url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-between px-6 py-10 sm:px-10 lg:px-14">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur-sm">
            <Image
              src="/images/logo-inp.png"
              alt="Logo INP"
              width={40}
              height={40}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-[#F3E6D0]">
              Institut national de Pédologie
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">
              République du Sénégal
            </p>
          </div>
        </motion.header>

        <main className="flex flex-1 flex-col justify-center py-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-4 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#D8C3A5]"
          >
            <Clock3Icon className="size-3.5" />
            Site en maintenance
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-3xl font-serif text-4xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            INP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-4 max-w-2xl text-xl font-medium text-[#F3E6D0] sm:text-2xl"
          >
            Nous revenons très bientôt
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {customMessage}
          </motion.p>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="border-t border-white/10 pt-6 text-xs text-white/45"
        >
          Ministère de l&apos;Agriculture — Institut national de Pédologie
        </motion.footer>
      </div>
    </div>
  );
}
