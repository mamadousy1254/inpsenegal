"use client";

import { useCallback, useEffect, useMemo, useState, type ElementType } from "react";
import { useSession } from "next-auth/react";
import {
  ArchiveIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  FileTextIcon,
  Loader2Icon,
  MapPinIcon,
  SendIcon,
  SendHorizontalIcon,
  UserCheckIcon,
  UserIcon,
  UsersIcon,
  VideoIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
  CONVOCATION_LOCATION_TYPE_LABELS,
  CONVOCATION_RESPONSE_LABELS,
  CONVOCATION_STATUS_LABELS,
  type ConvocationResponseStatus,
  type ConvocationStatus,
} from "@/lib/constants/convocation";
import {
  canManageConvocations,
  canViewAllConvocations,
} from "@/lib/permissions/can";
import type { UserRole } from "@/lib/permissions/roles";
import type { ConvocationEntry } from "@/lib/types/convocation";
import { cn } from "@/lib/utils";

type ConvocationDetailDialogProps = {
  convocationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
};

const STATUS_STYLES: Record<ConvocationStatus, string> = {
  brouillon: "bg-slate-500/10 text-slate-700 ring-slate-500/20",
  envoyee: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
  terminee: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  archivee: "bg-violet-500/10 text-violet-700 ring-violet-500/20",
  annulee: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
};

const RESPONSE_STYLES: Record<ConvocationResponseStatus, string> = {
  pending: "bg-amber-500/10 text-amber-800 ring-amber-500/20",
  present: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20",
  absent: "bg-rose-500/10 text-rose-700 ring-rose-500/20",
  excused: "bg-sky-500/10 text-sky-700 ring-sky-500/20",
};

const RESPONSE_BUTTON_STYLES: Record<
  Exclude<ConvocationResponseStatus, "pending">,
  { active: string; idle: string; icon: string }
