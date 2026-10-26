import styles from "../../../pages/dashboard/Dashboard.module.css";

import logo from "../../../assets/images/logo.svg";
import { useState } from "react";
import ApiFetch from "../../utils/Api";

import {
  FiFolder,
  FiShare2,
  FiStar,
  FiTrash,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setActivePage, isAuth, notify, setIsAuth }) {
  const [toggleSettings, setToggleSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  async function logout() {
    setIsLoading(true);

    try {
      const res = await ApiFetch("/logout", { method: "POST" }, notify, nav);

      if (!res?.ok) {
        notify("Could not logout, please try again", "ERROR");
        return;
      }
    } catch {
      notify("Could not logout, please try again", "ERORR");
    } finally {
      setIsLoading(false);
      setIsAuth({
        authenticated: false,
        user: null
      })
      nav("/", { replace: true }); // clear back n forward history
    }
  }

  return (
    <div className={styles.sideBar}>
      <div className={styles.brandHeader}>
        <img src={logo} alt="SNIPR logo" />
        <h1>SNIPR</h1>
      </div>

      <div className={styles.options}>
        <button
          className={styles.optionRow}
          onClick={() => setActivePage("ALL")}
        >
          <FiFolder className={styles.optionIcon} />
          <p className={styles.optionText}>My Files</p>
        </button>

        <button
          className={styles.optionRow}
          onClick={() => setActivePage("SHARED")}
        >
          <FiShare2 className={styles.optionIcon} />
          <p className={styles.optionText}>Shared Files</p>
        </button>

        <button
          className={styles.optionRow}
          onClick={() => setActivePage("PINNED")}
        >
          <FiStar className={styles.optionIcon} />
          <p className={styles.optionText}>Starred</p>
        </button>

        <button
          className={styles.optionRow}
          onClick={() => setActivePage("DELETED")}
        >
          <FiTrash className={styles.optionIcon} />
          <p className={styles.optionText}>Trash</p>
        </button>
      </div>

      <div className={styles.accountContainer}>
        <div
          className={`${styles.accountSettings} ${toggleSettings ? styles.show : ""}`}
        >
          <button onClick={() => nav("/account/password")}>Change Password</button>
                    <button onClick={() => nav("/account/profile")}>Change Username</button>
          <button>Change Email</button>
          <button>Delete Account</button>
        </div>

        <div className={styles.accountRow}>
          <div className={styles.accountDetails}>
            <p className={styles.accountName}>{isAuth?.user?.username}</p>
            <p className={styles.accountEmail}>{isAuth?.user?.email}</p>

            <button
              className={styles.logoutBtn}
              onClick={(e) => logout()}
              disabled={isLoading}
            >
              {isLoading ? "Loggin out..." : "Logout"}
            </button>
          </div>

          <div
            className={styles.accountArrowIcons}
            onClick={() => setToggleSettings(!toggleSettings)}
          >
            <FiChevronUp />
            <FiChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
}
