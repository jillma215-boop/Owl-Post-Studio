import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "ghost"; size?: "default" | "sm" | "icon" };
const variants = { default: "bg-slate-950 text-white shadow-soft hover:bg-slate-800", secondary: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50", ghost: "hover:bg-slate-100" };
const sizes = { default: "h-11 px-5", sm: "h-9 px-4", icon: "h-10 w-10" };
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", size = "default", ...props }, ref) => <button ref={ref} className={cn("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />);
Button.displayName = "Button";
