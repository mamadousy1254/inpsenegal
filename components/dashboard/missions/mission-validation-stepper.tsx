"use client";

import {
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";

import {
  MISSION_VALIDATION_STEP_LABELS,
  MISSION_VALIDATION_STEP_LEGACY_LABELS,
  MISSION_VALIDATION_STEP_STATUS_LABELS,
  type MissionValidationStep,
} from "@/lib/constants/mission";
import type { SerializedMissionValidation } from "@/lib/services/mission/serialize-mission";
import { cn } from "@/lib/utils";

type MissionValidationStepperProps = {
  validations: SerializedMissionValidation[];
  pendingStep?: MissionValidationStep;
  className?: string;
};

function StepIcon({ status }: { status: SerializedMissionValidation["status"] }) {
  if (status === "valide") {
    return <CheckCircle2Icon className="size-5 text-emerald-600" />;
  }
  if (status === "rejete") {
    return <XCircleIcon className="size-5 text-rose-600" />;
  }
  return <ClockIcon className="size-5 text-amber-500" />;
}

export function MissionValidationStepper({
  validations,
  pendingStep,
  className,
}: MissionValidationStepperProps) {
  return (
    <ol className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {validations.map((step, index) => {
        const isPending = step.step === pendingStep && step.status === "en_attente";
        return (
          <li
            key={step.step}
            className={cn(
              "relative flex gap-3 rounded-xl border p-4 transition-colors",
              isPending
                ? "border-[var(--inp-vert)]/40 bg-[var(--inp-vert)]/5 ring-1 ring-[var(--inp-vert)]/20"
                : "border-border/60 bg-muted/10",
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <StepIcon status={step.status} />
              <span className="text-[10px] font-medium text-muted-foreground">
                {index + 1}/{validations.length}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {MISSION_VALIDATION_STEP_LABELS[step.step as MissionValidationStep] ??
                  MISSION_VALIDATION_STEP_LEGACY_LABELS[step.step] ??
                  step.step}
              </p>
              <p className="text-sm text-muted-foreground">
                {MISSION_VALIDATION_STEP_STATUS_LABELS[step.status]}
              </p>
              {step.validatorFullname && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.validatorFullname}
                  {step.validatedAt
                    ? ` · ${new Date(step.validatedAt).toLocaleString("fr-FR")}`
                    : ""}
                </p>
              )}
              {step.comment && (
                <p className="mt-2 rounded-lg bg-background px-2.5 py-2 text-xs">
                  {step.comment}
                </p>
              )}
              {isPending && (
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--inp-vert)]">
                  <CircleIcon className="size-3 fill-current" />
                  Action requise
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
