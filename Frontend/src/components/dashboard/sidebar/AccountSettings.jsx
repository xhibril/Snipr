import styles from "./AccountSettings.module.css";
import { useState } from "react";
import ThemeToggle from "../../ui/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
export default function AccountSettings({ notify, auth, setAuth }) {
  const [toggleSettings, setToggleSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isThemeDark = localStorage.getItem("theme") === "dark";
  const nav = useNavigate();

  async function logout() {
    try {
      setIsLoading(true);
      const res = await apiFetch("/logout", { method: "POST" }, notify, nav);

      if (!res?.ok) {
        notify("Could not logout, please try again", "ERROR");
        return;
      }

      setAuth({
        authenticated: false,
        user: null,
      });
      nav("/", { replace: true }); // clear back n forward history
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.accountContainer}>
      <div
        className={`${styles.accountSettings} ${toggleSettings ? styles.show : ""}`}
      >
        <h2>Account settings</h2>

        <div className={styles.settingsGroup}>
          <h3 className={styles.groupLabel}> SETTINGS</h3>

          <button onClick={() => nav("/account/password")}>
            Change Password
          </button>
          <button onClick={() => nav("/account/profile")}>
            Change Username
          </button>

          <button onClick={() => nav("/account/email")}>Change Email</button>
        </div>

        <div className={styles.settingsGroup}>
          <h3 className={styles.groupLabel}> PREFERENCES</h3>

          <div className={styles.settingsGroupContainer}>
            <ThemeToggle />
            <div className={styles.appearance}>
              <p>Appearance</p>
              <p>{isThemeDark ? "Dark theme" : "Light theme"}</p>
            </div>

            <span className={styles.themeBadge}>On</span>
          </div>
        </div>

        <div className={styles.settingsGroup}>
          <div className={styles.deleteAccount}>
            <button
              className={styles.deleteAccountBtn}
              onClick={() => nav("/account/delete")}
            >
              Delete account
            </button>
          </div>

          <button
            className={styles.logoutBtn}
            onClick={(e) => logout()}
            disabled={isLoading}
          >
            {isLoading ? "Loggin out..." : "Logout"}
          </button>
        </div>
      </div>

      <div className={styles.profile}>

<div className = {styles.profileIconContainer}>
        <span className = {styles.profileIcon}> {auth?.user?.username[0]}</span>
</div>
        <div className={styles.accountDetails}>
          <p className={styles.accountName}>{auth?.user?.username}</p>
          <p className={styles.accountEmail}>{auth?.user?.email}</p>
        </div>


<div className = {styles.toggleSettingsContainer}>
        <Settings onClick={() => setToggleSettings(!toggleSettings)}
            className = {styles.toggleSettings}/>
            </div>
      </div>
    </div>
  );
}
