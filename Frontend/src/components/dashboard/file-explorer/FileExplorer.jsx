import styles from "./FileExplorer.module.css";
import { ValidateInput } from "../../utils/Validation.jsx";
import SearchFiles from "../../utils/Search.jsx";
import ExplorerToolBar from "./ExplorerToolBar";
import SearchBar from "./SearchBar";
import FolderItem from "./FolderItem.jsx";
import FileItem from "./FileItem.jsx";

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
  activePage,
  setActivePage,
}) {
  const [toggleSearchFilter, setToggleSearchFilter] = useState(false);
  const inputRef = useRef(null);
  const [openFolders, setOpenFolders] = useState([]);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [filterTags, setFilterTags] = useState([]);
  const nav = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  async function searchItems() {
    const result = SearchFiles(pageFiles, searchQuery, filterTags);
    setSearchResults(result);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filterTags]);

  function getAvailableName(name, items) {
    // name exists
    if (items.some((item) => item.name === name)) {
      return null;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      name = isCreatingFolder ? "New Folder" : "New File";
    } else {
      name = trimmedName;
    }

    // name doesnt exist
    if (!items.some((item) => item.name === name)) {
      return name;
    }

    let counter = 2;

    while (items.some((item) => item.name === `${name} (${counter})`)) {
      counter++;
    }
    return `${name} (${counter})`;
  }

  async function handleCreateItem(path, itemName) {
    const isFolder = isCreatingFolder;
    const items = isFolder ? folders : files;

    const inputRes = ValidateInput(itemName, "GENERAL");

    if (inputRes !== "VALID") {
      notify(`Invalid ${isFolder ? "folder" : "file"} name`, "ERROR");
      return;
    }

    itemName = getAvailableName(itemName, items);

    if (!itemName) {
      notify(`This ${isFolder ? "folder" : "file"} already exists`);
      return;
    }

    const folderId =
      selectedItem?.type === "FOLDER" ? selectedItem.data.id : null;

    const previous = structuredClone(items);

    const newItem = isFolder
      ? { name: itemName }
      : { name: itemName, folderId: folderId };

    if (isFolder) {
      setFolders((prev) => [...prev, newItem]);
    } else {
      setFiles((prev) => [...prev, newItem]);
    }

    const res = await ApiFetch(
      path,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      },
      notify,
      nav,
    );

    if (!res) {
      rollBack(isFolder, previous);
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      notify(
        data.message ||
          `Something went wrong while creating ${isFolder ? "folder" : "file"}`,
        "ERROR",
      );

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

    setIsViewingFile(false);
    setSelectedItem(null);
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
  }

  function rollBack(isFolder, previous) {
    isFolder ? setFolders(previous) : setFiles(previous);
  }

  // compare two folders at a time
  // pinned = 1 gets placed before unpinned = 0
  const sortedFolders = [...folders].sort((a, b) => b.isPinned - a.isPinned);
  const sortedFiles = [...files].sort((a, b) => b.isPinned - a.isPinned);

  const isSearching = searchQuery.trim() !== "" || filterTags.length > 0;

const pageFiles = {
  REGULAR: sortedFiles.filter((file) => file.folderId === null),
  SHARED: sortedFiles.filter((file) => file.folderId === null),
  STARRED: sortedFiles.filter((file) => file.folderId === null),
  DELETED: sortedFiles,
}[activePage];

const displayedFiles = isSearching
  ? searchResults
  : pageFiles;




  return (
    <>
      <div className={styles.fileExplorer}>
        <ExplorerToolBar
          setCreatingState={setCreatingState}
          deleteItem={deleteItem}
          updateItemPinStatus={updateItemPinStatus}
          handleCreateItem={handleCreateItem}
          selectedItem={selectedItem}
          isCreatingItem={isCreatingItem}
          isCreatingFolder={isCreatingFolder}
          inputRef={inputRef}
        />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSearchFilter={toggleSearchFilter}
          setToggleSearchFilter={setToggleSearchFilter}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
        />

        <div
          className={styles.snippetFiles}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const file = JSON.parse(e.dataTransfer.getData("file"));

            moveSnippet({
              ...file,
              folderId: null,
            });
          }}
        >
          {!isSearching &&
            sortedFolders.map((folder, index) => {
              return (
                <FolderItem
                  key={folder.id}
                  folder={folder}
                  files={files}
                  index={index}
                  isOpen={openFolders.includes(index)}
                  setOpenFolders={setOpenFolders}
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                  selectFile={selectFile}
                  updateItemPinStatus={updateItemPinStatus}
                  moveSnippet={moveSnippet}
                />
              );
            })}

          {displayedFiles.map((file) => {
              return (
                <FileItem
                  file={file}
                  selectedItem={selectedItem}
                  selectFile={selectFile}
                  updateItemPinStatus={updateItemPinStatus}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
