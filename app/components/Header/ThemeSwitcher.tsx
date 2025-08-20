"use client";

import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useSettingStore } from "@/store/settingStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ThemeSwitcher = () => {
  const { themeMode, setThemeMode, saveUserSettings } = useSettingStore();

  const toggleTheme = async () => {
    const newThemeMode = themeMode === "dark" ? "light" : "dark";
    setThemeMode(newThemeMode);
    await saveUserSettings();
  };

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={toggleTheme}
          >
            <Button variant="link" size="header">
              {themeMode === "dark" ? (
                <Moon className="size-6 text-gray-50" />
              ) : (
                <Sun className="size-6 text-black" />
              )}
            </Button>
            <Switch
              checked={themeMode === "dark"}
              className="bg-gray-200 dark:bg-gray-800"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {themeMode === "dark" ? "切換為明亮模式" : "切換為暗黑模式"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeSwitcher;
