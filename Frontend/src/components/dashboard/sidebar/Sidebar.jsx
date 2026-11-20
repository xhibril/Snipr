import styles from "./Sidebar.module.css";

import logo from "../../../assets/images/logo.svg";
import { useState } from "react";
import apiFetch from "../../utils/Api";

import AccountSettings from "./AccountSettings.jsx";

import {
  FiFolder,
  FiShare2,
  FiStar,
  FiTrash,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import OffcutLogo from "../../ui/OffcutLogo.jsx";

export default function Sidebar({ setActivePage, auth, notify, setAuth }) {

  return (
    <div className={styles.sideBar}>
      <div className={styles.brandHeader}>
        <OffcutLogo className = {styles.logo}/>
        <h1>OFFCUT</h1>
      </div>

      <div className={styles.navigation}>
        <button
          className={styles.navItem}
          onClick={() => setActivePage("ALL")}
        >
          <FiFolder className={styles.navIcon} />
          <p className={styles.navLabel}>My Files</p>
        </button>

        <button
          className={styles.navItem}
          onClick={() => setActivePage("SHARED")}
        >
          <FiShare2 className={styles.navIcon} />
          <p className={styles.navLabel}>Shared Files</p>
        </button>

        <button
          className={styles.navItem}
          onClick={() => setActivePage("PINNED")}
        >
          <FiStar className={styles.navIcon} />
          <p className={styles.navLabel}>Starred</p>
        </button>

        <button
          className={styles.navItem}
          onClick={() => setActivePage("DELETED")}
        >
          <FiTrash className={styles.navIcon} />
          <p className={styles.navLabel}>Trash</p>
        </button>
      </div>


<AccountSettings auth = {auth} setAuth = {setAuth} notify = {notify}/>
      
    </div>
  );
}
