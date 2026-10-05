import styles from "./FileExplorer.module.css";

import {
  FiTrash,
  FiStar,
  FiShare2,
  FiPlus,
} from "react-icons/fi";

import {
  RiFolderAddLine,
  RiFileAddLine,
} from "react-icons/ri";

export default function ExplorerToolBar({
  setCreatingState,
  deleteItem,
  updateItemPinStatus,
  handleCreateItem,
  selectedItem,
  isCreatingItem,
  isCreatingFolder,
  inputRef,
}) {
  return (
    <>
      <div className={styles.snippetControls}>
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

        <FiTrash
          className={styles.snippetAction}
          onClick={deleteItem}
        />

        <FiStar
          className={styles.snippetAction}
          onClick={() => updateItemPinStatus(selectedItem)}
        />

        <FiShare2 className={styles.snippetAction} />
      </div>

      {isCreatingItem && (
        <form
          className={styles.addFile}
          onSubmit={(e) => {
            e.preventDefault();

            handleCreateItem(
              isCreatingFolder ? "/folders" : "/snippets",
              inputRef.current.value || ""
            );

            inputRef.current.value = "";
          }}
        >
          <input
            className={styles.addFileField}
            ref={inputRef}
            placeholder={
              isCreatingFolder ? "Folder name" : "File name"
            }
          />

          <button type="submit">
            <FiPlus className={styles.addBtn} />
          </button>
        </form>
      )}
    </>
  );
}