import { CSSProperties, ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "#fff",
    border: "1px solid transparent",
  },
  secondary: {
    background: "var(--bg-elevated)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-strong)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--error-subtle)",
    color: "var(--error)",
    border: "1px solid rgba(239,68,68,0.25)",
  },
};

const SIZE_STYLES: Record<Size, CSSProperties> = {
  sm: { padding: "6px 14px", fontSize: 12, borderRadius: "var(--radius-sm)" },
  md: { padding: "9px 18px", fontSize: 13, borderRadius: "var(--radius-sm)" },
  lg: { padding: "12px 24px", fontSize: 14, borderRadius: "var(--radius-md)" },
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontWeight: 500,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.55 : 1,
        transition: "all 0.15s",
        outline: "none",
        fontFamily: "inherit",
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
    >
      {loading ? (
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
            display: "inline-block",
          }}
        />
      ) : icon ? (
        <span style={{ display: "inline-flex", alignItems: "center", fontSize: "1em" }}>
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
