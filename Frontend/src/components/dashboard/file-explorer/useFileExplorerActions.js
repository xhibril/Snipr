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
  function getItemConfig(type) {
    const isFolder = type === "FOLDER";
    const collection = isFolder ? folders : files;
    const setCollection = isFolder ? setFolders : setFiles;
    const basePath = isFolder ? "/folders" : "/snippets";

    return { isFolder, collection, setCollection, basePath };
  }

  function rollBack(isFolder, previous) {
    if (isFolder) {
      setFolders(previous);
    } else {
      setFiles(previous);
    }
  }

  async function updateItemPinStatus(item, type) {
    const { isFolder, basePath, collection, setCollection } =
      getItemConfig(type);

    const status = !item.isPinned;

    const path = `${basePath}/${item.id}/pin`;

    const previous = collection;

    // opt update
    setCollection((prev) =>
      prev.map((currentItem) =>
        currentItem.id === item.id
          ? {
              ...currentItem,
              isPinned: status,
            }
          : current,
      ),
    );

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

  async function deleteAndRecoverHelper(
    item,
    type,
    method,
    suffix,
    failureMessage,
  ) {
    const { isFolder, basePath } = getItemConfig(type);
    const path = `${basePath}/${item.id}${suffix}`;

    const previousFolders = folders;
    const previousFiles = files;

    // opt update
    if (isFolder) {
      setFolders((prev) => prev.filter((folder) => folder.id !== item.id));
      setFiles((prev) => prev.filter((file) => file.folderId !== item.id));
    } else {
      setFiles((prev) => prev.filter((file) => file.id !== item.id));
    }

    const res = await ApiFetch(path, { method: method }, notify, nav);

    if (!res) {
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      notify(data.message || failureMessage, "ERROR");
      setFolders(previousFolders);
      setFiles(previousFiles);
      return;
    }

    if (selectedItem?.data.id === item.id) {
      setSelectedItem(null);
      setIsViewingFile(false);
    }
  }

  async function deleteItem(item, type) {
    // if no item passed from context menu delete selected item
    if (!item || !type) {
      item = selectedItem?.data;
      type = selectedItem?.type;
    }

    const suffix = page.deleteMode === "permanent" ? "/permanent" : "";
    const isFolder = type === "FOLDER";

    deleteAndRecoverHelper(
      item,
      type,
      "DELETE",
      suffix,
      `Could not delete ${isFolder ? "folder" : "file"}, please try again`,
    );
  }

  async function recoverFiles(item, type) {
    const isFolder = type === "FOLDER";

    deleteAndRecoverHelper(
      item,
      type,
      "PATCH",
      "/recover",
      `Could not recover ${isFolder ? "folder" : "file"}, please try again`,
    );
  }

  async function moveSnippet(item) {
    const folderId = item?.folderId;

    // get files in same space

    const itemsInSameSpace = files.filter(
      (file) => (file?.folderId ?? null) === folderId,
    );

    const nameRes = ValidateFileName(item?.name, itemsInSameSpace, "FILE");

    if (!nameRes) {
      notify("This file already exists", "ERROR");
      return;
    }

    const path = `/snippets/${item.id}`;
    const previousFiles = files;

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

  async function renameItem(item, type, toName) {
    // same name
    if (item?.name === toName) {
      return;
    }

    const { isFolder, basePath, collection, setCollection } =
      getItemConfig(type);

    if (toName.length > 255) {
      notify(
        `${isCreatingFolder ? "Folder" : "File"} cannot be more than 255 characters`,
      );
      return;
    }

    const path = `${basePath}/${item.id}/rename`;

    let filesInSameSpace;

    // get files in same space
    if (!isFolder) {
      const folderId = !isFolder ? (item?.folderId ?? null) : null;
      filesInSameSpace = files.filter(
        (file) => (file?.folderId ?? null) === folderId,
      );
    } else {
      // folders
      filesInSameSpace = [...folders];
    }

    const finalName = ValidateFileName(toName, filesInSameSpace, type);

    if (!finalName) {
      notify(`This ${isFolder ? "folder" : "file"} already exists`, "ERROR");
      return;
    }

    const previous = collection;

    // opt update
    setCollection((prev) =>
      prev.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, name: finalName }
          : currentItem,
      ),
    );

    // update file name if its a selected item
if (!isFolder && selectedItem?.data?.id === item.id) {
  setSelectedItem((prev) => ({
    ...prev,
    data: {
      ...prev.data,
      name: finalName,
    },
  }));
}
    const res = await ApiFetch(
      path,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalName }),
      },
      notify,
      nav,
    );

    if (!res?.ok) {
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

    const previousFolders = folders;
    const previousFiles = files;

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
    const { isFolder, basePath } = getItemConfig(type);

    const path = `${basePath}/${item.id}/copy`;

    let itemsInSameSpace;

    // get files in same space
    if (!isFolder) {
      itemsInSameSpace = files.filter(
        (file) => (file?.folderId ?? null) === folderId,
      );
    } else {
      itemsInSameSpace = [...folders];
    }

    const placeholderId = crypto.randomUUID();

    let counter = 2;
    let itemName = `${item.name} - Copy`;

    while (itemsInSameSpace.some((existing) => existing.name === itemName)) {
      itemName = `${item.name} - Copy (${counter})`;
      counter++;
    }
    const previousFolders = folders;
    const previousFiles = files;

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
        folderId: folderId,
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
    const type = isCreatingFolder ? "FOLDER" : "FILE";

    const { isFolder, basePath, collection, setCollection } =
      getItemConfig(type);

    if (itemName.length > 255) {
      notify(
        `${isCreatingFolder ? "Folder" : "File"} cannot be more than 255 characters`,
      );
      return;
    }

    let filesInSameSpace;

    const folderId =
      selectedItem?.type === "FOLDER" ? selectedItem?.data.id : null;

    // get files in same space
    if (!isFolder) {
      filesInSameSpace = files.filter(
        (file) => (file?.folderId ?? null) === folderId,
      );
    } else {
      filesInSameSpace = [...folders];
    }

    const finalName = ValidateFileName(itemName, filesInSameSpace, type);

    if (!finalName) {
      notify(`This ${isFolder ? "folder" : "file"} already exists`);
      return;
    }

    const previous = collection;

    const newItem = isFolder
      ? { name: finalName }
      : { name: finalName, folderId: folderId };

    setCollection((prev) => [...prev, newItem]);

    const res = await ApiFetch(
      basePath,
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

    setCollection((prev) =>
      prev.map((currentItem) => (currentItem === newItem ? data : currentItem)),
    );
  }

  return {
    updateItemPinStatus,
    deleteItem,
    recoverFiles,
    moveSnippet,
    renameItem,
    emptyRecycleBin,
    pasteItem,
    createItem,
  };
}
