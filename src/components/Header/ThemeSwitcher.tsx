import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import useSettingStore from "../../store/settingStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
  const { setThemeMode, saveUserSettings } = useSettingStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = async () => {
    const newThemeMode = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    setThemeMode(newThemeMode);
    await saveUserSettings();
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const currentTheme = useSettingStore.getState().themeMode;
    setIsDarkMode(currentTheme === "dark");
  }, []);

  return (
    <div className="flex items-center gap-2 ">
      <Button variant="link" size="header" onClick={toggleTheme}>
        {isDarkMode ? (
          <Moon className="w-6 h-6 text-gray-50" />
        ) : (
          <Sun className="w-6 h-6 text-black" />
        )}
      </Button>
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="bg-gray-200 dark:bg-gray-800"
      />
    </div>
  );
};

export default ThemeSwitcher;
