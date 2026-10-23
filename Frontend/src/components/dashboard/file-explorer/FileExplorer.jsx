import styles from "./FileExplorer.module.css";
import SearchFiles from "../../utils/Search.jsx";
import ExplorerToolBar from "./ExplorerToolBar";
import SearchBar from "./SearchBar";
import FolderItem from "./FolderItem.jsx";
import FileItem from "./FileItem.jsx";
import ContextMenu from "./ContextMenu.jsx";
import { PAGE_CONFIG } from "../../../config/pageConfig.jsx";
import NewItem from "../../ui/NewItemInput.jsx";
import useFileExplorerActions from "./useFileExplorerActions";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function FileExplorer({
  folders,
  setFolders,
  files,
  setFiles,
  notify,
  selectedItem,
  setSelectedItem,
  setIsViewingFile,
  setDraft,
  draft,
  setOriginal,
  activePage,
  setIsCreatingItem,
  isCreatingItem,
  setIsCreatingFolder,
  isCreatingFolder,
  unsavedChanges,
  editorRef,
}) {
  const [toggleSearchFilter, setToggleSearchFilter] = useState(false);
  const [filterTags, setFilterTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openFolders, setOpenFolders] = useState([]);
  const [copy, setCopy] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toName, setToName] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const inputRef = useRef(null);

  const nav = useNavigate();
  const page = PAGE_CONFIG[activePage] ?? PAGE_CONFIG.REGULAR;

  // compare two folders/files at a time
  // pinned = 1 gets placed before unpinned = 0
  const sortedFolders = useMemo(
    () => [...folders].sort((a, b) => b.isPinned - a.isPinned),
    [folders],
  );

  const sortedFiles = useMemo(
    () =>
      [...files]
        .sort((a, b) => b.isPinned - a.isPinned)
        .filter(
          (file) =>
            file.folderId === null ||
            !folders.some((folder) => folder.id === file.folderId),
        ),
    [files, folders],
  );

  const isSearching = searchQuery.trim() !== "" || filterTags.length > 0;
  const displayedFiles = isSearching ? searchResults : sortedFiles;

  const {
    updateItemPinStatus,
    deleteItem,
    recoverFiles,
    moveSnippet,
    renameItem,
    emptyRecycleBin,
    pasteItem,
    createItem,
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
    isCreatingFolder,
  });

  useEffect(() => {
    setSelectedItem(null);
    setOpenFolders([]);
    setIsViewingFile(false);
  }, [activePage]);

  // close context menu
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

  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems();
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchQuery, filterTags]);

  async function searchItems() {
    const result = SearchFiles(sortedFiles, searchQuery, filterTags);
    setSearchResults(result);
  }


  function selectItem(item, type) {

    if (selectedItem?.type === "FILE" && unsavedChanges) {
      const snippet = {
        ...selectedItem?.data,
        ...draft,
      };

      editorRef.current?.updateSnippet(snippet);
    }

    if (type == "FILE") {
      const data = {
        title: item.title || "",
        body: item.body || "",
        tags: item.tags || [],
      };

      setDraft(data);
      setOriginal(data);
    }

    setSelectedItem({
      type: type,
      data: item,
    });
  }

  function onOpen(item, type) {
    setSelectedItem({
      data: item,
      type: type,
    });

    if (type === "FOLDER") {
      const index = sortedFolders.findIndex((folder) => folder.id === item.id);

      // open folder if found
      if (index !== -1) {
        setOpenFolders((prev) =>
          prev.includes(index) ? prev : [...prev, index],
        );
      }
    }

    setContextMenu(null);
  }

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
            createItem={createItem}
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
                  selectItem={selectItem}
                  updateItemPinStatus={updateItemPinStatus}
                  moveSnippet={moveSnippet}
                  handleContextMenu={handleContextMenu}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  editingId={editingId}
                  renameItem={renameItem}
                  toName={toName}
                  setToName={setToName}
                  isCreatingItem={isCreatingItem}
                  setIsCreatingItem={setIsCreatingItem}
                  isCreatingFolder={isCreatingFolder}
                  inputRef={inputRef}
                  createItem={createItem}
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
                selectItem={selectItem}
                updateItemPinStatus={updateItemPinStatus}
                handleContextMenu={handleContextMenu}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editingId={editingId}
                renameItem={renameItem}
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
            onRename={renameItem}
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
            createItem={createItem}
            page={page}
          />
        )}
      </div>
    </>
  );
}
