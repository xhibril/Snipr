import { useState, useEffect } from "react";


export default function ThemeToggle({}){

      const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "light"
  );


  useEffect(() =>{

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);

  }, [theme]);


  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      Use {theme === "light" ? "dark" : "light"} mode
    </button>
  )

}