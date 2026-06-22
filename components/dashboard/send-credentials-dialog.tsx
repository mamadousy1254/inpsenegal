"use client";

import { useState } from "react";
import {
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  MailIcon,
  MessageSquareIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isValidSenegalPhone } from "@/lib/constants/phone";

export type CreatedUserCredentials = {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  password: string;
};

type SendCredentialsDialogProps = {
  credentials: CreatedUserCredentials | null;
  onOpenChange: (open: boolean) => void;
};

function CredentialRow({
  label,
  value,
  secret = false,
}: {
  label: string;
  value: string;
  secret?: boolean;
}) {
  const [visible, setVisible] = useState(!secret);

  const copyValue = async () => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copié`);
  };

  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <div className="mb-1 text-xs font-medium text-muted-foreground">
        {label}
      </div>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate font-mono text-sm">
          {visible ? value : "••••••••••••"}
        </span>
        {secret && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? (
              <EyeOffIcon className="size-3.5" />
            ) : (
              <EyeIcon className="size-3.5" />
            )}
          </Button>
        )}
        <Button type="button" variant="ghost" size="icon-xs" onClick={copyValue}>
          <CopyIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function SendCredentialsDialog({
  credentials,
  onOpenChange,
}: SendCredentialsDialogProps) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);

  const open = credentials !== null;
  const fullname = credentials
    ? `${credentials.firstname} ${credentials.lastname}`.trim()
    : "";
  const loginUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/login`
      : "/login";
  const canSendSms = credentials?.phone
    ? isValidSenegalPhone(credentials.phone)
    : false;

  const sendCredentials = async (channel: "email" | "sms") => {
    if (!credentials) return;

    const setLoading = channel === "email" ? setSendingEmail : setSendingSms;
    setLoading(true);

    try {
      const body =
        channel === "email"
          ? {
              channel,
              email: credentials.email,
              fullname,
              password: credentials.password,
              loginUrl,
            }
          : {
              channel,
              phone: credentials.phone,
              email: credentials.email,
              fullname,
              password: credentials.password,
              loginUrl,
            };

      const response = await fetch("/api/notifications/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible d'envoyer les identifiants");
        return;
      }

      toast.success(
        channel === "email"
          ? "E-mail envoyé avec succès"
          : "SMS envoyé avec succès",
        { description: fullname },
      );
    } catch {
      toast.error("Une erreur est survenue lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer les identifiants</DialogTitle>
          <DialogDescription>
            L&apos;utilisateur <strong>{fullname}</strong> a été créé. Vous
            pouvez lui transmettre ses identifiants par e-mail ou par SMS.
          </DialogDescription>
        </DialogHeader>

        {credentials && (
          <div className="space-y-2">
            <CredentialRow label="E-mail" value={credentials.email} />
            <CredentialRow
              label="Mot de passe"
              value={credentials.password}
              secret
            />
            <CredentialRow label="Page de connexion" value={loginUrl} />
            {credentials.phone && (
              <CredentialRow label="Téléphone" value={credentials.phone} />
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!canSendSms || sendingSms || sendingEmail}
            onClick={() => sendCredentials("sms")}
            title={
              canSendSms
                ? "Envoyer par SMS"
                : "Ajoutez un numéro valide (+221...) pour envoyer un SMS"
            }
          >
            {sendingSms ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <MessageSquareIcon />
            )}
            SMS
          </Button>
          <Button
            type="button"
            disabled={sendingEmail || sendingSms}
            onClick={() => sendCredentials("email")}
          >
            {sendingEmail ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <MailIcon />
            )}
            E-mail
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
