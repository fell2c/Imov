import type { ButtonProps, ButtonVariant } from "../types/Index.ts";

export function Button({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  icon: Icon,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-sky-500 text-white hover:bg-sky-600",
    secondary:
      "bg-white text-sky-600 border border-sky-500 hover:bg-sky-50",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}