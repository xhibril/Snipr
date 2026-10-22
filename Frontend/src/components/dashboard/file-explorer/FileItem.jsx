import { useEffect, useRef } from "react";
import styles from "./FileExplorer.module.css";
import { RiFile2Fill, RiPushpinFill } from "react-icons/ri";

export default function FileItem({
  file,
  selectedItem,
  selectItem,
  updateItemPinStatus,
  handleContextMenu,
  setIsEditing,
  isEditing,
  renameFile,
  toName,
  setToName,
  editingId,
}) {
  const editingInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editingId === file.id) {
      editingInputRef.current?.focus();
    }
  }, [isEditing, editingId, file.id]);

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

              updateItemPinStatus({
                type: "FILE",
                data: file,
              });
            }}
          />
        )}

        {isEditing && editingId === file.id ? (
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              renameFile(file, "FILE", toName);
              setIsEditing(false);
            }}
          >
            <input
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              ref={editingInputRef}
            />
          </form>
        ) : (
          <p className={styles.fileName}>{file.name}</p>
        )}
      </div>
    </div>
  );
}
