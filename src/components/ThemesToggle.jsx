import { ArrowBigDown, Moon, Sun, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { useAppStore } from "../lib/zustand";
import { useEffect, useState } from "react";

export default function ThemesToggle() {
  const { themes } = useAppStore();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "default"
  );

  function handleTheme(type, mode) {
    const html = document.documentElement;
    let isDark = html.dataset.theme.startsWith("dark-");

    if (mode === "theme") {
      html.dataset.theme = isDark ? `dark-${type}` : type;
      setTheme(isDark ? `dark-${type}` : type);
    } else if (mode === "dark") {
      const newTheme = type.startsWith("dark-")
        ? type.replace("dark-", "")
        : `dark-${type}`;
      html.dataset.theme = newTheme;
      setTheme(newTheme);
    }
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, []);

  return (
    <div className="flex gap-4 md:flex-col md:items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-10 h-10 p-0 hover:bg-muted transition"
            variant="outline"
            size="icon"
          >
            <ArrowBigDown className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-44 rounded-xl shadow-xl bg-background border p-2 space-y-1"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-xs text-muted-foreground px-2">
            Select Theme
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="flex flex-col space-y-1">
            {themes.map((el, index) => {
              const isActive =
                theme === el ||
                theme === `dark-${el}` ||
                theme === el.replace("dark-", "");

              return (
                <button
                  key={index}
                  onClick={() => handleTheme(el, "theme")}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-muted transition ${
                    isActive ? "bg-muted font-semibold" : ""
                  }`}
                >
                  {el}
                  {isActive && <Check className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        className="w-10 h-10 p-0 hover:bg-muted transition"
        size="icon"
        variant="outline"
        onClick={() => handleTheme(theme, "dark")}
      >
        {theme.startsWith("dark-") ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
