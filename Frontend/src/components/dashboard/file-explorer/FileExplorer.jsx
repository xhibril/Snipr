import styles from "./FileExplorer.module.css";
import { ValidateInput } from "../../utils/Validation.jsx";
import SearchFiles from "../../utils/Search.jsx";
import ExplorerToolBar from "./ExplorerToolBar";
import SearchBar from "./SearchBar";
import FolderItem from "./FolderItem.jsx";
import FileItem from "./FileItem.jsx";
import ContextMenu from "./ContextMenu.jsx";
import { PAGE_CONFIG } from "../../../config/pageConfig.jsx";

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
  const [contextMenu, setContextMenu] = useState(null);


  const page = PAGE_CONFIG[activePage] ?? PAGE_CONFIG.REGULAR;

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

  function handleContextMenu(e, file, type) {
    e.preventDefault();

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: file,
      type: type,
    });
  }

  // close context menu
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  // focus on field
  useEffect(() => {
    if (isCreatingItem) {
      inputRef.current.focus();
    }
  }, [isCreatingItem, isCreatingFolder]);

  async function searchItems() {
    const result = SearchFiles(sortedFiles, searchQuery, filterTags);
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

  async function deleteItem(item, type) {
    if (!item || !type) {
      item = selectedItem?.data;
      type = selectedItem?.type;
    }

     const isFolder = type === "FOLDER";

     const isPermanent = page.deleteMode === "permanent";
    const path = `/${isFolder ? "folders" : "snippets"}/${item.id} 
    ${ isPermanent ? "/permanent" : ""}`;

    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    // opt update
    if (isFolder) {
      setFolders(folders.filter((folder) => folder.id !== item.id));

      setFiles(files.filter((file) => file.folderId !== item.id));
    } else {
      setFiles(files.filter((file) => file.id !== item.id));
    }

    const res = await ApiFetch(path, { method: "DELETE" }, notify, nav);

    if (!res) {
      rollBack(isFolder, previous);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(data.message || "Could not delete, please try again", "ERROR");
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    if (selectedItem?.data.id === item.id) {
      setSelectedItem(null);
      setIsViewingFile(false);
    }
  }

  async function recoverFiles(item, type) {
    const isFolder = type === "FOLDER";

    const path = `${isFolder ? "/folders" : "/snippets"}/${item.id}/recover`;

    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    if (isFolder) {
      setFolders(folders.filter((folder) => folder.id !== item.id));
      setFiles(files.filter((file) => file.folderId !== item.id));
    } else {
      setFiles(files.filter((file) => file.id !== item.id));
    }

    const res = await ApiFetch(path, { method: "PATCH" }, notify, nav);

    if (!res) {
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(
        data.message || `Could not recover ${isFolder ? "folder" : "file"}`,
        "ERROR",
      );
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    if (selectedItem?.data.id === item.id) {
      setSelectedItem(null);
      setIsViewingFile(false);
    }
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


  function onOpen(item, type){
    setSelectedItem({
      data:item,
      type:type
    })


    if(type === "FOLDER"){
      const index = sortedFolders.findIndex((folder) => folder.id === item.id);

      if(index !== -1){
        setOpenFolders((prev) => prev.includes(index) ? prev : [...prev, index]);
      }
   
    }
       setContextMenu(null);
  }

  // compare two folders at a time
  // pinned = 1 gets placed before unpinned = 0
  const sortedFolders = [...folders].sort((a, b) => b.isPinned - a.isPinned);
  const sortedFiles = [...files]
    .sort((a, b) => b.isPinned - a.isPinned)
    .filter(
      (file) =>
        file.folderId === null ||
        !folders.some((folder) => folder.id === file.folderId),
    );

  const isSearching = searchQuery.trim() !== "" || filterTags.length > 0;

  const displayedFiles = isSearching ? searchResults : sortedFiles;

  return (
    <>
      <div className={styles.fileExplorer}>

        {page.showExplorerToolBar &&
        <ExplorerToolBar
          setCreatingState={setCreatingState}
          deleteItem={deleteItem}
          updateItemPinStatus={updateItemPinStatus}
          handleCreateItem={handleCreateItem}
          selectedItem={selectedItem}
          isCreatingItem={isCreatingItem}
          isCreatingFolder={isCreatingFolder}
          inputRef={inputRef}
           page = {page}
        />
}

{page.showSearch &&
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSearchFilter={toggleSearchFilter}
          setToggleSearchFilter={setToggleSearchFilter}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
           page = {page}
        />
}

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

          {!isSearching && page.showFolders &&
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
                  handleContextMenu={handleContextMenu}
                  page = {page}
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
                handleContextMenu={handleContextMenu}
                page = {page}
              />
            );
          })}
        </div>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            file={contextMenu.item}
            onDelete={deleteItem}
            type={contextMenu.type}
            onRecover={recoverFiles}
            setSelectedItem={setSelectedItem}
            setContextMenu={setContextMenu}
            onOpen = {onOpen}
          />
        )}
      </div>
    </>
  );
}
