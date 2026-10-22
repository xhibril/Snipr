import ApiFetch from "../../utils/Api.jsx";
import { ValidateInput, ValidateFileName } from "../../utils/Validation.jsx";

export default function useFileExplorerActions({
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
}) {
  function rollBack(isFolder, previous) {
    if (isFolder) {
      setFolders(previous);
    } else {
      setFiles(previous);
    }
  }

  async function updateItemPinStatus(item, type) {
    const isFolder = type === "FOLDER";

    const status = !item.isPinned;

    const path = `/${isFolder ? "folders" : "snippets"}/${item.id}/pin`;
    const previous = isFolder
      ? structuredClone(folders)
      : structuredClone(files);

    // opt update
    if (isFolder) {
      setFolders(
        folders.map((folder) =>
          folder.id === item.id
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
          file.id === item.id
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
    // if no item passed from context menu delete selected item
    if (!item || !type) {
      item = selectedItem?.data;
      type = selectedItem?.type;
    }

    const isFolder = type === "FOLDER";

    const isPermanent = page.deleteMode === "permanent";
    const path = `/${isFolder ? "folders" : "snippets"}/${item.id}${
      isPermanent ? "/permanent" : ""
    }`;

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
      setFolders(previousFolders);
      setFiles(previousFiles);
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

  async function moveSnippet(item) {
    const folderId = item?.folderId;



    const itemsInSameSpace = files.filter((file) => (file?.folderId ?? null) === folderId);


    const nameRes = ValidateFileName(item?.name, itemsInSameSpace, "FILE");

   if (!nameRes) {
      notify("This file already exists", "ERROR");
      return;
    }


    const path = `/snippets/${item.id}`;

    const previousFiles = structuredClone(files);

    // opt update
    setFiles((prev) =>
      prev.map((file) =>
        file.id === item.id ? { ...file, folderId: item.folderId } : file,
      ),
    );

    const res = await ApiFetch(
      path,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: item.folderId }),
      },
      notify,
      nav,
    );

    if (!res) {
      setFiles(previousFiles);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(
        data.message || "Could not move snippet, pleasey try again",
        "ERROR",
      );
      setFiles(previousFiles);
      return;
    }
  }

  async function renameFile(item, type, toName) {

    // same name
    if(item?.name === toName){
      return;
    }

    const isFolder = type === "FOLDER";
    const path = `${isFolder ? "/folders" : "/snippets"}/${item.id}/rename`;
    let filesInSameSpace;

    // files
    if (!isFolder) {
      const folderId = !isFolder ? (item?.folderId ?? null) : null;
      filesInSameSpace = files.filter(
        (file) => (file?.folderId ?? null) === folderId,
      );
    } else {
      filesInSameSpace = [...folders];
    }

    const nameRes = ValidateFileName(toName, filesInSameSpace, type);

    if (!nameRes) {
      notify(`This ${isFolder ? "folder" : "file"} already exists`, "ERROR");
      return;
    }

    const previous = isFolder
      ? structuredClone(folders)
      : structuredClone(files);

    // opt update
    if (isFolder) {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === item.id ? { ...folder, name: nameRes } : folder,
        ),
      );
    } else {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === item.id ? { ...file, name: nameRes } : file,
        ),
      );
    }

    const res = await ApiFetch(
      path,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameRes }),
      },
      notify,
      nav,
    );

    if (!res) {
      rollBack(isFolder, previous);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(
        data.message ||
          `Could not change name of ${isFolder ? "folder" : "file"}`,
        "ERROR",
      );
      rollBack(isFolder, previous);
      return;
    }
    setToName(null);
    setEditingId(null);
  }

  async function emptyRecycleBin() {
    const path = "/bin";

    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    // opt update
    setFolders([]);
    setFiles([]);

    const res = await ApiFetch(
      path,
      {
        method: "DELETE",
      },
      notify,
      nav,
    );

    if (!res) {
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(data.message || "Could not empty recycle bin", "ERROR");
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }
  }

  async function pasteItem(item, type, folderId) {
    const isFolder = type === "FOLDER" ? true : false;

    const path = `${isFolder ? "/folders" : "/snippets"}/${item.id}/copy`;

    let itemsInSameSpace;

    if(!isFolder){
      itemsInSameSpace = files.filter((file) => (file?.folderId ?? null) === folderId);

    } else {
      itemsInSameSpace = [...folders]
    }

    const placeholderId = crypto.randomUUID();

    let counter = 2;
    let itemName = `${item.name} - Copy`;

    while (itemsInSameSpace.some((existing) => existing.name === itemName)) {
      itemName = `${item.name} - Copy (${counter})`;
      counter++;
    }
    const previousFolders = structuredClone(folders);
    const previousFiles = structuredClone(files);

    // opt update
    if (isFolder) {
      const optimisticFolder = {
        id: placeholderId,
        name: itemName,
      };

      setFolders((prev) => [...prev, optimisticFolder]);

      // check if folder has files inside
      const filesToPaste = files.filter((file) => file.folderId === item.id);

      const finalizedFilesToPaste = filesToPaste.map((file) => ({
        ...file,
        id: crypto.randomUUID(),
        folderId: placeholderId,
      }));

      setFiles((prev) => [...prev, ...finalizedFilesToPaste]);
    } else {
      const optimisticFile = {
        folderId: placeholderId,
        name: itemName,
        id: placeholderId,
      };

      setFiles((prev) => [...prev, optimisticFile]);
    }

    const res = await ApiFetch(
      path,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, folderId: folderId }),
      },
      notify,
      nav,
    );

    if (!res) {
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      setFolders(previousFolders);
      setFiles(previousFiles);
      notify(data.message || `Could not copy ${isFolder ? "folder" : "file"}`);
      return;
    }

    // replace files
    if (isFolder) {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === placeholderId ? data.folder : folder,
        ),
      );

      setFiles((prev) => [
        ...prev.filter((file) => file.folderId !== placeholderId),
        ...data.snippets.map((snippet) => ({
          ...snippet,
          folderId: data.folder.id,
        })),
      ]);
    } else {
      setFiles((prev) =>
        prev.map((file) => (file.id === placeholderId ? data : file)),
      );
    }
  }

  async function createItem(itemName) {
    const inputRes = ValidateInput(itemName, "GENERAL");

    if (inputRes !== "VALID") {
      notify(`Invalid ${isFolder ? "folder" : "file"} name`, "ERROR");
      return;
    }
    

    const isFolder = isCreatingFolder;

    let filesInSameSpace;

    const folderId =
      selectedItem?.type === "FOLDER" ? selectedItem?.data.id : null;

    // files
    if (!isFolder) {
      filesInSameSpace = files.filter(
        (file) => (file?.folderId ?? null) === folderId,
      );

      // folders
    } else {
      filesInSameSpace = [...folders];
    }

    const nameRes = ValidateFileName(itemName, filesInSameSpace, isFolder ? "FOLDER" : "FILE");

       if (!nameRes) {
      notify(`This ${isFolder ? "folder" : "file"} already exists`);
      return;
    }


    const items = isFolder ? folders : files;
    const path = isCreatingFolder ? "/folders" : "/snippets";

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

  return {
    updateItemPinStatus,
    deleteItem,
    recoverFiles,
    moveSnippet,
    renameFile,
    emptyRecycleBin,
    pasteItem,
    createItem,
  };
}
