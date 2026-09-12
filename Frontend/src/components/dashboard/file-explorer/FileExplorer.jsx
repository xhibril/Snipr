import styles from "./FileExplorer.module.css";

import {
  FiX,
  FiSliders,
  FiShare2,
  FiStar,
  FiChevronUp,
  FiChevronDown,
  FiTrash,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

import {
  RiFile2Fill,
  RiFolderFill,
  RiFolderAddLine,
  RiFileAddLine,
  RiPushpinFill,
} from "react-icons/ri";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiFetch from "../../utils/Api.jsx";

export default function FileExplorer({
  folders,
  setFolders,
  files,
  setFiles,
  notify,
  selectedItem,
  setSelectedItem,
  setCreatingState,
  creatingState,
  updateSnippet,
  setIsViewingFile,
  setDraft,
  setOriginal,
}) {
  const [toggleSearchFilter, setToggleSearchFilter] = useState(false);
  const inputRef = useRef(null);
  const [foldersToggled, setFoldersToggle] = useState([]);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [tags, setTags] = useState([]);


  const nav = useNavigate();

  // updating input field for creating folder or file
  useEffect(() => {
    if (creatingState?.type === "FOLDER") {
      if (isCreatingFolder && isCreatingItem) {
        setIsCreatingFolder(false);
        setIsCreatingItem(false);
      } else {
        setIsCreatingFolder(true);
        setIsCreatingItem(true);
      }
    } else {
      if (!isCreatingFolder && isCreatingItem) {
        setIsCreatingFolder(false);
        setIsCreatingItem(false);
      } else {
        setIsCreatingFolder(false);
        setIsCreatingItem(true);
      }
    }
  }, [creatingState]);

  // focus on field
  useEffect(() => {
    if (isCreatingItem) {
      inputRef.current.focus();
    }
  }, [isCreatingItem, isCreatingFolder]);

  async function handleCreateItem(path, itemName) {
    let methods = {};
    let newFolder;
    let newFile;
    let folderId = null;

    if (selectedItem?.type === "FOLDER" && selectedItem?.data.id !== null) {
      folderId = selectedItem.data.id;
    }

    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    // opt update
    if (isCreatingFolder) {
      newFolder = { name: itemName };
      setFolders([...folders, newFolder]);

      methods = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName }),
      };
    } else {
      newFile = {
        name: itemName,
        folderId: null,
      };

      setFiles([...files, newFile]);

      methods = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, folderId: folderId }),
      };
    }
    const res = await ApiFetch(path, methods, notify, nav);

    if (!res) return;

    const data = await res.json();

    if (!res.ok) {
      notify(
        data.message ||
          (isCreatingFolder
            ? "Something went wrong while creating folder"
            : "Something went wrong while creating file"),
        "ERROR",
      );

      isCreatingFolder ? setFolders(previousFolders) : setFiles(previousFiles);
      return;
    }

    // replace item after returned
    if (isCreatingFolder) {
      setFolders((prev) =>
        prev.map((folder) => (folder === newFolder ? data : folder)),
      );
    } else {
      setFiles((prev) => prev.map((file) => (file === newFile ? data : file)));
    }
  }

  async function updateItemPinStatus(selectedItem) {
    const isFolder = selectedItem.type === "FOLDER";
    const status = !selectedItem.data.isPinned;

    const path = `/${isFolder ? "folders" : "snippets"}/${selectedItem.data.id}/pin`;
    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    // opt update
    if (isFolder) {
      setFolders(
        folders.map((folder) =>
          folder.id === selectedItem.data.id
            ? {
                ...folder,
                isPinned: status,
              }
            : folder,
        ),
      );
    } else {
      setFiles(
        files.map((file) =>
          file.id === selectedItem.data.id
            ? {
                ...file,
                isPinned: status,
              }
            : file,
        ),
      );
    }

    const res = await ApiFetch(path, { method: "PATCH" }, notify, nav);

    if (!res) return;

    const data = await res.json();

    if (!res.ok) {
      notify(data.message || "Could not pin, please try again", "ERROR");
      selectedItem.type === "FOLDER"
        ? setFolders(previousFolders)
        : setFiles(previousFiles);
      return;
    }
  }

  async function deleteItem() {

    const isFolder = selectedItem.type === "FOLDER";
    const path = `/${isFolder ? "folders" : "snippets"}/${selectedItem.data.id}`;

    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    // opt update
    if (selectedItem.type === "FOLDER") {
      setFolders(
        folders.filter((folder) => folder.id !== selectedItem.data.id),
      );
    } else {
      setFiles(files.filter((file) => file.id !== selectedItem.data.id));
    }

    const res = await ApiFetch(path, { method: "DELETE" }, notify, nav);

    if (!res) return;

    const data = await res.json();

    if (!res.ok) {
      notify(data.message || "Could not delete, please try again", "ERROR");
      selectedItem.type === "FOLDER"
        ? setFolders(previousFolders)
        : setFiles(previousFiles);
      return;
    }

    notify(data.message, "SUCCESS");
    setIsViewingFile(false);
  }

  async function moveSnippet(snippet) {
    const path = `/snippets/${snippet.id}`;

    const previousFiles = structuredClone(files);

    // opt update
    setFiles((prev) =>
      prev.map((file) =>
        file.id === snippet.id ? { ...file, folderId: snippet.folderId } : file,
      ),
    );

    const res = await ApiFetch(
      path,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: snippet.folderId }),
      },
      notify,
      nav,
    );

    if (!res) return;

    const data = await res.json();

    if (!res.ok) {
      notify(
        data.message || "Could not move snippet, pleasey try again",
        "ERROR",
      );
      setFiiles(previousFiles);
      return;
    }
  }

  function selectFile(file) {
    setSelectedItem({
      type: "FILE",
      data: file,
    });

    const data = {
      title: file.title || "",
      body: file.body || "",
      tags: file.tags || [],
    };

    setDraft(data);
    setOriginal(data);
  }

  // compare two folders at a time
  // pinned = 1 gets placed before unpinned = 0
    const sortedFolders = [...folders.sort((a,b) => b.isPinned - a.isPinned)]
    const sortedFiles = [...files.sort((a,b) => b.isPinned - a.isPinned)]
  
  return ( 
    <>


      <div className={styles.fileExplorer}>
        <div className={styles.snippetControls}>
          <RiFolderAddLine
            className={styles.snippetAction}
            onClick={() => {
              setCreatingState({
                type: "FOLDER",
                tick: Date.now(),
              });
            }}
          />

          <RiFileAddLine
            className={styles.snippetAction}
            onClick={() => {
              setCreatingState({
                type: "FILE",
                tick: Date.now(),
              });
            }}
          />

          <FiTrash
            className={styles.snippetAction}
            onClick={() => deleteItem()}
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
                inputRef.current.value,
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

        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <input
              type="text"
              className={styles.searchField}
              placeholder="Search"
            />

            <FiSearch className={styles.searchIcon} />

            <FiSliders
              className={styles.searchFilter}
              onClick={() => setToggleSearchFilter(!toggleSearchFilter)}
            />
          </div>

          <div
            className={`${styles.filter} ${
              toggleSearchFilter ? styles.show : ""
            }`}
          >
            <div className={styles.filterFieldWrapper}>
              <input
                type="text"
                className={styles.filterField}
                placeholder="Add tags"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    setTags([...tags, e.target.value]);

                    e.target.value = "";
                  }
                }}
              />

              <FiPlus className={styles.addBtn} />
            </div>

            <div className={styles.filterContainer}>
              {tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  <p>{tag}</p>

                  <FiX
                    className={styles.removeTag}
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={styles.snippetFiles}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const file = JSON.parse(e.dataTransfer.getData("file"));

            const snippet = {
              ...file,
              folderId: null,
            };

            moveSnippet(snippet);
          }}
        >
          {sortedFolders.map((folder, index) => (
            <div
              className={styles.folderItem}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.stopPropagation(); // prevent outer container from firing
                const file = JSON.parse(e.dataTransfer.getData("file"));

                const snippet = {
                  ...file,
                  folderId: folder.id,
                };

                if (file.folderId !== folder.id) {
                  moveSnippet(snippet);
                }
              }}
            >
              <div
                className={`${styles.folderHeader} ${
                  selectedItem?.type === "FOLDER" &&
                  selectedItem?.data?.id === folder?.id
                    ? styles.selected
                    : ""
                }`}
                onClick={() => {
                  if (
                    selectedItem?.type === "FOLDER" &&
                    selectedItem?.data?.id === folder?.id
                  ) {
                    setSelectedItem(null);
                  } else {
                    setSelectedItem({
                      type: "FOLDER",
                      data: folder,
                    });
                  }

                  if (foldersToggled.includes(index)) {
                    setFoldersToggle(
                      foldersToggled.filter((folder) => folder !== index),
                    );
                  } else {
                    setFoldersToggle([...foldersToggled, index]);
                  }
                }}
              >
                <RiFolderFill className={styles.folderIcon} />

                {folder.isPinned && (
                  <RiPushpinFill
                    onClick={() => {
                      const item = {
                        type: "FOLDER",
                        data: folder,
                      };

                      updateItemPinStatus(item);
                    }}
                  />
                )}

                <p className={styles.folderName}>{folder.name}</p>
                {foldersToggled.includes(index) ? (
                  <FiChevronUp className={styles.toggleFolder} />
                ) : (
                  <FiChevronDown className={styles.toggleFolder} />
                )}
              </div>

              <div
                className={`${styles.folderFiles} ${foldersToggled.includes(index) ? styles.show : ""}`}
              >
                {/*add files belonging to folders */}
                {sortedFiles
                  .filter((file) => file.folderId === folder.id)
                  .map((file) => (
                    <div
                      className={styles.fileItem}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("file", JSON.stringify(file));
                      }}
                    >
                      <div
                        className={`${styles.fileHeader} ${
                          selectedItem?.type === "FILE" &&
                          selectedItem?.data?.id === file?.id
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() => {selectFile(file)}}
                      >
                        <RiFile2Fill className={styles.fileIcon} />
                        {file.isPinned && (
                          <RiPushpinFill
                            onClick={() => {
                              const item = {
                                type: "FILE",
                                data: file,
                              };

                              updateItemPinStatus(item);
                            }}
                          />
                        )}
                        <p className={styles.fileName}>{file.name}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {sortedFiles
            .filter((file) => file.folderId === null)
            .map((file) => (
              <div
                className={styles.fileItem}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("file", JSON.stringify(file));
                }}
              >
                <div
                  className={`${styles.fileHeader} ${selectedItem?.type === "FILE" && selectedItem?.data?.id === file?.id ? styles.selected : ""}`}

                  onClick={() => { selectFile(file)}}
                >
                  <RiFile2Fill className={styles.fileIcon} />
                  {file.isPinned && (
                    <RiPushpinFill
                      onClick={() => {
                        const item = {
                          type: "FILE",
                          data: file,
                        };
                        updateItemPinStatus(item);
                      }}
                    />
                  )}
                  <p className={styles.fileName}>{file.name}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
