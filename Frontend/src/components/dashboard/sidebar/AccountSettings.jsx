import styles from "./AccountSettings.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../../utils/Api";
import { ThemeIcon } from "../../ui/SmallComponents";

import { FiLock, FiUser, FiMail, FiTrash2, FiLogOut } from "react-icons/fi";

export default function AccountSettings({
  notify,
  auth,
  setAuth,
  theme,
  setTheme,
  toggleSideBar,
}) {
  const [toggleSettings, setToggleSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();



console.log("AccountSettings rendered");

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
    <div className={styles.container}>
      <div
        className={`${styles.settings} ${toggleSettings ? styles.show : ""}`}
      >
        <div className={styles.settingsGroups}>
          <h3> ACCOUNT SETTINGS</h3>

          <div className={styles.accountSettings}>
            <button
              className={styles.groupItem}
              onClick={() => nav("/account/profile")}
            >
              <FiUser className={styles.itemIcon} />
              <span>Change username</span>
            </button>

            <button
              className={styles.groupItem}
              onClick={() => nav("/account/password")}
            >
              <FiLock className={styles.itemIcon} />
              <span>Change password</span>
            </button>

            <button
              className={styles.groupItem}
              onClick={() => nav("/account/email")}
            >
              <FiMail className={styles.itemIcon} />
              <span>Change email</span>
            </button>

            <button
              className={styles.groupItem}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <ThemeIcon theme={theme} className={styles.itemIcon} />

              <span>Appearance</span>
            </button>
          </div>

          <div className={styles.accountActions}>
            <button
              className={`${styles.groupItem} ${styles.deleteAccount}`}
              onClick={() => nav("/account/delete")}
            >
              <FiTrash2 className={styles.itemIcon} />
              <span>Delete account </span>
            </button>

            <button
              className={styles.groupItem}
              onClick={() => logout()}
              disabled={isLoading}
            >
              <FiLogOut className={styles.itemIcon} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={styles.profile}
        onClick={() => setToggleSettings(!toggleSettings)}
      >
        <span className={styles.profileIcon}> {auth?.user?.username[0]}</span>

        {toggleSideBar && (
          <div className={styles.accountDetails}>
            <p className={styles.accountName}>{auth?.user?.username}</p>
            <p className={styles.accountEmail}>{auth?.user?.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
