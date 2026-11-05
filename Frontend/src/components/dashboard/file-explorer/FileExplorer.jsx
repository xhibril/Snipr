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
  activePage,
  openFile,
  creationType,
  setCreationType,
  setOpenFileId
}) {
  const [toggleSearchFilter, setToggleSearchFilter] = useState(false);
  const [filterTags, setFilterTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openFolders, setOpenFolders] = useState([]);
  const [copy, setCopy] = useState([]);
  const [editingTarget, setEditingTarget] = useState(null);
  const [pendingName, setPendingName] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const inputRef = useRef(null);


  const nav = useNavigate();
  const page = PAGE_CONFIG[activePage] ?? PAGE_CONFIG.ALL;

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

  const displayedFiles = useMemo(() => {

    if(!isSearching){
      return sortedFiles;
    }

    const filesToSearch = files.filter((file) => file.isDeleted === false);

    return SearchFiles(filesToSearch, searchQuery, filterTags);

  }, [files ,sortedFiles, isSearching, searchQuery, filterTags])

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
    setOpenFileId,
    setPendingName,
    setEditingTarget,
    creationType,
    openFile
  });

  useEffect(() => {
    setSelectedItem(null);
    setOpenFolders([]);
    setOpenFileId(null)
  }, [activePage]);

  // close context menu
  useEffect(() => {
    const closeMenu = () => {
      setEditingTarget(null);
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
    setCreationType(null);
    setEditingTarget(null);

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item: file,
      type: type,
    });
  }



  function selectItem(item, type) {
    setSelectedItem({type: type, data: item})
    if(type === "FILE"){
      setOpenFileId(item.id)
    }
  }

  function onOpen(item, type) {
    selectItem(item, type)

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
          creationType = {creationType}
          setCreationType = {setCreationType}
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
            setCreationType(null);

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
            }, file?.folderId, null);
            
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
                 
                  editingTarget = {editingTarget}
                  setEditingTarget = {setEditingTarget}
                  renameItem={renameItem}
                  pendingName={pendingName}
                  setPendingName={setPendingName}
                            creationType = {creationType}
          setCreationType = {setCreationType}
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
                editingTarget={editingTarget}
                setEditingTarget={setEditingTarget}
                renameItem={renameItem}
                pendingName={pendingName}
                setPendingName={setPendingName}
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
            editingTarget={editingTarget}
            setEditingTarget={setEditingTarget}
          setCreationType = {setCreationType}
            copy={copy}
            setCopy={setCopy}
            pasteItem={pasteItem}
            page={page}
            setPendingName = {setPendingName}
          />
        )}

        {creationType && selectedItem?.type !== "FOLDER" && (
          <NewItem
                                    creationType = {creationType}
          setCreationType = {setCreationType}
            inputRef={inputRef}
            createItem={createItem}
            page={page}
          />
        )}
      </div>
    </>
  );
}
