"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  AlertCircleIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  InfoIcon,
  Loader2Icon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { NotificationChannelPicker } from "@/components/dashboard/notification-channel-picker";
import { AbsenceJustificatifUpload } from "@/components/dashboard/absence-justificatif-upload";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ABSENCE_REASON_OPTIONS,
  getAbsenceReasonLabel,
  getAbsenceTypeFromReason,
} from "@/lib/constants/leave";
import type { NotifierChannel } from "@/lib/constants/notifications";
import type { UserRole } from "@/lib/permissions/roles";
import type { AbsenceJustificatifEntry } from "@/lib/types/absence";
import { computeBusinessDaysFromStrings } from "@/lib/services/leave/compute-duration";
import { formatDateFrench } from "@/lib/utils/date-input";
import { cn } from "@/lib/utils";

type CreateAbsenceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

type FormErrors = {
  dateDepart?: string;
  dateFin?: string;
  raison?: string;
};

type UserOption = {
  _id: string;
  email: string;
  phone?: string;
  firstname: string;
  lastname: string;
  occupation: string;
};

const ADMIN_ABSENCE_ROLES: UserRole[] = ["super_admin", "admin", "directeur", "rh"];

const SELECT_IN_DIALOG_PROPS = {
  side: "bottom" as const,
  alignItemWithTrigger: false,
  className: "z-[200] max-h-64",
};

const emptyForm = {
  dateDepart: "",
  dateFin: "",
  raison: "",
};

