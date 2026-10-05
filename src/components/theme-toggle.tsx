"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "./ui";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  if (!mounted)
    return (
      <Button aria-label="Change theme" variant="ghost" className="size-10 p-0">
        <Monitor className="size-4" />
      </Button>
    );
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  return (
    <Button
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      variant="ghost"
      className="size-10 p-0"
      onClick={() => setTheme(next)}
    >
      <Icon className="size-4" />
    </Button>
  );
}
