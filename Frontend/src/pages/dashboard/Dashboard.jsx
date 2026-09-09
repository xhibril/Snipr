import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Dashboard.module.css";

import ApiFetch from "../../components/utils/Api.jsx";
import FileExplorer from "../../components/dashboard/file-explorer/FileExplorer.jsx";
import FileEditor from "../../components/dashboard/file-editor/FileEditor.jsx";
import Sidebar from "../../components/dashboard/sidebar/Sidebar.jsx";

export default function Dashboard({ notify }) {
  const [isViewingFile, setIsViewingFile] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [toggleSettings, setToggleSettings] = useState(false);
  const [toggleFolder, setToggleFolder] = useState(false);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const nav = useNavigate();

  const [creatingState, setCreatingState] = useState({
    type: null,
    tick: 0,
  });

  const [draft, setDraft] = useState({
    title: "",
    body: "",
    tags: [],
  });

  const [original, setOriginal] = useState({
    title: "",
    body: "",
    tags: [],
  });

  const [unsavedChanges, setUnsavedChanges] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (
      draft.body !== selectedItem?.data.body ||
      draft.title !== selectedItem?.data.title ||
      selectedItem?.data.tags != draft.tags
    ) {
      setUnsavedChanges("Unsaved Changes");
    } else {
      setUnsavedChanges("");
    }
  }, [draft.body, draft.title, draft.tags]);

  useEffect(() => {
    if (selectedItem?.type !== "FILE") return;
    setIsViewingFile(true);
    syncDraft();
  }, [selectedItem]);

  async function fetchFolders() {
    const res = await ApiFetch("/folders", { method: "GET" }, notify, nav);

    if (!res) return;

    if (!res.ok) {
      notify("Could not fetch folders, please try again", "ERROR");
      return;
    }

    const data = await res.json();
    setFolders(data);
  }

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const res = await ApiFetch("/snippets", { method: "GET" }, notify, nav);

    if (!res) return;

    if (!res.ok) {
      notify("Could not fetch snippets, please try again", "ERROR");
      return;
    }

    const data = await res.json();
    setFiles(data);
  }

  async function updateSnippet(snippet) {
    const previousSnippet = structuredClone(selectedItem?.data);
    const previousFiles = structuredClone(files);
    setUnsavedChanges("Saving...");

    // opt update
    setFiles(files.map((file) => (file.id === snippet.id ? snippet : file)));

    const res = await ApiFetch("/snippets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: snippet.id,
        name: snippet.name,
        body: snippet.body,
        title: snippet.title,
        isPinned: snippet.isPinned,
        tags: snippet.tags,
        folderId: snippet.folderId,
      }),
    });

    if (!res) return;
    const data = await res.json();

    if (!res.ok) {
      notify(data.message || "Could not update snippet", "ERROR");
      setFiles(previousFiles);
      syncSelected(previousSnippet);
      return;
    }

    syncSelected();
    syncDraft();
  }

  function syncDraft() {
    const { title, body, tags } = selectedItem.data;
    const data = { title, body, tags };

    setOriginal(data);
    setDraft(data);
  }

  function syncSelected(data) {
    setSelectedItem((prev) => ({
      ...prev,
      data,
    }));
  }

  return (
    <div className={styles.mainContainer}>
      <div
        className={styles.mainContent}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "s" && unsavedChanges) {
            e.preventDefault();

            const snippet = {
              ...selectedItem?.data,
              ...draft
            };
            updateSnippet(snippet);
          }
        }}
      >
        <Sidebar
          toggleSettings={toggleSettings}
          setToggleSettings={setToggleSettings}
        />

        <FileExplorer
          toggleSettings={toggleSettings}
          setToggleSettings={setToggleSettings}
          toggleFolder={toggleFolder}
          setToggleFolder={setToggleFolder}
          folders={folders}
          setFolders={setFolders}
          files={files}
          setFiles={setFiles}
          notify={notify}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
          creatingState={creatingState}
          setCreatingState={setCreatingState}
          original={original}
          setOriginal={setOriginal}
          draft={draft}
          setDraft={setDraft}
          updateSnippet={updateSnippet}
          setIsViewingFile={setIsViewingFile}
        />

        <FileEditor
          setIsViewingFile={setIsViewingFile}
          isViewingFile={isViewingFile}
          original={original}
          setOriginal={setOriginal}
          draft={draft}
          setDraft={setDraft}
          isAddingTag={isAddingTag}
          setIsAddingTag={setIsAddingTag}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
          setUnsavedChanges={setUnsavedChanges}
          unsavedChanges={unsavedChanges}
          setNewTag={setNewTag}
          newTag={newTag}
          updateSnippet={updateSnippet}
        />
      </div>
    </div>
  );
}
