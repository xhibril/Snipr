import styles from "./LandingHeader.module.css";
import ThemeToggle from "../ui/ThemeToggle.jsx"
import global from "../../css/Global.module.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Header() {

    const nav = useNavigate();

    const {hash, key} = useLocation();


    useEffect(() => {
      if(!hash) return

      document.getElementById(hash.slice(1))?.scrollIntoView({behavior : "smooth"});
    }, [hash, key])



  return (
    <header>
      <div className={styles.headerContainer}>
        <div className={styles.headerTop}>
          <h1 onClick={() => nav("/")}>HIGZO</h1>

          <div className={styles.headerNav}>
            <nav className={styles.nav}>
<Link to="/#about">About</Link>
  <Link to="/#features">Features</Link>
              <a onClick={() => nav("/support")}>Support</a>
            </nav>
          </div>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <a
              className={`${global.landingBtn} ${global.landingPrimary}`}
              onClick={() => nav("/signup")}
            >
              Signup
            </a>
            <a
              className={`${global.landingBtn} ${global.landingSecondary}`}
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
