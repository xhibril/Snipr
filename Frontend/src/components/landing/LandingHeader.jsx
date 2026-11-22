import styles from "./LandingHeader.module.css";
import global from "../../css/Global.module.css";
import OffcutLogo from "../../components/ui/OffcutLogo.jsx"
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {ThemeIcon} from "../../components/ui/SmallComponents.jsx"

export default function Header({theme, setTheme}) {
  const nav = useNavigate();

  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;

    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [hash, key]);

  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.headerTop}>

          <div className = {styles.headerBrand}>

          <OffcutLogo className = {styles.logo}/>
          <h1 onClick={() => nav("/")}>OFFCUT</h1>

          </div>


          <div className={styles.headerNav}>
            <nav className={styles.nav}>
              <Link to="/#about">About</Link>
              <Link to="/#features">Features</Link>
              <a onClick={() => nav("/support")}>Support</a>
            </nav>
          </div>

          <div className={styles.headerActions}>

          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <ThemeIcon theme = {theme}/>
          </button>
          
            <a
              className={`${global.btn} ${global.btnPrimary}`}
              onClick={() => nav("/signup")}
            >
              Signup
            </a>
            <a
              className={`${global.btn} ${global.btnSecondary}`}
              onClick={() => nav("/login")}
            >
              Login
            </a>
          </div>
        </div>
      </div>

    </header>
  );
}