export function CreateAbsenceDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAbsenceDialogProps) {
  const { data: session, status } = useSession();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [bypassing, setBypassing] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeePickerOpen, setEmployeePickerOpen] = useState(false);
  const [notifyChannel, setNotifyChannel] = useState<NotifierChannel>("sms");
  const [justificatif, setJustificatif] =
    useState<AbsenceJustificatifEntry | null>(null);
  const [justificatifUploading, setJustificatifUploading] = useState(false);

  const role = session?.user?.role as UserRole | undefined;
  const canUseAdminTools =
    status === "authenticated" &&
    Boolean(role && ADMIN_ABSENCE_ROLES.includes(role));

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(emptyForm);
    setSelectedUserId("");
    setEmployeeSearch("");
    setEmployeePickerOpen(false);
    setNotifyChannel("sms");
    setJustificatif(null);
    setJustificatifUploading(false);

    fetch("/api/users/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.phone) setPhone(data.user.phone);
      })
      .catch(() => undefined);
  }, [open]);

  useEffect(() => {
    if (!open || !canUseAdminTools) return;

    fetch("/api/users")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const list = Array.isArray(data?.users) ? (data.users as UserOption[]) : [];
        setUsers(list);
      })
      .catch(() => setUsers([]));
  }, [open, canUseAdminTools]);

  const otherEmployees = useMemo(() => {
    const selfId = session?.user?.id;
    return users.filter((u) => u._id !== selfId);
  }, [users, session?.user?.id]);

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return otherEmployees;

    return otherEmployees.filter((u) => {
      const haystack = `${u.firstname} ${u.lastname} ${u.email} ${u.occupation}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [otherEmployees, employeeSearch]);

  const selectedUser = useMemo(
    () => users.find((u) => u._id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const effectiveUser = selectedUser ?? {
    firstname: session?.user?.firstname ?? "",
    lastname: session?.user?.lastname ?? "",
    email: session?.user?.email ?? "",
    occupation: session?.user?.occupation ?? "Employé",
    phone: phone || undefined,
  };

  const duration = useMemo(
    () => computeBusinessDaysFromStrings(form.dateDepart, form.dateFin),
    [form.dateDepart, form.dateFin],
  );

  const isFormComplete =
    Boolean(form.dateDepart) && Boolean(form.dateFin) && Boolean(form.raison);
  const isBusy = submitting || bypassing || justificatifUploading;

  const requesterSummary = selectedUser
    ? `${selectedUser.firstname} ${selectedUser.lastname}`
    : `Moi — ${session?.user?.firstname ?? ""} ${session?.user?.lastname ?? ""}`.trim();

  function handleSelectEmployee(userId: string) {
    setSelectedUserId(userId);
    setEmployeePickerOpen(false);
    setEmployeeSearch("");
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (
        field === "dateDepart" &&
        value &&
        prev.dateFin &&
        prev.dateFin < value
      ) {
        next.dateFin = value;
      }

      return next;
    });

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (!form.dateDepart) {
      next.dateDepart = "La date de départ est requise";
    }
    if (!form.dateFin) {
      next.dateFin = "La date de fin est requise";
    }
    if (form.dateDepart && form.dateFin && form.dateFin < form.dateDepart) {
      next.dateFin =
        "La date de fin doit être identique ou postérieure à la date de départ";
    }
    if (!form.raison.trim()) {
      next.raison = "Veuillez sélectionner un motif";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submitAbsence({ adminBypass }: { adminBypass: boolean }) {
    if (!validate()) return;

    if (duration <= 0) {
      toast.error("La durée doit être d'au moins 1 jour ouvré");
      return;
    }

    if (adminBypass) setBypassing(true);
    else setSubmitting(true);

    try {
      const absenceType = getAbsenceTypeFromReason(form.raison);
      const res = await fetch("/api/absences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          absenceType,
          dateDepart: form.dateDepart,
          dateFin: form.dateFin,
          raison: getAbsenceReasonLabel(form.raison),
          targetUserId: selectedUserId || undefined,
          adminBypass,
          notifyChannel:
            adminBypass || !canUseAdminTools ? undefined : notifyChannel,
          ...(justificatif ? { justificatif } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");

      toast.success(
        adminBypass
          ? "Demande enregistrée et approuvée directement"
          : "Demande enregistrée avec succès",
      );

      if (adminBypass && Number(data.debtDays) > 0) {
        toast.warning(
          `Dette de congés : ${data.debtDays} jour${data.debtDays > 1 ? "s" : ""}.`,
          { duration: 6000 },
        );
      }

      if (!adminBypass && Array.isArray(data.notifications)) {
        const deliveredByUser = new Map<string, boolean>();
        for (const item of data.notifications as Array<{
          validatorUserId?: string;
          success?: boolean;
        }>) {
          if (!item.validatorUserId) continue;
          const previous = deliveredByUser.get(item.validatorUserId) ?? false;
          deliveredByUser.set(
            item.validatorUserId,
            previous || Boolean(item.success),
          );
        }
        const hasUndelivered = [...deliveredByUser.values()].some(
          (delivered) => !delivered,
        );
        if (hasUndelivered) {
          toast.warning(
            "Demande enregistrée, mais certains validateurs n'ont pas pu être notifiés (e-mail ni SMS).",
            { duration: 6000 },
          );
        }
      }

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSubmitting(false);
      setBypassing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitAbsence({ adminBypass: false });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[600px]">
        <div className="border-b bg-gradient-to-br from-[var(--inp-vert)]/8 via-background to-background px-6 py-5">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">
              Demande d&apos;absence
            </DialogTitle>
            <DialogDescription>
              Remplissez ce formulaire pour soumettre votre demande. Elle sera
              transmise à vos validateurs dans l&apos;ordre défini.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            {canUseAdminTools && (
              <section className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-3">
                <button
                  type="button"
                  onClick={() => setEmployeePickerOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-1 py-1 text-left transition-colors hover:bg-amber-100/50"
                  aria-expanded={employeePickerOpen}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <ShieldCheckIcon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-amber-900">
                        Faire la demande pour
                      </span>
                      <span className="block truncate text-xs text-amber-800/80">
                        {requesterSummary}
                      </span>
                    </span>
                  </span>
                  <ChevronDownIcon
                    className={cn(
                      "size-4 shrink-0 text-amber-800/70 transition-transform duration-200",
                      employeePickerOpen && "rotate-180",
                    )}
                  />
                </button>

                {employeePickerOpen && (
                  <div className="mt-3 space-y-2 border-t border-amber-200/60 pt-3">
                    <EmployeePicker
                      selfLabel={`Moi — ${session?.user?.firstname ?? ""} ${session?.user?.lastname ?? ""}`}
                      selfEmail={session?.user?.email ?? ""}
                      selectedUserId={selectedUserId}
                      onSelect={handleSelectEmployee}
                      search={employeeSearch}
                      onSearchChange={setEmployeeSearch}
                      employees={filteredEmployees}
                      allEmployees={otherEmployees}
                    />
                    <p className="text-xs text-amber-800/80">
                      Choisissez un employé ou « Moi » pour votre propre demande.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Employé */}
            <section className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <UserIcon className="size-4 text-[var(--inp-vert)]" />
                Informations de l&apos;employé
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Prénom</Label>
                  <Input
                    value={effectiveUser.firstname}
                    disabled
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Nom</Label>
                  <Input
                    value={effectiveUser.lastname}
                    disabled
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BriefcaseIcon className="size-3" />
                    Fonction
                  </Label>
                  <Input
                    value={effectiveUser.occupation || "Employé"}
                    disabled
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                    <PhoneIcon className="size-3" />
                    Téléphone
                  </Label>
                  <Input
                    value={effectiveUser.phone || "Non renseigné"}
                    disabled
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MailIcon className="size-3" />
                    E-mail
                  </Label>
                  <Input
                    value={effectiveUser.email}
                    disabled
                    className="bg-background"
                  />
                </div>
              </div>
            </section>

            {/* Période */}
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CalendarIcon className="size-4 text-[var(--inp-vert)]" />
                Période d&apos;absence
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="dateDepart">Date de départ</Label>
                  <Input
                    id="dateDepart"
                    type="date"
                    value={form.dateDepart}
                    onChange={(e) => updateField("dateDepart", e.target.value)}
                    className={cn(errors.dateDepart && "border-destructive")}
                  />
                  {errors.dateDepart && (
                    <ErrorHint message={errors.dateDepart} />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={form.dateFin}
                    min={form.dateDepart || undefined}
                    onChange={(e) => updateField("dateFin", e.target.value)}
                    className={cn(errors.dateFin && "border-destructive")}
                  />
                  {errors.dateFin && <ErrorHint message={errors.dateFin} />}
                </div>
              </div>

              <p className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                <InfoIcon className="mt-0.5 size-3.5 shrink-0 text-[var(--inp-vert)]" />
                <span>
                  La <strong className="font-medium text-foreground">date de départ</strong> et la{" "}
                  <strong className="font-medium text-foreground">date de fin</strong> sont toutes
                  les deux <strong className="font-medium text-foreground">incluses</strong> dans
                  le décompte. Seuls les jours ouvrés (lundi à vendredi) sont comptés — les
                  week-ends sont exclus.
                </span>
              </p>

              {duration > 0 && (
                <div className="rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-background px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ClockIcon className="size-3.5 text-sky-600" />
                    Durée calculée (jours ouvrés)
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-sky-700">
                    {duration}{" "}
                    <span className="text-sm font-medium">
                      jour{duration > 1 ? "s" : ""}
                    </span>
                  </p>
                  {form.dateDepart && form.dateFin && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Du {formatDateFrench(form.dateDepart)} au{" "}
                      {formatDateFrench(form.dateFin)}, inclus.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* Motif */}
            <section className="space-y-1.5">
              <Label htmlFor="raison">Motif de l&apos;absence</Label>
              <Select
                value={form.raison}
                onValueChange={(v) => updateField("raison", v ?? "")}
              >
                <SelectTrigger
                  id="raison"
                  className={cn(
                    "h-10 w-full",
                    errors.raison && "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Sélectionnez le motif de votre absence…" />
                </SelectTrigger>
                <SelectContent {...SELECT_IN_DIALOG_PROPS}>
                  <SelectGroup>
                    {ABSENCE_REASON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.raison && <ErrorHint message={errors.raison} />}
            </section>

            {/* Justificatif */}
            <section className="space-y-2">
              <Label>Justificatif (optionnel)</Label>
              <AbsenceJustificatifUpload
                value={justificatif}
                onChange={setJustificatif}
                onUploadingChange={setJustificatifUploading}
                disabled={isBusy}
              />
            </section>

            {canUseAdminTools && (
              <section className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <NotificationChannelPicker
                  value={notifyChannel}
                  onChange={setNotifyChannel}
                  label="Notifier le validateur"
                  description="E-mail et SMS sont envoyés automatiquement au validateur ou à son délégué actif."
                />
              </section>
            )}
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              Annuler
            </Button>
            {canUseAdminTools && (
              <Button
                type="button"
                disabled={isBusy || !isFormComplete}
                onClick={() => submitAbsence({ adminBypass: true })}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800"
              >
                {bypassing ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Approbation…
                  </>
                ) : (
                  "Approbation directe"
                )}
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 bg-[var(--inp-vert)] hover:bg-[var(--inp-vert)]/90"
              disabled={isBusy || !isFormComplete}
            >
              {submitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                "Soumettre la demande"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EmployeePicker({
  selfLabel,
  selfEmail,
  selectedUserId,
  onSelect,
  search,
  onSearchChange,
  employees,
  allEmployees,
}: {
  selfLabel: string;
  selfEmail: string;
  selectedUserId: string;
  onSelect: (userId: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  employees: UserOption[];
  allEmployees: UserOption[];
}) {
  return (
    <div className="space-y-2 rounded-lg border border-amber-200/60 bg-background p-3">
      <button
        type="button"
        onClick={() => onSelect("")}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
          !selectedUserId
            ? "border-[var(--inp-vert)]/40 bg-[var(--inp-vert)]/5 ring-1 ring-[var(--inp-vert)]/20"
            : "border-border/60 hover:bg-muted/50",
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            !selectedUserId
              ? "bg-[var(--inp-vert)]/15 text-[var(--inp-vert)]"
              : "bg-muted text-muted-foreground",
          )}
        >
          {!selectedUserId ? (
            <CheckIcon className="size-4" />
          ) : (
            <UserIcon className="size-4" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-foreground">{selfLabel}</span>
          <span className="block truncate text-xs text-muted-foreground">
            {selfEmail}
          </span>
        </span>
      </button>

      {allEmployees.length > 0 && (
        <>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un employé…"
              className="h-9 bg-background pl-8"
            />
          </div>

          <ScrollArea className="h-64 rounded-lg border border-border/60 bg-muted/20">
            <div
              role="listbox"
              aria-label="Liste des employés"
              className="space-y-1 p-1"
            >
              {employees.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                  Aucun employé trouvé
                </p>
              ) : (
                employees.map((employee) => {
                  const isSelected = selectedUserId === employee._id;
                  return (
                    <button
                      key={employee._id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => onSelect(employee._id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-[var(--inp-vert)]/10 text-foreground ring-1 ring-[var(--inp-vert)]/25"
                          : "hover:bg-background",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          isSelected
                            ? "bg-[var(--inp-vert)]/15 text-[var(--inp-vert)]"
                            : "bg-background text-muted-foreground ring-1 ring-border/60",
                        )}
                      >
                        {isSelected ? (
                          <CheckIcon className="size-3.5" />
                        ) : (
                          `${employee.firstname.charAt(0)}${employee.lastname.charAt(0)}`.toUpperCase()
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {employee.firstname} {employee.lastname}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {employee.email}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {allEmployees.length > 6 && (
            <p className="text-center text-[11px] text-muted-foreground">
              {employees.length} employé{employees.length > 1 ? "s" : ""} affiché
              {search.trim() ? "" : ` sur ${allEmployees.length}`} — faites
              défiler la liste
            </p>
          )}
        </>
      )}
    </div>
  );
}

function ErrorHint({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircleIcon className="size-3 shrink-0" />
      {message}
    </p>
  );
}
