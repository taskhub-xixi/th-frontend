import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { DarkModeWarningDialog } from "@/components/DarkModeWarningDialog";

export default function AppearanceSettings({ appearance, setAppearance }) {
  const { theme, setTheme } = useTheme();
  const [showWarning, setShowWarning] = useState(false);

  const handleDarkModeClick = () => {
    setShowWarning(true);
  };

  const handleDarkModeConfirm = () => {
    setTheme("dark");
    setAppearance({ ...appearance, theme: "dark" });
    setShowWarning(false);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => {
                  setTheme("light");
                  setAppearance({ ...appearance, theme: "light" });
                }}
              >
                Light
              </Button>
              <Button
                size="sm"
                variant={theme === "dark" ? "default" : "outline"}
                onClick={handleDarkModeClick}
              >
                Dark
              </Button>
              <Button
                size="sm"
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => {
                  setTheme("system");
                  setAppearance({ ...appearance, theme: "system" });
                }}
              >
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DarkModeWarningDialog
        open={showWarning}
        onOpenChange={setShowWarning}
        onConfirm={handleDarkModeConfirm}
      />
    </>
  );
}