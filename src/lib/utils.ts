import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function initials(name = "User") { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
export function formatDate(value?: string) { return value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "—"; }
