"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { toast } from "sonner";

import { UserFormFields } from "@/components/dashboard/user-form-fields";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  buildUpdatePayload,
  editUserDefaultValues,
  editUserFormSchema,
  userDetailToEditFormValues,
  type EditUserFormValues,
} from "@/lib/forms/user-form";
import type { UserDetail } from "@/lib/types/user-detail";
import { cn } from "@/lib/utils";

type EditUserSheetProps = {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function EditUserSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function EditUserSheet({
  userId,
  open,
  onOpenChange,
}: EditUserSheetProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: editUserDefaultValues,
  });

  const handleChangePassword = (value: boolean) => {
    setChangePassword(value);
    setValue("changePassword", value, { shouldValidate: true });
    if (!value) {
      setValue("password", "");
      setValue("confirmPassword", "");
    }
  };

  useEffect(() => {
    if (!open || !userId) {
      reset(editUserDefaultValues);
      setShowExtraFields(false);
      setChangePassword(false);
      return;
    }

    let cancelled = false;

    async function fetchUser() {
      setLoading(true);

      try {
        const response = await fetch(`/api/users/${userId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Impossible de charger l'utilisateur");
        }

        if (!cancelled) {
          const user = result.user as UserDetail;
          reset(userDetailToEditFormValues(user));

          const hasExtraData = Boolean(
            user.username ||
              user.matricule ||
              user.phoneSecondary ||
              user.gender ||
              user.maritalStatus ||
              user.dateOfBirth ||
              user.nationality ||
              user.nationalId ||
              user.numberOfChildren ||
              user.address ||
              user.city ||
              user.direction ||
              user.grade ||
              user.contractType ||
              user.contractYear ||
              user.hireDate ||
              user.endDate ||
              user.notes,
          );

          setShowExtraFields(hasExtraData);
          setChangePassword(false);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Erreur lors du chargement de l'utilisateur",
          );
          onOpenChange(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [open, userId, reset, onOpenChange]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      reset(editUserDefaultValues);
      setShowExtraFields(false);
      setChangePassword(false);
    }
  };

  const onSubmit = async (values: EditUserFormValues) => {
    if (!userId) return;

    try {
      const { payload, unset } = buildUpdatePayload(values);

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, unset }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "Impossible de mettre à jour l'utilisateur");
        return;
      }

      toast.success("Utilisateur mis à jour", {
        description: `${values.firstname} ${values.lastname}`,
      });

      handleOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  const fullName = watch("firstname")
    ? `${watch("firstname")} ${watch("lastname")}`.trim()
    : "";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <PencilIcon className="size-4 text-amber-600" />
            Modifier l&apos;utilisateur
          </SheetTitle>
          <SheetDescription>
            {loading
              ? "Chargement du profil…"
              : fullName
                ? `Mettez à jour les informations de ${fullName}.`
                : "Mettez à jour les informations de l'utilisateur."}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <EditUserSkeleton />
        ) : (
          <form
            id="edit-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-4 px-4 pb-4"
          >
            <UserFormFields
              key={userId ?? "new"}
              mode="edit"
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              showExtraFields={showExtraFields}
              setShowExtraFields={setShowExtraFields}
              changePassword={changePassword}
              setChangePassword={handleChangePassword}
            />
          </form>
        )}

        <SheetFooter className="flex-row gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={loading || isSubmitting}
            onClick={() => handleOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            disabled={loading || isSubmitting}
            className={cn(
              "flex-1 bg-[var(--inp-vert)] text-white hover:bg-[var(--inp-vert)]/90",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
