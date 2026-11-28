import styles from "./FileExplorer.module.css";
import { FiTrash, FiStar, FiShare2 } from "react-icons/fi";
import { RiFolderAddLine, RiFileAddLine } from "react-icons/ri";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ExplorerToolBar({
  creationType,
  setCreationType,
  deleteItem,
  updateItemPinStatus,
  isExpanded, 
  setIsExpanded,

  selectedItem,

  page,
  emptyRecycleBin,
}) {

  const [toggleResizeBtns, setToggleResizeBtns] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setToggleResizeBtns(window.innerWidth < 600);
    };


    const safeGuard = () => {
      if(!isExpanded && window.innerWidth > 600){
      setIsExpanded(true);
      }
  }

    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", safeGuard);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", safeGuard);
    }
  });

  useEffect(() => {
    console.log(toggleResizeBtns);
  });

  return (
    <div className={styles.explorerActions}>
      {isExpanded && (
        <div className = {styles.persistentActions}>
          {page.itemActions.includes("create") && (
            <>
              <RiFolderAddLine
                className={styles.action}
                onClick={() => {
                  setCreationType((prev) => (prev === "FILE" ? null : "FILE"));
                }}
              />

              <RiFileAddLine
                className={styles.action}
                onClick={() => {
                  setCreationType((prev) =>
                    prev === "FOLDER" ? null : "FOLDER",
                  );
                }}
              />
            </>
          )}

          {page.itemActions.includes("delete") && (
            <FiTrash className={styles.action} onClick={deleteItem} />
          )}

          {page.deleteMode === "permanent" && (
            <div onClick={emptyRecycleBin}>
              <FiTrash className={styles.action} />
              Empty recycle bin
            </div>
          )}

          {page.itemActions.includes("pin") && (
            <FiStar
              className={styles.action}
              onClick={() =>
                updateItemPinStatus(selectedItem?.data, selectedItem?.type)
              }
            />
          )}

          {page.itemActions.includes("share") && (
            <FiShare2 className={styles.action} />
          )}
        </div>
      )}


      {toggleResizeBtns && (
        <div className = {styles.conditionalActions}>
          {isExpanded ? (
            <ChevronsLeft
              className={styles.action}

              onClick={() => 
                setIsExpanded(!isExpanded)}
  
            />
          ) : (
            <ChevronsRight
              className={styles.action}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}
        </div>
      )}
    </div>
  );
}
