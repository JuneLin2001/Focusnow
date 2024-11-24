import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import useSettingStore from "../../store/settingStore";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center gap-2">
      <Button variant="link" size="header" onClick={toggleTheme}>
        {themeMode === "dark" ? (
          <Moon className="size-6 text-gray-50" />
        ) : (
          <Sun className="size-6 text-black" />
        )}
      </Button>
      <Switch
        checked={themeMode === "dark"}
        onCheckedChange={toggleTheme}
        className="bg-gray-200 dark:bg-gray-800"
      />
    </div>
  );
};

export default ThemeSwitcher;
