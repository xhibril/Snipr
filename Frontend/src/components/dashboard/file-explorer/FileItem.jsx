import styles from "./FileExplorer.module.css";
import { RiFile2Fill, RiPushpinFill } from "react-icons/ri";

export default function FileItem({
  file,
  selectedItem,
  selectFile,
  updateItemPinStatus,
  handleContextMenu,
  page,
  setIsEditing,
  isEditing,
  renameFile,
  toName,
  setToName,
  editingId
}) {
  return (
    <div
      className={styles.fileItem}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("file", JSON.stringify(file));
      }}
    >
      <div
        className={`${styles.fileHeader} ${
          selectedItem?.type === "FILE" && selectedItem?.data?.id === file.id
            ? styles.selected
            : ""
        }`}
        onClick={() => selectFile(file)}
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

        {isEditing&& editingId === file.id? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              renameFile(file, "FILE", toName);
              setIsEditing(false);
            }}
          >
            <input value={toName} onChange={(e) => setToName(e.target.value)} />
          </form>
        ) : (
          <p className={styles.fileName}>{file.name}</p>
        )}



      </div>
    </div>
  );
}
