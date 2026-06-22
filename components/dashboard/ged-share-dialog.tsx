"use client";

import { useEffect, useState, type ElementType, type ReactNode } from "react";
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  FileTextIcon,
  Link2Icon,
  Loader2Icon,
  MailIcon,
  MessageSquareIcon,
  SendIcon,
  Share2Icon,
  TimerIcon,
} from "lucide-react";
import { toast } from "sonner";

import { GedDocumentIcon } from "@/components/dashboard/ged-document-icon";
import {
  GedShareRecipientSection,
  type GedShareRecipientMode,
  type GedShareRecipientUser,
} from "@/components/dashboard/ged-share-recipient-section";
import { NotificationChannelPicker } from "@/components/dashboard/notification-channel-picker";
import { formatBytes } from "@/components/dashboard/ged-views";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NotifierChannel } from "@/lib/constants/notifications";
import {
  GED_DEFAULT_SHARE_LINK_MINUTES,
  GED_SHARE_LINK_DURATIONS,
  formatGedShareDuration,
  type GedShareLinkDurationMinutes,
} from "@/lib/constants/ged";
import { isValidSenegalPhone } from "@/lib/constants/phone";
import type { GedFileEntry } from "@/lib/services/ged/serialize-ged";
import { cn } from "@/lib/utils";

const SMS_MAX_LENGTH = 480;

const SELECT_IN_DIALOG_PROPS = {
  side: "bottom" as const,
  alignItemWithTrigger: false,
  className: "z-[200] max-h-64",
};

type GedShareDialogProps = {
  file: GedFileEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SectionAccent = "sky" | "violet" | "emerald";

const SECTION_STYLES: Record<SectionAccent, { icon: string }> = {
  sky: {
    icon: "bg-sky-500 text-white shadow-sky-500/25 shadow-sm",
  },
  violet: {
    icon: "bg-violet-500 text-white shadow-violet-500/25 shadow-sm",
  },
  emerald: {
    icon: "bg-emerald-500 text-white shadow-emerald-500/25 shadow-sm",
  },
};

function ShareSection({
  title,
  description,
  icon: Icon,
  accent,
  step,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon: ElementType;
  accent: SectionAccent;
  step?: number;
  children: ReactNode;
  className?: string;
}) {
  const styles = SECTION_STYLES[accent];

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            styles.icon,
          )}
        >
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            {step != null ? (
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground",
                )}
              >
                {step}
              </span>
            ) : null}
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="ml-12">{children}</div>
    </section>
  );
}

