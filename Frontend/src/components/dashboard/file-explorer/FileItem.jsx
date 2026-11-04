import { useEffect, useRef } from "react";
import styles from "./FileExplorer.module.css";
import { RiFile2Fill, RiPushpinFill } from "react-icons/ri";

export default function FileItem({
  file,
  selectItem,
  updateItemPinStatus,
  handleContextMenu,
 editingTarget,
 setEditingTarget,
  renameItem,
  pendingName,
  setPendingName,
  page,
}) {
  const editingInputRef = useRef(null);

  useEffect(() => {
    if (editingTarget && editingTarget.id === file.id) {
      editingInputRef.current?.focus();
    }
  }, [editingTarget, file.id]);

  return (
    <div
      className={styles.fileItem}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("file", JSON.stringify(file));
      }}
    >
      <div
        className={styles.fileHeader}
        onClick={() => selectItem(file, "FILE")}
        onContextMenu={(e) => handleContextMenu(e, file, "FILE")}
      >
        <RiFile2Fill className={styles.fileIcon} />

        {file.isPinned && (
          <RiPushpinFill
            onClick={(e) => {
              e.stopPropagation();

              updateItemPinStatus(file, "FILE")
            }}
          />
        )}

        {editingTarget && editingTarget.id === file.id ? (
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              renameItem(file, "FILE", pendingName);
              setEditingTarget(null);
            }}
          >
            <input
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              ref={editingInputRef}
            />
          </form>
        ) : (
          <p className={styles.fileName}>{file.name}</p>
        )}

        {page.showExpiration && (
          <p>
            {file?.daysRemaining}
            days
          </p>
        )}
      </div>
    </div>
  );
}
