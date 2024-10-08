import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import useSettingStore from "../../store/settingStore";
import { Moon, Sun } from "lucide-react";

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
    <div className="flex items-center space-x-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="bg-gray-200 dark:bg-gray-800"
      />
      {isDarkMode ? (
        <Moon className="w-6 h-6 text-gray-50" />
      ) : (
        <Sun className="w-6 h-6 text-black" />
      )}
    </div>
  );
};

export default ThemeSwitcher;
