import styles from "./FileExplorer.module.css";

import { FiTrash, FiStar, FiShare2 } from "react-icons/fi";

import { RiFolderAddLine, RiFileAddLine } from "react-icons/ri";

import { useEffect } from "react";

export default function ExplorerToolBar({
  creationType,
  setCreationType,
  deleteItem,
  updateItemPinStatus,

  selectedItem,

  page,
  emptyRecycleBin,
}) {


  return (
    <>
      <div className={styles.snippetControls}>
        {page.itemActions.includes("create") && (
          <>
            <RiFolderAddLine
              className={styles.snippetAction}
              onClick={() => {
                setCreationType((prev) => prev === "FILE" ? null : "FILE");
              }}
            />

            <RiFileAddLine
              className={styles.snippetAction}
              onClick={() => {
             setCreationType((prev) => prev === "FOLDER" ? null : "FOLDER");
              }}
            />
          </>
        )}

        {page.itemActions.includes("delete") && (
          <FiTrash className={styles.snippetAction} onClick={deleteItem} />
        )}

        {page.deleteMode === "permanent" && (
          <div onClick={emptyRecycleBin}>
            <FiTrash className={styles.snippetAction} />
            Empty recycle bin
          </div>
        )}

        {page.itemActions.includes("pin") && (
          <FiStar
            className={styles.snippetAction}
            onClick={() =>
              updateItemPinStatus(selectedItem?.data, selectedItem?.type)
            }
          />
        )}

        {page.itemActions.includes("share") && (
          <FiShare2 className={styles.snippetAction} />
        )}
      </div>
    </>
  );
}
