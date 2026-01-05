"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DarkModeWarningDialog } from "@/components/DarkModeWarningDialog";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [showWarning, setShowWarning] = useState(false);

  const toggleTheme = () => {
    if (theme === "light") {
      // Show warning before switching to dark mode
      setShowWarning(true);
    } else {
      setTheme("light");
    }
  };

  const handleDarkModeConfirm = () => {
    setTheme("dark");
    setShowWarning(false);
  };

  return (
    <>
      <Button aria-label="Toggle theme" onClick={toggleTheme} size="icon" variant="ghost">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <DarkModeWarningDialog
        open={showWarning}
        onOpenChange={setShowWarning}
        onConfirm={handleDarkModeConfirm}
      />
    </>
  );
}