export function GedShareDialog({
  file,
  open,
  onOpenChange,
}: GedShareDialogProps) {
  const [channel, setChannel] = useState<NotifierChannel>("email");
  const [recipientMode, setRecipientMode] =
    useState<GedShareRecipientMode>("user");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<GedShareRecipientUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] =
    useState<GedShareLinkDurationMinutes>(GED_DEFAULT_SHARE_LINK_MINUTES);
  const [shareUrl, setShareUrl] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !file) {
      setChannel("email");
      setRecipientMode("user");
      setSelectedUserId("");
      setUserSearch("");
      setUsers([]);
      setRecipientName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setExpiresInMinutes(GED_DEFAULT_SHARE_LINK_MINUTES);
      setShareUrl("");
      setCopied(false);
      return;
    }

    let cancelled = false;

    async function fetchLink() {
      setLoadingLink(true);
      try {
        const response = await fetch(`/api/ged/files/${file?._id}/share-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expiresInMinutes }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!cancelled) setShareUrl(data.shareUrl);
      } catch {
        if (!cancelled) {
          toast.error("Impossible de générer le lien de partage");
        }
      } finally {
        if (!cancelled) setLoadingLink(false);
      }
    }

    fetchLink();

    return () => {
      cancelled = true;
    };
  }, [open, file, expiresInMinutes]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setUsersLoading(true);
      try {
        const params = new URLSearchParams();
        if (userSearch.trim()) params.set("search", userSearch.trim());
        const response = await fetch(`/api/ged/recipients?${params.toString()}`);
        const data = await response.json();
        if (!cancelled && response.ok) {
          setUsers(Array.isArray(data.users) ? data.users : []);
        }
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, userSearch]);

  const selectedUser =
    users.find((user) => user._id === selectedUserId) ?? null;

  const durationLabel = formatGedShareDuration(expiresInMinutes);

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success("Lien copié dans le presse-papier");
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const sendShare = async () => {
    if (!file) return;

    if (recipientMode === "manual") {
      if (!recipientName.trim()) {
        toast.error("Veuillez saisir le nom du destinataire");
        return;
      }

      if (channel === "email" && !email.trim()) {
        toast.error("Veuillez saisir l'e-mail du destinataire");
        return;
      }

      if (channel === "sms" && !isValidSenegalPhone(phone)) {
        toast.error("Numéro sénégalais invalide (+221XXXXXXXXX)");
        return;
      }
    } else if (!selectedUserId) {
      toast.error("Veuillez sélectionner un collaborateur");
      return;
    } else if (channel === "sms" && !isValidSenegalPhone(selectedUser?.phone ?? "")) {
      toast.error("Ce collaborateur n'a pas de numéro SMS valide");
      return;
    }

    setIsSending(true);

    try {
      const sharePayload = {
        recipientMode,
        channel,
        expiresInMinutes,
        ...(message.trim() && { message: message.trim() }),
      };

      const body =
        recipientMode === "user"
          ? {
              ...sharePayload,
              userId: selectedUserId,
            }
          : channel === "email"
            ? {
                ...sharePayload,
                recipientName: recipientName.trim(),
                email: email.trim(),
              }
            : {
                ...sharePayload,
                recipientName: recipientName.trim(),
                phone: phone.trim(),
              };

      const response = await fetch(`/api/ged/files/${file._id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible d'envoyer le partage");
        return;
      }

      if (result.alreadyShared) {
        toast.info(result.message);
      } else {
        toast.success(result.message ?? "Document partagé avec succès");
      }
      onOpenChange(false);
    } catch {
      toast.error("Une erreur est survenue lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  const canSubmit =
    !!file &&
    !isSending &&
    !loadingLink &&
    (recipientMode === "user"
      ? selectedUserId.length > 0 &&
        (channel === "email" || isValidSenegalPhone(selectedUser?.phone ?? ""))
      : recipientName.trim().length > 0 &&
        (channel === "email"
          ? email.trim().length > 0
          : isValidSenegalPhone(phone)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(580px,90dvh)] max-w-md flex-col gap-0 overflow-hidden border-violet-200/40 p-0 sm:max-w-md dark:border-violet-900/30">
        <DialogHeader className="relative shrink-0 overflow-hidden border-b border-violet-200/40 bg-gradient-to-br from-violet-500/10 via-[var(--inp-vert)]/5 to-sky-500/10 px-5 py-4 dark:border-violet-900/30">
          <div className="absolute -top-6 -right-6 size-24 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-sky-500/10 blur-xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30">
              <Share2Icon className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base">Partager le document</DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-1.5 text-xs">
                <TimerIcon className="size-3.5 text-violet-600 dark:text-violet-400" />
                Lien sécurisé · valide{" "}
                <span className="font-medium text-violet-700 dark:text-violet-300">
                  {durationLabel.toLowerCase()}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {file && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-xl border border-sky-200/70 bg-gradient-to-r from-sky-50 to-sky-50/30 px-3.5 py-3 dark:border-sky-900/50 dark:from-sky-950/40 dark:to-sky-950/10">
                <div className="absolute top-0 right-0 size-20 translate-x-6 -translate-y-6 rounded-full bg-sky-400/10" />
                <div className="relative flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-sky-200/60 dark:bg-sky-950 dark:ring-sky-800/60">
                    <GedDocumentIcon
                      itemType="file"
                      mimeType={file.mimeType}
                      name={file.name}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-sky-950 dark:text-sky-50">
                      {file.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-sky-700/70 dark:text-sky-300/70">
                      <FileTextIcon className="size-3" />
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>
              </div>

              <ShareSection
                step={1}
                title="Lien de partage"
                description="Copiez le lien ou envoyez-le directement au destinataire."
                icon={Link2Icon}
                accent="violet"
              >
                <div className="space-y-3 rounded-xl border border-violet-200/50 bg-violet-50/30 p-3 dark:border-violet-900/40 dark:bg-violet-950/15">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="ged-share-duration"
                      className="flex items-center gap-1.5 text-violet-900/80 dark:text-violet-200/80"
                    >
                      <ClockIcon className="size-3.5" />
                      Durée de validité
                    </Label>
                    <Select
                      value={String(expiresInMinutes)}
                      onValueChange={(value) =>
                        setExpiresInMinutes(
                          Number(value) as GedShareLinkDurationMinutes,
                        )
                      }
                      disabled={isSending}
                    >
                      <SelectTrigger
                        id="ged-share-duration"
                        className="h-9 w-full border-violet-200/60 bg-background dark:border-violet-900/50"
                      >
                        <SelectValue placeholder="Choisir une durée">
                          {formatGedShareDuration(expiresInMinutes)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent {...SELECT_IN_DIALOG_PROPS}>
                        <SelectGroup>
                          {GED_SHARE_LINK_DURATIONS.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={String(option.value)}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Link2Icon className="absolute top-2.5 left-2.5 size-3.5 text-violet-500/70" />
                      <Input
                        readOnly
                        value={
                          loadingLink
                            ? "Génération du lien…"
                            : shareUrl || "—"
                        }
                        className="h-9 truncate border-violet-200/50 bg-background pl-8 font-mono text-[11px] text-violet-950/80 dark:border-violet-900/40 dark:text-violet-100/80"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "shrink-0 transition-colors",
                        copied
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "border-violet-200/70 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-900/50 dark:hover:bg-violet-950/30",
                      )}
                      disabled={!shareUrl || loadingLink}
                      onClick={copyLink}
                      title="Copier le lien"
                    >
                      {loadingLink ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : copied ? (
                        <CheckIcon className="size-4" />
                      ) : (
                        <CopyIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                  <p className="flex items-center gap-1.5 rounded-md bg-violet-100/60 px-2 py-1.5 text-[11px] text-violet-800/80 dark:bg-violet-950/40 dark:text-violet-200/80">
                    <ClockIcon className="size-3 shrink-0" />
                    Expire {durationLabel.toLowerCase()} après création du lien
                  </p>
                </div>
              </ShareSection>

              <ShareSection
                step={2}
                title="Envoyer au destinataire"
                description="Le lien sera inclus automatiquement dans le message."
                icon={SendIcon}
                accent="emerald"
              >
                <div className="space-y-4 rounded-xl border border-emerald-200/50 bg-emerald-50/20 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                  <NotificationChannelPicker
                    id="ged-share-channel"
                    value={channel}
                    onChange={setChannel}
                    label="Mode d'envoi"
                    disabled={isSending}
                  />

                  <GedShareRecipientSection
                    mode={recipientMode}
                    onModeChange={(mode) => {
                      setRecipientMode(mode);
                      if (mode === "user") {
                        setRecipientName("");
                        setEmail("");
                        setPhone("");
                      } else {
                        setSelectedUserId("");
                      }
                    }}
                    users={users}
                    usersLoading={usersLoading}
                    userSearch={userSearch}
                    onUserSearchChange={setUserSearch}
                    selectedUserId={selectedUserId}
                    onSelectUser={setSelectedUserId}
                    recipientName={recipientName}
                    onRecipientNameChange={setRecipientName}
                    email={email}
                    onEmailChange={setEmail}
                    phone={phone}
                    onPhoneChange={setPhone}
                    channel={channel}
                    disabled={isSending}
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Label
                        htmlFor="ged-share-message"
                        className="flex items-center gap-1.5 text-emerald-900/80 dark:text-emerald-200/80"
                      >
                        <MessageSquareIcon className="size-3.5" />
                        Message{" "}
                        <span className="font-normal text-muted-foreground">
                          (optionnel)
                        </span>
                      </Label>
                      {channel === "sms" ? (
                        <span
                          className={cn(
                            "rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums font-medium text-muted-foreground",
                            message.length > SMS_MAX_LENGTH && "bg-destructive/10 text-destructive",
                          )}
                        >
                          {message.length}/{SMS_MAX_LENGTH}
                        </span>
                      ) : null}
                    </div>
                    <textarea
                      id="ged-share-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ajoutez un message personnel…"
                      rows={2}
                      maxLength={channel === "sms" ? SMS_MAX_LENGTH : 2000}
                      disabled={isSending}
                      className="flex min-h-16 w-full resize-none rounded-lg border border-emerald-200/50 bg-background px-2.5 py-2 text-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-emerald-400 focus-visible:ring-3 focus-visible:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-emerald-900/40"
                    />
                  </div>
                </div>
              </ShareSection>
            </div>
          </div>
        )}

        <DialogFooter className="shrink-0 gap-2 border-t border-violet-200/30 bg-gradient-to-r from-muted/30 to-violet-50/20 px-5 py-3 dark:border-violet-900/30 dark:from-muted/10 dark:to-violet-950/10 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
            className="border-violet-200/60 dark:border-violet-900/50"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={sendShare}
            disabled={!canSubmit}
            className={cn(
              "gap-2 shadow-sm",
              channel === "email"
                ? "bg-sky-600 text-white hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500"
                : "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500",
            )}
          >
            {isSending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Envoi…
              </>
            ) : channel === "email" ? (
              <>
                <MailIcon className="size-4" />
                Envoyer par e-mail
              </>
            ) : (
              <>
                <MessageSquareIcon className="size-4" />
                Envoyer par SMS
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
