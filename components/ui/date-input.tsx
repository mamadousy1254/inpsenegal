"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  formatDateFrench,
  parseIsoDateString,
  toIsoDateString,
} from "@/lib/utils/date-input";

type DateInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
};

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      onBlur,
      min,
      max,
      disabled,
      id,
      name,
      required,
      placeholder = "Sélectionner une date",
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [uncontrolled, setUncontrolled] = React.useState(
      () => (defaultValue as string | undefined) ?? "",
    );

    const isControlled = value !== undefined;
    const stringValue = (isControlled ? value : uncontrolled) ?? "";
    const selected = parseIsoDateString(stringValue);
    const minDate = parseIsoDateString(typeof min === "string" ? min : undefined);
    const maxDate = parseIsoDateString(typeof max === "string" ? max : undefined);

    function emitChange(nextValue: string) {
      if (!isControlled) {
        setUncontrolled(nextValue);
      }

      onChange?.({
        target: { value: nextValue, name, id },
        currentTarget: { value: nextValue, name, id },
      } as React.ChangeEvent<HTMLInputElement>);
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <input
          ref={ref}
          type="hidden"
          name={name}
          id={id}
          value={stringValue}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        <PopoverTrigger
          type="button"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 py-1 text-left text-sm transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selected ? formatDateFrench(stringValue) : placeholder}
          </span>
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              if (!date) return;
              emitChange(toIsoDateString(date));
              setOpen(false);
            }}
            disabled={(date) => {
              const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
              if (minDate) {
                const min = new Date(
                  minDate.getFullYear(),
                  minDate.getMonth(),
                  minDate.getDate(),
                );
                if (day < min) return true;
              }
              if (maxDate) {
                const max = new Date(
                  maxDate.getFullYear(),
                  maxDate.getMonth(),
                  maxDate.getDate(),
                );
                if (day > max) return true;
              }
              return false;
            }}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DateInput.displayName = "DateInput";

export { DateInput };
