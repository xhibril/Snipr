import styles from "./Sidebar.module.css";
import AccountSettings from "./AccountSettings.jsx";
import { FiFolder, FiShare2, FiStar, FiTrash } from "react-icons/fi";
import OffcutLogo from "../../ui/OffcutLogo.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

export default function Sidebar({
  setActivePage,
  auth,
  notify,
  setAuth,
  theme,
  setTheme,
}) {
  const [toggleSideBar, setToggleSideBar] = useState(true);


  useEffect(() => {
  const handleResize = () => {
    setToggleSideBar(window.innerWidth > 768);
  };

  handleResize(); 

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div className={`${styles.sideBar} ${!toggleSideBar ? styles.collapsed : ""}`}>
      <div className={styles.brandHeader}>
        <OffcutLogo className={styles.logo} />
        {toggleSideBar && <h1>OFFCUT</h1>}
      </div>

      <div className={styles.navigation}>
        <button className={styles.navItem} onClick={() => setActivePage("ALL")}>
          <FiFolder className={styles.navIcon} />

          {toggleSideBar && <p className={styles.navLabel}>My Files</p>}
        </button>

        <button
          className={styles.navItem}
          onClick={() => setActivePage("SHARED")}
        >
          <FiShare2 className={styles.navIcon} />

          {toggleSideBar && <p className={styles.navLabel}>Shared Files</p>}
        </button>

        <button
          className={styles.navItem}
          onClick={() => setActivePage("PINNED")}
        >
          <FiStar className={styles.navIcon} />

          {toggleSideBar && <p className={styles.navLabel}>Starred</p>}
        </button>

        <button
          className={styles.navItem}
          onClick={() => setActivePage("DELETED")}
        >
          <FiTrash className={styles.navIcon} />

          {toggleSideBar && <p className={styles.navLabel}>Trash</p>}
        </button>
      </div>

      <AccountSettings
        auth={auth}
        setAuth={setAuth}
        notify={notify}
        setTheme={setTheme}
        theme={theme}
        toggleSideBar = {toggleSideBar}
      />
    </div>
  );
}
