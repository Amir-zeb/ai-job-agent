"use client";

type BadgeVariant = "default" | "success" | "warning" | "danger";

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-(--secondary) text-(--primary)",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-rose-100 text-rose-800",
};

export function Badge({ label, variant = "default" }: BadgeProps) {
    return (
        <span
            className={
                `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ` +
                variantClasses[variant]
            }
        >
            {label}
        </span>
    );
}
