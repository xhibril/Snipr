import ApiFetch from "../../utils/Api.jsx";

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
  getAvailableName,
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
    console.log(item);

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

  async function renameFile(item, type, toName) {
    const isFolder = type === "FOLDER";
    const path = `${isFolder ? "/folders" : "/snippets"}/${item.id}/rename`;
    const finalizedName = getAvailableName(
      toName,
      isFolder ? folders : files,
      type,
    );

    const previous = isFolder
      ? structuredClone(folders)
      : structuredClone(files);

    // opt update
    if (isFolder) {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === item.id ? { ...folder, name: finalizedName } : folder,
        ),
      );
    } else {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === item.id ? { ...file, name: finalizedName } : file,
        ),
      );
    }

    const res = await ApiFetch(
      path,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: finalizedName }),
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

    const items = isFolder ? folders : files;

    const placeholderId = crypto.randomUUID();

    let counter = 2;
    let itemName = `${item.name} copy`;

    while (items.some((existing) => existing.name === itemName)) {
      itemName = `${item.name} copy (${counter})`;
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
      notify(data.message || `Could not copy${isFolder ? "folder" : "file"}`);
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
      console.log(data);
      setFiles((prev) =>
        prev.map((file) => (file.id === placeholderId ? data : file)),
      );
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
};
}
