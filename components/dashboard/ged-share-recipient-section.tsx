"use client";

import { useMemo } from "react";
import {
  AlertCircleIcon,
  CheckIcon,
  Loader2Icon,
  MailIcon,
  MessageSquareIcon,
  SearchIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type GedShareRecipientMode = "user" | "manual";

export type GedShareRecipientUser = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  occupation: string;
};

type GedShareRecipientSectionProps = {
  mode: GedShareRecipientMode;
  onModeChange: (mode: GedShareRecipientMode) => void;
  users: GedShareRecipientUser[];
  usersLoading: boolean;
  userSearch: string;
  onUserSearchChange: (value: string) => void;
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  recipientName: string;
  onRecipientNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  channel: "email" | "sms";
  disabled?: boolean;
};

export function GedShareRecipientSection({
  mode,
  onModeChange,
  users,
  usersLoading,
  userSearch,
  onUserSearchChange,
  selectedUserId,
  onSelectUser,
  recipientName,
  onRecipientNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  channel,
  disabled = false,
}: GedShareRecipientSectionProps) {
  const selectedUser = useMemo(
    () => users.find((user) => user._id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <UsersIcon className="size-3.5" />
          Type de destinataire
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onModeChange("user")}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center text-sm font-medium transition-all",
              mode === "user"
                ? "border-sky-300 bg-sky-50 text-sky-800 shadow-sm ring-1 ring-sky-200/80 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100 dark:ring-sky-900/50"
                : "border-border/70 bg-background text-muted-foreground hover:border-sky-200/60 hover:bg-sky-50/30 dark:hover:bg-sky-950/20",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                mode === "user"
                  ? "bg-sky-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <UserIcon className="size-4" />
            </span>
            <span>Collaborateur INP</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onModeChange("manual")}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center text-sm font-medium transition-all",
              mode === "manual"
                ? "border-amber-300 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-200/80 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900/50"
                : "border-border/70 bg-background text-muted-foreground hover:border-amber-200/60 hover:bg-amber-50/30 dark:hover:bg-amber-950/20",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                mode === "manual"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <UserPlusIcon className="size-4" />
            </span>
            <span>Saisie manuelle</span>
          </button>
        </div>
      </div>

      {mode === "user" ? (
        <div className="space-y-3 rounded-xl border border-sky-200/50 bg-sky-50/20 p-3 dark:border-sky-900/40 dark:bg-sky-950/10">
          <div className="relative">
            <SearchIcon className="absolute top-2.5 left-2.5 size-4 text-sky-600/70 dark:text-sky-400/70" />
            <Input
              value={userSearch}
              onChange={(event) => onUserSearchChange(event.target.value)}
              placeholder="Rechercher un collaborateur…"
              className="border-sky-200/60 bg-background pl-8 focus-visible:border-sky-400 focus-visible:ring-sky-400/20 dark:border-sky-900/50"
              disabled={disabled}
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-sky-200/40 bg-background dark:border-sky-900/40">
            <ScrollArea className="h-36">
              <div className="p-1">
                {usersLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-sky-700 dark:text-sky-300">
                    <Loader2Icon className="size-5 animate-spin" />
                    <p className="text-xs">Chargement…</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 py-8 text-muted-foreground">
                    <UsersIcon className="size-5 opacity-40" />
                    <p className="text-xs">Aucun collaborateur trouvé</p>
                  </div>
                ) : (
                  users.map((user) => {
                    const isSelected = selectedUserId === user._id;
                    return (
                      <button
                        key={user._id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelectUser(user._id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-all",
                          isSelected
                            ? "bg-sky-100 text-sky-950 ring-1 ring-sky-300/70 dark:bg-sky-950/50 dark:text-sky-50 dark:ring-sky-800"
                            : "hover:bg-sky-50/80 dark:hover:bg-sky-950/30",
                          disabled && "pointer-events-none opacity-50",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                            isSelected
                              ? "bg-sky-500 text-white shadow-sm"
                              : "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
                          )}
                        >
                          {isSelected ? (
                            <CheckIcon className="size-3.5" />
                          ) : (
                            `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {user.firstname} {user.lastname}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {user.email}
                            {user.occupation ? ` · ${user.occupation}` : ""}
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {selectedUser ? (
            <div
              className={cn(
                "rounded-lg border px-3 py-2.5 text-sm",
                channel === "sms" && !selectedUser.phone
                  ? "border-amber-300/70 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                  : "border-emerald-300/70 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30",
              )}
            >
              <p className="flex items-center gap-2 font-medium text-foreground">
                {channel === "sms" && !selectedUser.phone ? (
                  <AlertCircleIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckIcon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                )}
                {selectedUser.firstname} {selectedUser.lastname}
              </p>
              {channel === "email" ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-sky-800/80 dark:text-sky-200/80">
                  <MailIcon className="size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                  {selectedUser.email}
                </p>
              ) : selectedUser.phone ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-800/80 dark:text-emerald-200/80">
                  <MessageSquareIcon className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {selectedUser.phone}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-amber-800 dark:text-amber-200">
                  Aucun numéro SMS valide. Choisissez l&apos;e-mail ou la saisie
                  manuelle.
                </p>
              )}
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-xs text-sky-800/70 dark:text-sky-300/70">
              <UserIcon className="size-3.5" />
              Sélectionnez un collaborateur dans la liste.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-amber-200/50 bg-amber-50/20 p-3 dark:border-amber-900/40 dark:bg-amber-950/10">
          <div className="space-y-1.5">
            <Label
              htmlFor="ged-share-name"
              className="flex items-center gap-1.5 text-amber-900/80 dark:text-amber-200/80"
            >
              <UserIcon className="size-3.5" />
              Nom du destinataire
            </Label>
            <Input
              id="ged-share-name"
              value={recipientName}
              onChange={(event) => onRecipientNameChange(event.target.value)}
              placeholder="Prénom Nom"
              className="border-amber-200/60 bg-background focus-visible:border-amber-400 focus-visible:ring-amber-400/20 dark:border-amber-900/50"
              disabled={disabled}
            />
          </div>

          {channel === "email" ? (
            <div className="space-y-1.5">
              <Label
                htmlFor="ged-share-email"
                className="flex items-center gap-1.5 text-amber-900/80 dark:text-amber-200/80"
              >
                <MailIcon className="size-3.5" />
                E-mail
              </Label>
              <Input
                id="ged-share-email"
                type="email"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                placeholder="destinataire@exemple.com"
                className="border-amber-200/60 bg-background focus-visible:border-amber-400 focus-visible:ring-amber-400/20 dark:border-amber-900/50"
                disabled={disabled}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label
                htmlFor="ged-share-phone"
                className="flex items-center gap-1.5 text-amber-900/80 dark:text-amber-200/80"
              >
                <MessageSquareIcon className="size-3.5" />
                Téléphone
              </Label>
              <Input
                id="ged-share-phone"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value)}
                placeholder="+221771234567"
                className="border-amber-200/60 bg-background focus-visible:border-amber-400 focus-visible:ring-amber-400/20 dark:border-amber-900/50"
                disabled={disabled}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
