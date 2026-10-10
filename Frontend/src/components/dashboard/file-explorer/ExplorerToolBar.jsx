import styles from "./FileExplorer.module.css";

import { FiTrash, FiStar, FiShare2, FiPlus } from "react-icons/fi";

import { RiFolderAddLine, RiFileAddLine } from "react-icons/ri";

export default function ExplorerToolBar({
  setCreatingState,
  deleteItem,
  updateItemPinStatus,
  handleCreateItem,
  selectedItem,
  isCreatingItem,
  isCreatingFolder,
  inputRef,
  page,
}) {
  return (
    <>
      <div className={styles.snippetControls}>
        {page.itemActions.includes("create") && (
          <>
            <RiFolderAddLine
              className={styles.snippetAction}
              onClick={() =>
                setCreatingState({
                  type: "FOLDER",
                  tick: Date.now(),
                })
              }
            />

            <RiFileAddLine
              className={styles.snippetAction}
              onClick={() =>
                setCreatingState({
                  type: "FILE",
                  tick: Date.now(),
                })
              }
            />
          </>
        )}

        {page.itemActions.includes("delete") && (
          <FiTrash className={styles.snippetAction} onClick={deleteItem} />
        )}

        {page.itemActions.includes("pin") && (
          <FiStar
            className={styles.snippetAction}
            onClick={() => updateItemPinStatus(selectedItem)}
          />
        )}

        {page.itemActions.includes("share") && (
          <FiShare2 className={styles.snippetAction} />
        )}
      </div>

      {isCreatingItem && page.itemActions.includes("create") && (
        <form
          className={styles.addFile}
          onSubmit={(e) => {
            e.preventDefault();

            handleCreateItem(
              isCreatingFolder ? "/folders" : "/snippets",
              inputRef.current.value || "",
            );

            inputRef.current.value = "";
          }}
        >
          <input
            className={styles.addFileField}
            ref={inputRef}
            placeholder={isCreatingFolder ? "Folder name" : "File name"}
          />

          <button type="submit">
            <FiPlus className={styles.addBtn} />
          </button>
        </form>
      )}
    </>
  );
}
