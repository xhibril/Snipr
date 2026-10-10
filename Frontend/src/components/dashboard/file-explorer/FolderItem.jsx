import styles from "./FileExplorer.module.css";
import { useState, useEffect } from "react";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";

import { RiFolderFill, RiPushpinFill } from "react-icons/ri";

import FileItem from "./FileItem";

export default function FolderItem({
  folder,
  files,
  index,
  isOpen,
  setOpenFolders,
  selectedItem,
  setSelectedItem,
  selectFile,
  updateItemPinStatus,
  moveSnippet,
  handleContextMenu,
  page,
  isEditing,
  setIsEditing,
  renameFile,
  toName,
  setToName,
  
  editingId
}) {
  const folderFiles = files.filter((file) => file.folderId === folder.id);

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
          });
        }
      }}
    >
      <div
        className={`${styles.folderHeader} ${
          selectedItem?.type === "FOLDER" &&
          selectedItem?.data?.id === folder.id
            ? styles.selected
            : ""
        }`}
        onClick={() => {
          if (
            selectedItem?.type === "FOLDER" &&
            selectedItem?.data?.id === folder.id
          ) {
            setSelectedItem(null);
          } else {
            setSelectedItem({
              type: "FOLDER",
              data: folder,
            });
          }

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

              updateItemPinStatus({
                type: "FOLDER",
                data: folder,
              });
            }}
          />
        )}

        {isEditing && editingId === folder.id ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              renameFile(folder, "FOLDER", toName);
              setIsEditing(false)
            }}
          >
            <input value={toName} onChange={(e) => setToName(e.target.value)} />
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
      </div>

      {page.itemActions.includes("openFolders") && (
        <div className={`${styles.folderFiles} ${isOpen ? styles.show : ""}`}>
          {folderFiles.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              selectedItem={selectedItem}
              selectFile={selectFile}
              updateItemPinStatus={updateItemPinStatus}
              handleContextMenu={handleContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}
