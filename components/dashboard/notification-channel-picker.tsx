"use client";

import { MailIcon, MessageSquareIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  NOTIFIER_CHANNEL_LABELS,
  NOTIFIER_CHANNELS,
  type NotifierChannel,
} from "@/lib/constants/notifications";
import { cn } from "@/lib/utils";

type NotificationChannelPickerProps = {
  id?: string;
  value: NotifierChannel;
  onChange: (value: NotifierChannel) => void;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

const CHANNEL_ICONS = {
  sms: MessageSquareIcon,
  email: MailIcon,
} as const;

export function NotificationChannelPicker({
  id,
  value,
  onChange,
  label = "Canal de notification",
  description,
  className,
  disabled = false,
}: NotificationChannelPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <Label id={id ? `${id}-label` : undefined}>{label}</Label>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={id ? `${id}-label` : undefined}
        className="grid grid-cols-2 gap-2"
      >
        {NOTIFIER_CHANNELS.map((channel) => {
          const Icon = CHANNEL_ICONS[channel];
          const selected = value === channel;

          return (
            <button
              key={channel}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(channel)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                selected
                  ? "border-[var(--inp-vert)] bg-[var(--inp-vert)]/10 text-[var(--inp-vert)]"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {NOTIFIER_CHANNEL_LABELS[channel]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
