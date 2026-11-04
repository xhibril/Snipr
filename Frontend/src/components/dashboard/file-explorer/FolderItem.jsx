import styles from "./FileExplorer.module.css";
import { useEffect, useRef } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { RiFolderFill, RiPushpinFill } from "react-icons/ri";
import FileItem from "./FileItem";
import NewItem from "../../ui/NewItemInput";
export default function FolderItem({
  folder,
  files,
  index,
  isOpen,
  setOpenFolders,
  page,

  selectedItem,
  selectItem,

  updateItemPinStatus,
  moveSnippet,
  handleContextMenu,

  editingTarget,
  setEditingTarget,
  renameItem,
  pendingName,
  setPendingName,

  creationType,
  setCreationType,
  inputRef,
  createItem,
}) {
  const folderFiles = files.filter((file) => file.folderId === folder.id);

  const editingInputRef = useRef(null);

  useEffect(() => {
    if (editingTarget && editingTarget.id === folder.id) {
      editingInputRef.current?.focus();
    }
  }, [editingTarget, folder.id]);

  return (
    <div
      className={styles.folderItem}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.stopPropagation();

        const file = JSON.parse(e.dataTransfer.getData("file"));

        if (file.folderId !== folder.id) {
          moveSnippet({
            ...file,
            folderId: folder.id,
          }, file?.folderId, folder.id);
        }
      }}
    >
      <div
        className={styles.folderHeader}
        onClick={() => {
          selectItem(folder, "FOLDER");

          setOpenFolders((prev) =>
            prev.includes(index)
              ? prev.filter((i) => i !== index)
              : [...prev, index],
          );
        }}
        onContextMenu={(e) => handleContextMenu(e, folder, "FOLDER")}
      >
        <RiFolderFill className={styles.folderIcon} />

        {folder.isPinned && (
          <RiPushpinFill
            onClick={(e) => {
              e.stopPropagation();

              updateItemPinStatus(folder, "FOLDER");
            }}
          />
        )}

        {editingTarget && editingTarget.id === folder.id ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              renameItem(folder, "FOLDER", pendingName);
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
          <p className={styles.folderName}>{folder.name}</p>
        )}

        {page.itemActions.includes("openFolders") && (
          <>
            {isOpen ? (
              <FiChevronUp className={styles.toggleFolder} />
            ) : (
              <FiChevronDown className={styles.toggleFolder} />
            )}
          </>
        )}

        {page.showExpiration && (
          <p>
            {folder?.daysRemaining}
            days
          </p>
        )}
      </div>

      {page.itemActions.includes("openFolders") && (
        <div className={`${styles.folderFiles} ${isOpen ? styles.show : ""}`}>
          {folderFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              selectedItem={selectedItem}
              selectItem={selectItem}
              updateItemPinStatus={updateItemPinStatus}
              handleContextMenu={handleContextMenu}
              page={page}
              renameItem={renameItem}
              pendingName={pendingName}
              setPendingName={setPendingName}
              editingTarget = {editingTarget}
              setEditingTarget = {setEditingTarget}
             
            />
          ))}
        </div>
      )}

      {creationType &&
        selectedItem?.type === "FOLDER" &&
        selectedItem?.data?.id === folder.id && (
          <NewItem
          creationType = {creationType}
          setCreationType = {setCreationType}
            page={page}
            inputRef={inputRef}
            createItem={createItem}
          />
        )}
    </div>
  );
}
