"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClockIcon,
  CheckIcon,
  Loader2Icon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import { toast } from "sonner";

import { NotificationChannelPicker } from "@/components/dashboard/notification-channel-picker";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONVOCATION_LOCATION_TYPE_LABELS,
  CONVOCATION_TARGET_MODE_LABELS,
  CONVOCATION_TARGET_MODES,
  type ConvocationLocationType,
  type ConvocationTargetMode,
} from "@/lib/constants/convocation";
import type { NotifierChannel } from "@/lib/constants/notifications";
import { cn } from "@/lib/utils";

type UserOption = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  occupation?: string;
};

type InviteePreview = {
  userId: string;
  fullname: string;
  email: string;
  phone?: string;
  service?: string;
  direction?: string;
  section?: string;
};

type FilterOptions = {
  services: string[];
  directions: string[];
  sections: string[];
};

type PreparatoryDoc = {
  name: string;
  url: string;
};

type CreateConvocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const SELECT_IN_DIALOG = {
  side: "bottom" as const,
  alignItemWithTrigger: false,
  className: "z-[200] max-h-64",
};

function InviteePreviewPanel({
  loading,
  invitees,
  emptyMessage,
}: {
  loading: boolean;
  invitees: InviteePreview[];
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-4 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Chargement des agents concernés…
      </div>
    );
  }

  if (!invitees.length) {
    return (
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
      <p className="text-xs font-medium text-muted-foreground">
        {invitees.length} agent{invitees.length > 1 ? "s" : ""} seront convoqué
        {invitees.length > 1 ? "s" : ""}
      </p>
      <div className="max-h-40 overflow-y-auto overscroll-contain pr-1">
        <ul className="space-y-1">
          {invitees.map((invitee) => (
            <li
              key={invitee.userId}
              className="rounded-lg border border-transparent bg-background/70 px-2.5 py-2 text-sm"
            >
              <p className="font-medium text-foreground">{invitee.fullname}</p>
              <p className="truncate text-xs text-muted-foreground">
                {invitee.email}
                {invitee.service ? ` · ${invitee.service}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CreateConvocationDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateConvocationDialogProps) {
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("09:00");
  const [locationType, setLocationType] =
    useState<ConvocationLocationType>("presentiel");
  const [location, setLocation] = useState("");
  const [visioLink, setVisioLink] = useState("");
  const [agenda, setAgenda] = useState("");
  const [docs, setDocs] = useState<PreparatoryDoc[]>([]);
  const [targetMode, setTargetMode] = useState<ConvocationTargetMode>("individual");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [service, setService] = useState("");
  const [direction, setDirection] = useState("");
  const [section, setSection] = useState("");
  const [notifyChannel, setNotifyChannel] = useState<NotifierChannel>("email");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [options, setOptions] = useState<FilterOptions>({
    services: [],
    directions: [],
    sections: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [sendNow, setSendNow] = useState(true);
  const [previewInvitees, setPreviewInvitees] = useState<InviteePreview[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  const reset = useCallback(() => {
    setTitle("");
    setMeetingDate("");
    setMeetingTime("09:00");
    setLocationType("presentiel");
    setLocation("");
    setVisioLink("");
    setAgenda("");
    setDocs([]);
    setTargetMode("individual");
    setSelectedUserIds([]);
    setService("");
    setDirection("");
    setSection("");
    setNotifyChannel("email");
    setUserSearch("");
    setSendNow(true);
    setPreviewInvitees([]);
  }, []);

  useEffect(() => {
    if (!open) return;
    reset();
    fetch("/api/convocations/options")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setOptions(data);
      })
      .catch(() => undefined);
  }, [open, reset]);

  useEffect(() => {
    if (!open || targetMode !== "individual") return;
    const params = new URLSearchParams();
    if (userSearch.trim()) params.set("search", userSearch.trim());
    fetch(`/api/ged/recipients?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setUsers(Array.isArray(data?.users) ? data.users : []);
      })
      .catch(() => setUsers([]));
  }, [open, targetMode, userSearch]);

  useEffect(() => {
    if (!open || targetMode === "individual") {
      setPreviewInvitees([]);
      return;
    }

    const filterValue =
      targetMode === "service"
        ? service
        : targetMode === "direction"
          ? direction
          : targetMode === "section"
            ? section
            : "";

    if (!filterValue) {
      setPreviewInvitees([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const params = new URLSearchParams({ targetMode });
        if (targetMode === "service") params.set("service", filterValue);
        if (targetMode === "direction") params.set("direction", filterValue);
        if (targetMode === "section") params.set("section", filterValue);

        const res = await fetch(
          `/api/convocations/preview-invitees?${params.toString()}`,
        );
        const data = await res.json();
        if (!cancelled) {
          setPreviewInvitees(Array.isArray(data?.invitees) ? data.invitees : []);
        }
      } catch {
        if (!cancelled) setPreviewInvitees([]);
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, targetMode, service, direction, section]);

  const filteredUsers = useMemo(() => users, [users]);

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const addDoc = () => {
    setDocs((prev) => [...prev, { name: "", url: "" }]);
  };

  const updateDoc = (index: number, field: keyof PreparatoryDoc, value: string) => {
    setDocs((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, [field]: value } : doc)),
    );
  };

  const removeDoc = (index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("L'objet est requis");
      return;
    }
    if (!meetingDate) {
      toast.error("La date est requise");
      return;
    }
    if (!agenda.trim()) {
      toast.error("L'ordre du jour est requis");
      return;
    }
    if (locationType === "presentiel" && !location.trim()) {
      toast.error("Le lieu est requis");
      return;
    }
    if (locationType === "visio" && !visioLink.trim()) {
      toast.error("Le lien visio est requis");
      return;
    }
    if (targetMode === "individual" && !selectedUserIds.length) {
      toast.error("Sélectionnez au moins un agent");
      return;
    }
    if (targetMode === "service" && !service) {
      toast.error("Sélectionnez un service");
      return;
    }
    if (targetMode === "direction" && !direction) {
      toast.error("Sélectionnez une direction");
      return;
    }
    if (targetMode === "section" && !section) {
      toast.error("Sélectionnez une section");
      return;
    }

    const meetingAt = new Date(`${meetingDate}T${meetingTime}:00`).toISOString();

    setSubmitting(true);
    try {
      const res = await fetch("/api/convocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          meetingAt,
          locationType,
          location: locationType === "presentiel" ? location.trim() : undefined,
          visioLink: locationType === "visio" ? visioLink.trim() : undefined,
          agenda: agenda.trim(),
          preparatoryDocuments: docs.filter((d) => d.name.trim()),
          notifyChannel,
          targetMode,
          userIds: targetMode === "individual" ? selectedUserIds : undefined,
          service: targetMode === "service" ? service : undefined,
          direction: targetMode === "direction" ? direction : undefined,
          section: targetMode === "section" ? section : undefined,
          sendNow,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de la création");
        return;
      }

      if (data.sendError) {
        toast.warning(`Convocation créée mais envoi partiel : ${data.sendError}`);
      } else if (sendNow) {
        toast.success("Convocation créée et envoyée");
      } else {
        toast.success("Convocation enregistrée en brouillon");
      }

      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(680px,90dvh)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="relative shrink-0 overflow-hidden border-b border-emerald-200/40 bg-gradient-to-br from-emerald-500/10 via-[var(--inp-vert)]/5 to-sky-500/10 px-5 py-4 dark:border-emerald-900/30">
          <div className="absolute -top-6 -right-6 size-24 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative flex items-center gap-3 pr-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-[var(--inp-vert)] text-white shadow-lg shadow-emerald-500/30">
              <CalendarClockIcon className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base">Nouvelle convocation</DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                Créez une convocation à réunion et sélectionnez les agents à convoquer.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conv-title">Objet *</Label>
                <Input
                  id="conv-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex. Conseil de direction du mois de juin"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="conv-date">Date *</Label>
                  <Input
                    id="conv-date"
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conv-time">Heure *</Label>
                  <Input
                    id="conv-time"
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Format *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["presentiel", "visio"] as ConvocationLocationType[]).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setLocationType(type)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                          locationType === type
                            ? type === "presentiel"
                              ? "border-amber-500 bg-amber-50 text-amber-800 shadow-sm shadow-amber-500/15 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                              : "border-violet-500 bg-violet-50 text-violet-800 shadow-sm shadow-violet-500/15 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200"
                            : "border-border text-muted-foreground hover:bg-muted/50",
                        )}
                      >
                        {type === "presentiel" ? (
                          <MapPinIcon
                            className={cn(
                              "size-4",
                              locationType === type
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-amber-500/70",
                            )}
                          />
                        ) : (
                          <VideoIcon
                            className={cn(
                              "size-4",
                              locationType === type
                                ? "text-violet-600 dark:text-violet-400"
                                : "text-violet-500/70",
                            )}
                          />
                        )}
                        {CONVOCATION_LOCATION_TYPE_LABELS[type]}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {locationType === "presentiel" ? (
                <div className="space-y-2">
                  <Label htmlFor="conv-location">Lieu *</Label>
                  <Input
                    id="conv-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Salle de conférence, étage…"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="conv-visio">Lien visio *</Label>
                  <Input
                    id="conv-visio"
                    value={visioLink}
                    onChange={(e) => setVisioLink(e.target.value)}
                    placeholder="https://meet…"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="conv-agenda">Ordre du jour *</Label>
                <textarea
                  id="conv-agenda"
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
                  rows={4}
                  placeholder="Points à l'ordre du jour…"
                  className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Documents préparatoires</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDoc}
                    className="border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950/40"
                  >
                    <PlusIcon className="size-3.5" />
                    Ajouter
                  </Button>
                </div>
                {docs.map((doc, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={doc.name}
                      onChange={(e) => updateDoc(index, "name", e.target.value)}
                      placeholder="Nom du document"
                      className="flex-1"
                    />
                    <Input
                      value={doc.url}
                      onChange={(e) => updateDoc(index, "url", e.target.value)}
                      placeholder="Lien (optionnel)"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeDoc(index)}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Convoquer *</Label>
                <Select
                  value={targetMode}
                  onValueChange={(v) => setTargetMode(v as ConvocationTargetMode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir qui convoquer">
                      {CONVOCATION_TARGET_MODE_LABELS[targetMode]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent {...SELECT_IN_DIALOG}>
                    {CONVOCATION_TARGET_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {CONVOCATION_TARGET_MODE_LABELS[mode]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {targetMode === "individual" && (
                <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Rechercher un agent…"
                      className="pl-9"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto overscroll-contain pr-1">
                    <div className="space-y-1">
                      {filteredUsers.map((user) => {
                        const selected = selectedUserIds.includes(user._id);
                        return (
                          <button
                            key={user._id}
                            type="button"
                            onClick={() => toggleUser(user._id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-all",
                              selected
                                ? "border-[var(--inp-vert)] bg-[var(--inp-vert)]/5 shadow-sm ring-1 ring-[var(--inp-vert)]/20"
                                : "border-transparent hover:border-border hover:bg-muted/60",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                                selected
                                  ? "border-[var(--inp-vert)] bg-[var(--inp-vert)] text-white"
                                  : "border-muted-foreground/30 bg-background",
                              )}
                            >
                              {selected && <CheckIcon className="size-3" strokeWidth={3} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-foreground">
                                {user.firstname} {user.lastname}
                              </span>
                              {user.occupation && (
                                <span className="block truncate text-xs text-muted-foreground">
                                  {user.occupation}
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {selectedUserIds.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {selectedUserIds.length} agent(s) sélectionné(s)
                    </p>
                  )}
                </div>
              )}

              {targetMode === "service" && (
                <div className="space-y-2">
                  <Select value={service} onValueChange={(v) => setService(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un service" />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      {options.services.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {service ? (
                    <InviteePreviewPanel
                      loading={previewLoading}
                      invitees={previewInvitees}
                      emptyMessage="Aucun agent actif trouvé pour ce service. Vérifiez que le champ « Service » est bien renseigné dans les fiches utilisateur."
                    />
                  ) : null}
                </div>
              )}

              {targetMode === "direction" && (
                <div className="space-y-2">
                  <Select value={direction} onValueChange={(v) => setDirection(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une direction" />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      {options.directions.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {direction ? (
                    <InviteePreviewPanel
                      loading={previewLoading}
                      invitees={previewInvitees}
                      emptyMessage="Aucun agent actif trouvé pour cette direction."
                    />
                  ) : null}
                </div>
              )}

              {targetMode === "section" && (
                <div className="space-y-2">
                  <Select value={section} onValueChange={(v) => setSection(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une section / région" />
                    </SelectTrigger>
                    <SelectContent {...SELECT_IN_DIALOG}>
                      {options.sections.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {section ? (
                    <InviteePreviewPanel
                      loading={previewLoading}
                      invitees={previewInvitees}
                      emptyMessage="Aucun agent actif trouvé pour cette section / région."
                    />
                  ) : null}
                </div>
              )}

              <NotificationChannelPicker
                value={notifyChannel}
                onChange={setNotifyChannel}
                description={
                  notifyChannel === "sms"
                    ? "Envoi par SMS (+221). Si le numéro est absent ou invalide, l'e-mail sera utilisé en secours."
                    : "Envoi par e-mail à l'adresse professionnelle de chaque agent convoqué."
                }
              />

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sendNow}
                  onChange={(e) => setSendNow(e.target.checked)}
                  className="rounded border-border"
                />
                Envoyer immédiatement après création
              </label>
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t bg-muted/30 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]/90"
            >
              {submitting && <Loader2Icon className="size-4 animate-spin" />}
              {sendNow ? "Créer et envoyer" : "Enregistrer le brouillon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
