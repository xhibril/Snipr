import styles from "./FileExplorer.module.css";
import { ValidateInput } from "../../utils/Validation.jsx";

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
  const [filterTags, setFilterTags] = useState([]);

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



  function getAvailableName(name, items){
    // name exists
    if(items.some((item) => item.name === name)){
      return null;
    }

    const trimmedName = name.trim();

    if(!trimmedName){
      name = isCreatingFolder ? "New Folder" : "New File";
    } else {
      name = trimmedName;
    }

    // name doesnt exist
    if(!items.some((item) => item.name === name)){
      return name;
    }

    let counter = 2;

    while(items.some((item) => item.name === `${name} (${counter})`)){
      counter++;
    }
      return `${name} (${counter})`;

  }

  async function handleCreateItem(path, itemName) {
    const isFolder = isCreatingFolder;
    const items = isFolder ? folders : files;

    const inputRes = ValidateInput(itemName, "GENERAL");

    console.log("INPUT:", JSON.stringify(itemName));
console.log("TYPE:", typeof itemName);
console.log("RESULT:", ValidateInput(itemName, "GENERAL"));

    if(inputRes !== "VALID"){
      notify(`Invalid ${isFolder ? "folder" : "file"} name`, "ERROR");
      return;
    }

    itemName = getAvailableName(itemName, items);

    if(!itemName){
      notify(`This ${isFolder ? "folder" : "file"} already exists`);
      return;
    }

    const folderId = selectedItem?.type === "FOLDER" ? selectedItem.data.id : null;

    const previous = structuredClone(items)

    const newItem = isFolder ? 
    { name: itemName } :
    { name: itemName, folderId : folderId};


    if(isFolder){
      setFolders((prev) => [...prev, newItem]);
    } else {
      setFiles((prev) => [...prev, newItem]);
    }

    const res = await ApiFetch(
      path,
      {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(newItem)
      },
      notify,
      nav
    );


    if(!res){
      rollBack(isFolder, previous);
      return;
    }

    const data = await res.json();

    if(!res.ok){
      notify(data.message || `Something went wrong while creating ${isFolder ? "folder" : "file"}`, 
      "ERROR");

      rollBack(isFolder, previous);
      return;
    }

     if (isFolder) {
      setFolders((prev) =>
        prev.map((folder) => (folder === newItem ? data : folder)),
      );
    } else {
      setFiles((prev) => prev.map((file) => (file === newItem ? data : file)));
    }
  }

  async function updateItemPinStatus(selectedItem) {
    const isFolder = selectedItem.type === "FOLDER";
    const status = !selectedItem.data.isPinned;

    const path = `/${isFolder ? "folders" : "snippets"}/${selectedItem.data.id}/pin`;
    const previous = isFolder
      ? structuredClone(folders)
      : structuredClone(files);

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

    if (!res) {
      rollBack(isFolder, previous);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(data.message || "Could not pin, please try again", "ERROR");
      rollBack(isFolder, previous);
      return;
    }
  }

  async function deleteItem() {
    const isFolder = selectedItem.type === "FOLDER";
    const path = `/${isFolder ? "folders" : "snippets"}/${selectedItem.data.id}`;

    const previous = isFolder
      ? structuredClone(folders)
      : structuredClone(files);

    // opt update
    if (isFolder) {
      setFolders(
        folders.filter((folder) => folder.id !== selectedItem.data.id),
      );
    } else {
      setFiles(files.filter((file) => file.id !== selectedItem.data.id));
    }

    const res = await ApiFetch(path, { method: "DELETE" }, notify, nav);

    if (!res) {
      rollBack(isFolder, previous);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(data.message || "Could not delete, please try again", "ERROR");
      rollBack(isFolder, previous);
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

    if (!res) {
      setFiles(previousFiles);
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      notify(
        data.message || "Could not move snippet, pleasey try again",
        "ERROR",
      );
      setFiles(previousFiles);
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


    console.log("SELECTED FILEEEE: " + data.title + data.body + data.tags);
  }

  function rollBack(isFolder, previous) {
    isFolder ? setFolders(previous) : setFiles(previous);
  }

  // compare two folders at a time
  // pinned = 1 gets placed before unpinned = 0
  const sortedFolders = [...folders].sort((a, b) => b.isPinned - a.isPinned);
  const sortedFiles = [...files].sort((a, b) => b.isPinned - a.isPinned);

  return (
    <>
      <div className={styles.fileExplorer}>
        <div className={styles.snippetControls}>
          <RiFolderAddLine
            className={styles.snippetAction}
            onClick={() => {~
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
                    setFilterTags([...filterTags, e.target.value]);
                    e.target.value = "";
                  }
                }}
              />
              <FiPlus className={styles.addBtn} />
            </div>

            <div className={styles.filterContainer}>
              {filterTags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  <p>{tag}</p>

                  <FiX
                    className={styles.removeTag}
                    onClick={() =>
                      setFilterTags(filterTags.filter((_, i) => i !== index))
                    }
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
              key={folder.id}
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
                    onClick={(e) => {
                      const item = {
                        type: "FOLDER",
                        data: folder,
                      };

                      e.stopPropagation();
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
                      key={file.id}
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
                        onClick={() => {
                          selectFile(file);
                        }}
                      >
                        <RiFile2Fill className={styles.fileIcon} />
                        {file.isPinned && (
                          <RiPushpinFill
                            onClick={(e) => {
                              const item = {
                                type: "FILE",
                                data: file,
                              };

                              e.stopPropagation();
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
                key={file.id}
                className={styles.fileItem}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData("file", JSON.stringify(file));
                }}
              >
                <div
                  className={`${styles.fileHeader} ${selectedItem?.type === "FILE" && selectedItem?.data?.id === file?.id ? styles.selected : ""}`}
                  onClick={() => {
                    selectFile(file);
                  }}
                >
                  <RiFile2Fill className={styles.fileIcon} />
                  {file.isPinned && (
                    <RiPushpinFill
                      onClick={(e) => {
                        const item = {
                          type: "FILE",
                          data: file,
                        };
                        e.stopPropagation();
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
