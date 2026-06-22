"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClockIcon,
  Loader2Icon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  CONTACT_MESSAGE_STATUSES,
  CONTACT_MESSAGE_STATUS_LABELS,
  type ContactMessageStatus,
} from "@/lib/constants/contact-message";
import type { SerializedContactMessage } from "@/lib/services/contact/serialize-contact-message";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ContactMessageStatus, string> = {
  nouvelle: "bg-sky-500/10 text-sky-700",
  en_cours: "bg-amber-500/10 text-amber-800",
  traitee: "bg-emerald-500/10 text-emerald-700",
  archivee: "bg-slate-500/10 text-slate-600",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RendezVousPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState<SerializedContactMessage[]>([]);
  const [selected, setSelected] = useState<SerializedContactMessage | null>(null);
  const [editStatus, setEditStatus] = useState<ContactMessageStatus>("nouvelle");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact-messages");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      toast.error("Impossible de charger les messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return result;
    return result.filter((item) =>
      [item.reference, item.fullName, item.email, item.subject, item.message, item.institution]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, search, statusFilter]);

  const openDetail = (item: SerializedContactMessage) => {
    setSelected(item);
    setEditStatus(item.status);
    setAdminNotes(item.adminNotes ?? "");
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/contact-messages/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus, adminNotes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      const data = await res.json();
      toast.success("Message mis à jour");
      setSelected(data);
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: SerializedContactMessage) => {
    if (
      !confirm(
        `Supprimer le message ${item.reference} de ${item.fullName} ?`,
      )
    ) {
      return;
    }

    setDeletingId(item._id);
    try {
      const res = await fetch(`/api/contact-messages/${item._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success("Message supprimé");
      if (selected?._id === item._id) {
        setSelected(null);
      }
      void fetchItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Suppression impossible");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <CalendarClockIcon className="size-7 text-[var(--inp-vert)]" />
            Messages & rendez-vous
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages reçus via le formulaire de{" "}
            <Link href="/contact" className="text-[var(--inp-vert)] underline">
              /contact
            </Link>
            .
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          Tous ({items.length})
        </Button>
        {CONTACT_MESSAGE_STATUSES.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {CONTACT_MESSAGE_STATUS_LABELS[s]} ({items.filter((i) => i.status === s).length})
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Aucun message pour le moment.
          </div>
        ) : (
          <div className="divide-y">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-2 p-4 transition-colors hover:bg-muted/30"
              >
                <button
                  type="button"
                  className="flex min-w-0 flex-1 flex-col gap-2 text-left sm:flex-row sm:items-center sm:justify-between"
                  onClick={() => openDetail(item)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--inp-vert)]/10">
                      <MessageSquareIcon className="size-5 text-[var(--inp-vert)]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold">{item.reference}</span>
                        <Badge className={cn("border-0", STATUS_STYLES[item.status])}>
                          {CONTACT_MESSAGE_STATUS_LABELS[item.status]}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{item.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.subject} · {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  disabled={deletingId === item._id}
                  aria-label={`Supprimer le message ${item.reference}`}
                  onClick={() => void handleDelete(item)}
                >
                  {deletingId === item._id ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <Trash2Icon className="size-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono">{selected.reference}</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <p className="text-lg font-semibold">{selected.fullName}</p>
                {selected.institution && (
                  <p className="text-muted-foreground">{selected.institution}</p>
                )}
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <a href={`mailto:${selected.email}`} className="underline">
                      {selected.email}
                    </a>
                  </span>
                  {selected.phone && (
                    <span className="flex items-center gap-2">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      {selected.phone}
                    </span>
                  )}
                </div>
                <Badge variant="outline">{selected.subject}</Badge>
                <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-4 leading-relaxed">
                  {selected.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  Reçu le {formatDate(selected.createdAt)}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(v) => setEditStatus(v as ContactMessageStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTACT_MESSAGE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {CONTACT_MESSAGE_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes internes</Label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => selected && void handleDelete(selected)}
                  disabled={saving || deletingId === selected._id}
                >
                  {deletingId === selected._id && (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  )}
                  Supprimer
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Fermer
                  </Button>
                  <Button
                    onClick={() => void handleSave()}
                    disabled={saving || deletingId === selected._id}
                  >
                    {saving && <Loader2Icon className="mr-2 size-4 animate-spin" />}
                    Enregistrer
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