> = {
  present: {
    active: "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-500/25",
    idle: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  absent: {
    active: "border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-500/25",
    idle: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60",
    icon: "text-rose-600 dark:text-rose-400",
  },
  excused: {
    active: "border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-500/25",
    idle: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-950/60",
    icon: "text-sky-600 dark:text-sky-400",
  },
};

function InfoCard({
  icon: Icon,
  iconClassName,
  title,
  children,
}: {
  icon: ElementType;
  iconClassName: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-muted/20 p-3.5">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
          iconClassName,
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <div className="mt-0.5 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConvocationDetailDialog({
  convocationId,
  open,
  onOpenChange,
  onUpdated,
}: ConvocationDetailDialogProps) {
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole | undefined;
  const userId = session?.user?.id;
  const canManage = role ? canManageConvocations(role) : false;
  const canViewFull = role ? canViewAllConvocations(role) : false;

  const [item, setItem] = useState<ConvocationEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState("");
  const [excuseReason, setExcuseReason] = useState("");
  const [minutes, setMinutes] = useState("");
  const [resendingUserId, setResendingUserId] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!convocationId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/convocations/${convocationId}`);
      if (!res.ok) {
        toast.error("Impossible de charger la convocation");
        return;
      }
      const data = (await res.json()) as ConvocationEntry;
      setItem(data);
      setMinutes(data.minutes ?? "");

      const myInvitee = data.invitees.find((i) => i.userId === userId);
      if (myInvitee && !myInvitee.ackAt) {
        await fetch(`/api/convocations/${convocationId}/ack`, { method: "POST" });
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [convocationId, userId]);

  useEffect(() => {
    if (open && convocationId) {
      fetchDetail();
    } else {
      setItem(null);
      setAttendanceCode("");
      setExcuseReason("");
    }
  }, [open, convocationId, fetchDetail]);

  const myInvitee = useMemo(
    () => item?.invitees.find((i) => i.userId === userId),
    [item, userId],
  );

  const isCreator = item?.createdById === userId;
  const canAdmin = canManage || isCreator;
  const showFullDetails = canViewFull || canAdmin;

  const handleRespond = async (responseStatus: ConvocationResponseStatus) => {
    if (!convocationId || responseStatus === "pending") return;
    if (responseStatus === "excused" && !excuseReason.trim()) {
      toast.error("Indiquez le motif d'excuse");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/convocations/${convocationId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseStatus, excuseReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur");
        return;
      }
      setItem(data);
      toast.success("Réponse enregistrée");
      onUpdated();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttendanceCode = async () => {
    if (!convocationId || !attendanceCode.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/convocations/${convocationId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "code", code: attendanceCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Code incorrect");
        return;
      }
      setItem(data);
      toast.success("Présence enregistrée");
      onUpdated();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSecretaryAttendance = async (inviteeUserId: string, present: boolean) => {
    if (!convocationId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/convocations/${convocationId}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "secretary", userId: inviteeUserId, present }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur");
        return;
      }
      setItem(data);
      onUpdated();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSend = async () => {
    if (!convocationId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/convocations/${convocationId}/send`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de l'envoi");
        return;
      }
      setItem(data);
      toast.success("Convocation envoyée");
      onUpdated();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (inviteeUserId: string) => {
    if (!convocationId) return;
    setResendingUserId(inviteeUserId);
    try {
      const res = await fetch(`/api/convocations/${convocationId}/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: inviteeUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors du renvoi");
        return;
      }
      setItem(data);
      toast.success("Convocation renvoyée");
      onUpdated();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setResendingUserId(null);
    }
  };

  const handleArchive = async () => {
    if (!convocationId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/convocations/${convocationId}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes: minutes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de l'archivage");
        return;
      }
      setItem(data);
      toast.success("Convocation archivée");
      onUpdated();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const canResendNotifications =
    canAdmin &&
    (item?.status === "envoyee" || item?.status === "terminee");

  const presentCount = item?.invitees.filter((i) => i.attendedAt).length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(720px,90dvh)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="relative shrink-0 overflow-hidden border-b border-sky-200/40 bg-gradient-to-br from-sky-500/10 via-[var(--inp-vert)]/5 to-emerald-500/10 px-5 py-4 dark:border-sky-900/30">
          <div className="absolute -top-6 -right-6 size-24 rounded-full bg-sky-500/10 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-emerald-500/10 blur-xl" />
          <div className="relative flex items-start gap-3 pr-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-600 text-white shadow-lg shadow-sky-500/30">
              <CalendarClockIcon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base leading-snug">
                {item?.title ?? "Convocation"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                {item ? formatDateTime(item.meetingAt) : "Chargement…"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Loader2Icon className="size-8 animate-spin text-sky-600" />
          </div>
        ) : item ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("ring-1 ring-inset", STATUS_STYLES[item.status])}>
                    {CONVOCATION_STATUS_LABELS[item.status]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-sky-200 text-sky-700 dark:border-sky-800 dark:text-sky-300"
                  >
                    {CONVOCATION_LOCATION_TYPE_LABELS[item.locationType]}
                  </Badge>
                  {showFullDetails && item.status !== "brouillon" && (
                    <Badge
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                    >
                      {presentCount}/{item.invitees.length} présents
                    </Badge>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoCard
                    icon={item.locationType === "presentiel" ? MapPinIcon : VideoIcon}
                    iconClassName={
                      item.locationType === "presentiel"
                        ? "bg-amber-500 text-white shadow-amber-500/25"
                        : "bg-violet-500 text-white shadow-violet-500/25"
                    }
                    title={item.locationType === "presentiel" ? "Lieu" : "Visio"}
                  >
                    {item.locationType === "presentiel" ? (
                      item.location
                    ) : (
                      <a
                        href={item.visioLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-violet-600 hover:underline dark:text-violet-400"
                      >
                        {item.visioLink}
                      </a>
                    )}
                  </InfoCard>
                  <InfoCard
                    icon={UserIcon}
                    iconClassName="bg-sky-500 text-white shadow-sky-500/25"
                    title="Organisateur"
                  >
                    {item.createdByFullname}
                  </InfoCard>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-slate-500 text-white shadow-sm shadow-slate-500/25">
                      <FileTextIcon className="size-3.5" />
                    </span>
                    <p className="text-sm font-medium">Ordre du jour</p>
                  </div>
                  <p className="whitespace-pre-wrap rounded-xl border bg-muted/30 p-3.5 text-sm leading-relaxed">
                    {item.agenda}
                  </p>
                </div>

                {item.preparatoryDocuments.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Documents préparatoires</p>
                    <ul className="space-y-1.5 text-sm">
                      {item.preparatoryDocuments.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <FileTextIcon className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                          {doc.url ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--inp-vert)] hover:underline"
                            >
                              {doc.name}
                            </a>
                          ) : (
                            doc.name
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {myInvitee &&
                  item.status !== "brouillon" &&
                  item.status !== "archivee" &&
                  item.status !== "annulee" && (
                    <div className="space-y-3 rounded-xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-sky-50/50 p-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-sky-950/20">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        Votre réponse
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            { status: "present" as const, label: "Présent", Icon: CheckCircle2Icon },
                            { status: "absent" as const, label: "Absent", Icon: XCircleIcon },
                            { status: "excused" as const, label: "Excusé", Icon: UserIcon },
                          ] as const
                        ).map(({ status, label, Icon }) => {
                          const styles = RESPONSE_BUTTON_STYLES[status];
                          const selected = myInvitee.responseStatus === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              disabled={submitting}
                              onClick={() => handleRespond(status)}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                                selected ? styles.active : styles.idle,
                              )}
                            >
                              <Icon
                                className={cn("size-4", !selected && styles.icon)}
                              />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      {(myInvitee.responseStatus === "excused" ||
                        excuseReason ||
                        myInvitee.excuseReason) && (
                        <textarea
                          value={excuseReason || myInvitee.excuseReason || ""}
                          onChange={(e) => setExcuseReason(e.target.value)}
                          placeholder="Motif d'excuse…"
                          rows={2}
                          className="flex min-h-16 w-full rounded-lg border border-sky-200 bg-white/80 px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-sky-400 focus-visible:ring-3 focus-visible:ring-sky-400/30 dark:border-sky-900 dark:bg-sky-950/20"
                        />
                      )}

                      {item.status === "envoyee" && !myInvitee.attendedAt && (
                        <div className="space-y-2 border-t border-emerald-200/60 pt-3 dark:border-emerald-900/40">
                          <Label
                            htmlFor="att-code"
                            className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-100"
                          >
                            <UserCheckIcon className="size-4 text-emerald-600" />
                            Émargement — code de présence
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="att-code"
                              value={attendanceCode}
                              onChange={(e) => setAttendanceCode(e.target.value)}
                              placeholder="Code à 6 chiffres"
                              maxLength={6}
                              className="font-mono tracking-widest"
                            />
                            <Button
                              type="button"
                              disabled={submitting}
                              onClick={handleAttendanceCode}
                              className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              <UserCheckIcon className="size-4" />
                              Valider
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {canAdmin && item.attendanceCode && item.status === "envoyee" && (
                  <div className="rounded-xl border border-dashed border-amber-300/70 bg-amber-50/60 px-4 py-3 text-sm dark:border-amber-800/50 dark:bg-amber-950/20">
                    <span className="font-medium text-amber-900 dark:text-amber-100">
                      Code de présence :{" "}
                    </span>
                    <span className="font-mono text-xl font-semibold tracking-[0.3em] text-amber-700 dark:text-amber-300">
                      {item.attendanceCode}
                    </span>
                  </div>
                )}

                {showFullDetails && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm shadow-indigo-500/25">
                        <UsersIcon className="size-3.5" />
                      </span>
                      <p className="text-sm font-medium">
                        Convoqués ({item.invitees.length})
                      </p>
                    </div>
                    <div className="space-y-2">
                      {item.invitees.map((invitee) => (
                        <div
                          key={invitee.userId}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2.5 text-sm"
                        >
                          <div>
                            <p className="font-medium">{invitee.fullname}</p>
                            <p className="text-xs text-muted-foreground">{invitee.email}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              className={cn(
                                "ring-1 ring-inset",
                                RESPONSE_STYLES[invitee.responseStatus],
                              )}
                            >
                              {CONVOCATION_RESPONSE_LABELS[invitee.responseStatus]}
                            </Badge>
                            {invitee.ackAt && (
                              <Badge
                                variant="outline"
                                className="border-sky-200 text-xs text-sky-700 dark:border-sky-800 dark:text-sky-300"
                              >
                                Accusé de réception ✓
                              </Badge>
                            )}
                            {invitee.attendedAt && (
                              <Badge
                                variant="outline"
                                className="border-emerald-200 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                              >
                                Émargé
                              </Badge>
                            )}
                            {canResendNotifications &&
                              !invitee.attendedAt &&
                              invitee.responseStatus !== "present" && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                disabled={
                                  submitting || resendingUserId === invitee.userId
                                }
                                onClick={() => handleResend(invitee.userId)}
                                className="text-sky-600 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/40"
                                title="Renvoyer la convocation à cet agent"
                              >
                                {resendingUserId === invitee.userId ? (
                                  <Loader2Icon className="size-3.5 animate-spin" />
                                ) : (
                                  <SendHorizontalIcon className="size-3.5" />
                                )}
                                Renvoyer
                              </Button>
                            )}
                            {canAdmin &&
                              item.status === "envoyee" &&
                              !invitee.attendedAt && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  disabled={submitting}
                                  onClick={() =>
                                    handleSecretaryAttendance(invitee.userId, true)
                                  }
                                  className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                                >
                                  <ClipboardCheckIcon className="size-3.5" />
                                  Marquer présent
                                </Button>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!showFullDetails && myInvitee && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm shadow-indigo-500/25">
                        <UserIcon className="size-3.5" />
                      </span>
                      <p className="text-sm font-medium">Votre participation</p>
                    </div>
                    <div className="rounded-xl border bg-card px-3 py-2.5 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={cn(
                            "ring-1 ring-inset",
                            RESPONSE_STYLES[myInvitee.responseStatus],
                          )}
                        >
                          {CONVOCATION_RESPONSE_LABELS[myInvitee.responseStatus]}
                        </Badge>
                        {myInvitee.ackAt && (
                          <Badge
                            variant="outline"
                            className="border-sky-200 text-xs text-sky-700 dark:border-sky-800 dark:text-sky-300"
                          >
                            Accusé de réception ✓
                          </Badge>
                        )}
                        {myInvitee.attendedAt && (
                          <Badge
                            variant="outline"
                            className="border-emerald-200 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                          >
                            Émargé
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {canAdmin && item.status !== "archivee" && (
                  <div className="space-y-2">
                    <Label htmlFor="minutes" className="flex items-center gap-1.5">
                      <ArchiveIcon className="size-4 text-violet-600" />
                      Compte rendu (archivage)
                    </Label>
                    <textarea
                      id="minutes"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      rows={4}
                      placeholder="Compte rendu de la réunion…"
                      className="flex min-h-24 w-full rounded-lg border border-violet-200 bg-violet-50/30 px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-violet-400 focus-visible:ring-3 focus-visible:ring-violet-400/30 dark:border-violet-900 dark:bg-violet-950/20"
                    />
                  </div>
                )}

                {item.status === "archivee" && item.minutes && (
                  <div>
                    <p className="mb-1 flex items-center gap-1.5 text-sm font-medium">
                      <ArchiveIcon className="size-4 text-violet-600" />
                      Compte rendu archivé
                    </p>
                    <p className="whitespace-pre-wrap rounded-xl border border-violet-200/60 bg-violet-50/40 p-3.5 text-sm dark:border-violet-900/40 dark:bg-violet-950/20">
                      {item.minutes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="shrink-0 gap-2 border-t bg-muted/30 px-5 py-4">
              {canAdmin && item.status === "brouillon" && (
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={handleSend}
                  className="bg-sky-600 text-white hover:bg-sky-700"
                >
                  {submitting ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <SendIcon className="size-4" />
                  )}
                  Envoyer la convocation
                </Button>
              )}
              {canAdmin &&
                (item.status === "envoyee" || item.status === "terminee") && (
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={handleArchive}
                    className="bg-violet-600 text-white hover:bg-violet-700"
                  >
                    <ArchiveIcon className="size-4" />
                    Archiver
                  </Button>
                )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
