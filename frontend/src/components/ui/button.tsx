import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-pressed disabled:bg-gray-200 disabled:text-gray-500",
  secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 disabled:text-gray-500",
  tertiary: "bg-transparent text-gray-700 hover:bg-black/5 disabled:text-gray-500",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", icon, className, children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-bold transition duration-[120ms] ease-standard active:scale-[0.98] disabled:cursor-not-allowed",
        size === "md" ? "h-12 px-5 text-base" : "h-9 px-3 text-sm",
        VARIANTS[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
