import styles from "./LandingFooter.module.css";
import global from "../../css/Global.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={global.container}>
        <div className={styles.footerTop}>
          <h2>HIGZO</h2>

          <div className={styles.footerLinks}>
            <a
              href="https://github.com/xhibril"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            <a href="mailto:contact@xhibril.dev" target="_blank">
              Email
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 Higzo. All rights reserved.</p>
          <p>Personal project</p>
        </div>
      </div>
    </footer>
  );
}
