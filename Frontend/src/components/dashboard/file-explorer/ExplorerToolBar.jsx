import styles from "./FileExplorer.module.css";

import { FiTrash, FiStar, FiShare2, FiPlus } from "react-icons/fi";

import { RiFolderAddLine, RiFileAddLine } from "react-icons/ri";

import { useEffect } from "react";

export default function ExplorerToolBar({
  isCreatingItem,
  setIsCreatingItem,
  isCreatingFolder,
  setIsCreatingFolder,
  deleteItem,
  updateItemPinStatus,
  handleCreateItem,
  selectedItem,
  inputRef,
  page,
  emptyRecycleBin,
}) {
  useEffect(() => {
    setIsCreatingFolder(isCreatingItem.type === "FOLDER");
  }, [isCreatingItem]);

  return (
    <>
      <div className={styles.snippetControls}>
        {page.itemActions.includes("create") && (
          <>
            <RiFolderAddLine
              className={styles.snippetAction}
              onClick={() => {
                setIsCreatingItem((prev) =>
                  prev?.type === "FOLDER" ? false : { type: "FOLDER" },
                );
                setIsCreatingFolder(true);
              }}
            />

            <RiFileAddLine
              className={styles.snippetAction}
              onClick={() => {
                setIsCreatingItem((prev) =>
                  prev?.type === "FILE" ? false : { type: "FILE" },
                );
                setIsCreatingFolder(false);
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
