"use client";

import { useEffect, useState } from "react";
import {
  Loader2Icon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  UserIcon,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidSenegalPhone } from "@/lib/constants/phone";
import type { DashboardUser } from "@/lib/types/dashboard-user";
import { cn } from "@/lib/utils";

const SMS_MAX_LENGTH = 480;
const DEFAULT_SUBJECT = "Message INP Intranet";

type MessageChannel = "email" | "sms";

type SendMessageDialogProps = {
  user: DashboardUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SendMessageDialog({
  user,
  open,
  onOpenChange,
}: SendMessageDialogProps) {
  const [channel, setChannel] = useState<MessageChannel>("email");
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingContact, setLoadingContact] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fullname = user ? `${user.firstname} ${user.lastname}`.trim() : "";
  const canSendSms = phone ? isValidSenegalPhone(phone) : false;

  useEffect(() => {
    if (!open || !user) {
      setChannel("email");
      setSubject(DEFAULT_SUBJECT);
      setMessage("");
      setPhone(user?.phone ?? "");
      return;
    }

    setChannel("email");
    setPhone(user.phone ?? "");
    setSubject(DEFAULT_SUBJECT);
    setMessage("");

    if (user.phone) return;

    let cancelled = false;

    async function fetchPhone() {
      setLoadingContact(true);

      try {
        const response = await fetch(`/api/users/${user._id}`);
        const result = await response.json();

        if (!cancelled && response.ok && result.user?.phone) {
          setPhone(result.user.phone);
        }
      } catch {
        // Le SMS restera indisponible si le numéro est introuvable.
      } finally {
        if (!cancelled) {
          setLoadingContact(false);
        }
      }
    }

    fetchPhone();

    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const sendMessage = async () => {
    if (!user || !message.trim()) {
      toast.error("Veuillez saisir un message");
      return;
    }

    if (channel === "email" && !subject.trim()) {
      toast.error("Veuillez saisir un objet");
      return;
    }

    if (channel === "sms" && !canSendSms) {
      toast.error("Numéro de téléphone invalide pour l'envoi SMS");
      return;
    }

    if (channel === "sms" && message.length > SMS_MAX_LENGTH) {
      toast.error(`Le SMS ne peut pas dépasser ${SMS_MAX_LENGTH} caractères`);
      return;
    }

    setIsSending(true);

    try {
      const body =
        channel === "email"
          ? {
              channel,
              email: user.email,
              fullname,
              subject: subject.trim(),
              message: message.trim(),
            }
          : {
              channel,
              phone,
              fullname,
              message: message.trim(),
            };

      const response = await fetch("/api/notifications/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible d'envoyer le message");
        return;
      }

      toast.success(
        channel === "email"
          ? "E-mail envoyé avec succès"
          : "SMS envoyé avec succès",
        { description: fullname },
      );

      onOpenChange(false);
    } catch {
      toast.error("Une erreur est survenue lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  const canSubmit =
    message.trim().length > 0 &&
    !isSending &&
    (channel === "email"
      ? subject.trim().length > 0
      : canSendSms && !loadingContact);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Envoyer un message</DialogTitle>
          <DialogDescription>
            Choisissez le mode d&apos;envoi et rédigez votre message pour{" "}
            <strong>{fullname}</strong>.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-sm">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <UserIcon className="size-4 text-[var(--inp-vert)]" />
                {fullname}
              </div>
            </div>

            <Tabs
              value={channel}
              onValueChange={(value) => setChannel(value as MessageChannel)}
            >
              <TabsList className="grid h-10 w-full grid-cols-2">
                <TabsTrigger value="email" className="gap-2">
                  <MailIcon className="size-4" />
                  Par e-mail
                </TabsTrigger>
                <TabsTrigger
                  value="sms"
                  className="gap-2"
                  disabled={loadingContact}
                >
                  <MessageSquareIcon className="size-4" />
                  Par SMS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-4 space-y-4">
                <div className="rounded-lg border border-sky-200/60 bg-sky-50/50 px-3 py-2.5 text-sm dark:border-sky-900/40 dark:bg-sky-950/20">
                  <p className="flex items-center gap-2 font-medium text-sky-900 dark:text-sky-100">
                    <MailIcon className="size-4" />
                    Destinataire e-mail
                  </p>
                  <p className="mt-1 pl-6 text-muted-foreground">{user.email}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message-subject">Objet</Label>
                  <Input
                    id="message-subject"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Objet du message"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message-body-email">Message</Label>
                  <textarea
                    id="message-body-email"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    placeholder="Saisissez votre message…"
                    className="flex min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                  />
                </div>
              </TabsContent>

              <TabsContent value="sms" className="mt-4 space-y-4">
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-sm",
                    canSendSms
                      ? "border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                      : "border-amber-200/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20",
                  )}
                >
                  <p className="flex items-center gap-2 font-medium text-foreground">
                    <PhoneIcon className="size-4" />
                    Destinataire SMS
                  </p>
                  {loadingContact ? (
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">
                      Recherche du numéro…
                    </p>
                  ) : canSendSms ? (
                    <p className="mt-1 pl-6 text-muted-foreground">{phone}</p>
                  ) : (
                    <p className="mt-1 pl-6 text-xs text-amber-800 dark:text-amber-200">
                      Aucun numéro valide (+221…) enregistré pour cet
                      utilisateur.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message-body-sms">Message SMS</Label>
                    <span
                      className={cn(
                        "text-xs text-muted-foreground",
                        message.length > SMS_MAX_LENGTH && "text-destructive",
                      )}
                    >
                      {message.length}/{SMS_MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="message-body-sms"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={5}
                    maxLength={SMS_MAX_LENGTH}
                    placeholder="Saisissez votre SMS…"
                    className="flex min-h-28 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSending}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={sendMessage}>
            {isSending ? (
              <>
                <Loader2Icon className="animate-spin" />
                Envoi…
              </>
            ) : channel === "email" ? (
              <>
                <MailIcon />
                Envoyer l&apos;e-mail
              </>
            ) : (
              <>
                <MessageSquareIcon />
                Envoyer le SMS
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
