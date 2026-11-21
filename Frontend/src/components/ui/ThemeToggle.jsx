import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import global from "../../css/Global.module.css"

export default function ThemeToggle({className, onToggle}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <>
      {theme === "light" ? (
        <Moon onClick={toggleTheme} className = {`${global.themeBtns} ${className || ""}`} />
      ) : (
        <Sun onClick={toggleTheme} className = {`${global.themeBtns} ${className || ""}`}/>
      )}
    </>
  );
}
