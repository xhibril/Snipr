import styles from "./FileExplorer.module.css";
import {ValidateInput} from "../../utils/Validation.jsx";
import SearchFiles from "../../utils/Search.jsx";
import ExplorerToolBar from "./ExplorerToolBar";
import SearchBar from "./SearchBar";
import FolderItem from "./FolderItem.jsx";
import FileItem from "./FileItem.jsx";
import ContextMenu from "./ContextMenu.jsx";
import {PAGE_CONFIG} from "../../../config/pageConfig.jsx";
import NewItem from "../../ui/NewItemInput.jsx";
import useFileExplorerActions from "./useFileExplorerActions";

import {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import ApiFetch from "../../utils/Api.jsx";

export default function FileExplorer({
  folders,
  setFolders,
  files,
  setFiles,
  notify,
  selectedItem,
  setSelectedItem,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copy, setCopy] = useState([]);

  const [toName, setToName] = useState(null);

  const page = PAGE_CONFIG[activePage] ?? PAGE_CONFIG.REGULAR;

  const {
  updateItemPinStatus,
  deleteItem,
  recoverFiles,
  moveSnippet,
  renameFile,
  emptyRecycleBin,
  pasteItem,
} = useFileExplorerActions({
  folders,
  setFolders,
  files,
  setFiles,
  notify,
  nav,
  page,
  selectedItem,
  setSelectedItem,
  setIsViewingFile,
  setToName,
  setEditingId,
  getAvailableName,
});

  useEffect(() => {
    setSelectedItem(null);
    setOpenFolders([]);
  }, [page]);

  function handleContextMenu(e, file, type) {
    e.preventDefault();
    setIsCreatingItem(false);
    setIsEditing(false);

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: file,
      type: type,
    });
  }

    // close context menu on click
    useEffect(() => {
      const closeMenu = () => {
             setIsEditing(false);
        setContextMenu(null);
   
        document.removeEventListener("click", closeMenu);
      };
  
      document.addEventListener("click", closeMenu);
  
      return () => {
        document.removeEventListener("click", closeMenu);
      };
    }, [contextMenu]);

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

  function getAvailableName(name, items, type) {
    // name exists
    if (items.some((item) => item.name === name)) {
      return null;
    }

    const trimmedName = name?.trim();

    if (!trimmedName) {
      name = type === "FOLDER" ? "New Folder" : "New File";
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

  async function handleCreateItem(itemName) {
    const isFolder = isCreatingFolder;
    const items = isFolder ? folders : files;
    const path = isCreatingFolder ? "/folders" : "/snippets";

    const inputRes = ValidateInput(itemName, "GENERAL");

    if (inputRes !== "VALID") {
      notify(`Invalid ${isFolder ? "folder" : "file"} name`, "ERROR");
      return;
    }

    itemName = getAvailableName(
      itemName,
      items,
      isCreatingFolder ? "FOLDER" : "FILE",
    );

    if (!itemName) {
      notify(`This ${isFolder ? "folder" : "file"} already exists`);
      return;
    }

    const folderId =
      selectedItem?.type === "FOLDER" ? selectedItem.data.id : null;

    const previous = structuredClone(items);

    const newItem = isFolder
      ? {name: itemName}
      : {name: itemName, folderId: folderId};

    if (isFolder) {
      setFolders((prev) => [...prev, newItem]);
    } else {
      setFiles((prev) => [...prev, newItem]);
    }

    const res = await ApiFetch(
      path,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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

  function onOpen(item, type) {
    setSelectedItem({
      data: item,
      type: type,
    });

    if (type === "FOLDER") {
      const index = sortedFolders.findIndex((folder) => folder.id === item.id);

      if (index !== -1) {
        setOpenFolders((prev) =>
          prev.includes(index) ? prev : [...prev, index],
        );
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
        {page.showExplorerToolBar && (
          <ExplorerToolBar
            isCreatingItem={isCreatingItem}
            setIsCreatingItem={setIsCreatingItem}
            isCreatingFolder={isCreatingFolder}
            setIsCreatingFolder={setIsCreatingFolder}
            inputRef={inputRef}
            handleCreateItem={handleCreateItem}
            selectedItem={selectedItem}
            deleteItem={deleteItem}
            updateItemPinStatus={updateItemPinStatus}
            emptyRecycleBin={emptyRecycleBin}
            page={page}
          />
        )}

        {page.showSearch && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleSearchFilter={toggleSearchFilter}
            setToggleSearchFilter={setToggleSearchFilter}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            page={page}
          />
        )}

        <div
          onContextMenu={(e) => {
            /*if file is clicked instead of panel stop the handler */
            if (e.target !== e.currentTarget) return;

            setSelectedItem(null);
            setIsCreatingItem(false);

            e.preventDefault();
            handleContextMenu(e, null, "PANEL");
          }}
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
            page.showFolders &&
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
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  editingId={editingId}
                  renameFile={renameFile}
                  toName={toName}
                  setToName={setToName}
                  isCreatingItem={isCreatingItem}
                  setIsCreatingItem={setIsCreatingItem}
                  isCreatingFolder={isCreatingFolder}
                  inputRef={inputRef}
                  handleCreateItem={handleCreateItem}
                  page={page}
                />
              );
            })}

          {displayedFiles.map((file) => {
            return (
              <FileItem
                key={file.id}
                file={file}
                selectedItem={selectedItem}
                selectFile={selectFile}
                updateItemPinStatus={updateItemPinStatus}
                handleContextMenu={handleContextMenu}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editingId={editingId}
                renameFile={renameFile}
                toName={toName}
                setToName={setToName}
                page={page}
              />
            );
          })}
        </div>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            file={contextMenu.item}
     type={contextMenu.type}
     contextMenu={contextMenu}
            onDelete={deleteItem}
            onRecover={recoverFiles}
            onOpen={onOpen}
            onRename={renameFile}
            updatePinStatus={updateItemPinStatus}
            setSelectedItem={setSelectedItem}
            setContextMenu={setContextMenu}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setEditingId={setEditingId}
            editingID={editingId}
            setIsCreatingFolder={setIsCreatingFolder}
            setIsCreatingItem={setIsCreatingItem}
            copy={copy}
            setCopy={setCopy}
            pasteItem={pasteItem}
            page={page}
          />
        )}

        {isCreatingItem && selectedItem?.type !== "FOLDER" && (
          <NewItem
            isCreatingItem={isCreatingItem}
            setIsCreatingItem={setIsCreatingItem}
            isCreatingFolder={isCreatingFolder}
            inputRef={inputRef}
            handleCreateItem={handleCreateItem}
            page={page}
          />
        )}
      </div>
    </>
  );
}
