"use client";

import { useState } from "react";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
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
import type { DashboardUser } from "@/lib/types/dashboard-user";
import { USER_ROLE_LABELS } from "@/lib/permissions/roles";

type DeleteUserDialogProps = {
  user: DashboardUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onDeleted,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const fullName = user ? `${user.firstname} ${user.lastname}` : "";

  const handleConfirm = async () => {
    if (!user) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible de supprimer l'utilisateur");
        return;
      }

      toast.success("Utilisateur supprimé", { description: fullName });
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangleIcon className="size-5" />
          </div>
          <DialogTitle>Supprimer cet utilisateur ?</DialogTitle>
          <DialogDescription>
            Cette action est définitive. Le compte de{" "}
            <strong>{fullName}</strong> sera supprimé de la plateforme.
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="rounded-lg border bg-muted/30 px-3 py-2.5 text-sm">
            <p className="font-medium text-foreground">{fullName}</p>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-muted-foreground">
              {USER_ROLE_LABELS[user.role]} · {user.section}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Suppression…
              </>
            ) : (
              "Supprimer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
