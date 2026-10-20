import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Dashboard.module.css";

import ApiFetch from "../../components/utils/Api.jsx";
import FileExplorer from "../../components/dashboard/file-explorer/FileExplorer.jsx";
import FileEditor from "../../components/dashboard/file-editor/FileEditor.jsx";
import Sidebar from "../../components/dashboard/sidebar/Sidebar.jsx";

export default function Dashboard({ notify }) {
  const [isViewingFile, setIsViewingFile] = useState(false);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const nav = useNavigate();

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

  const [activePage, setActivePage] = useState("REGULAR");

  const endpoint = {
    REGULAR: "",
    SHARED: "?shared=true",
    STARRED: "?starred=true",
    DELETED: "?deleted=true",
  };

  const endpointSuffix = endpoint[activePage];
  const endpointSnippet = `/snippets${endpointSuffix}`;
  const endpointFolders = `/folders${endpointSuffix}`;

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [activePage]);

  async function fetchFolders() {
    const res = await ApiFetch(endpointFolders, { method: "GET" }, notify, nav);

    if (!res) return;

    if (!res.ok) {
      notify("Could not fetch folders, please try again", "ERROR");
      return;
    }

    const data = await res.json();
    setFolders(data);
  }

  async function fetchFiles() {
    const res = await ApiFetch(endpointSnippet, { method: "GET" }, notify, nav);

    if (!res) return;

    if (!res.ok) {
      notify("Could not fetch snippets, please try again", "ERROR");
      return;
    }

    const data = await res.json();
    setFiles(data);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainContent}>
        <Sidebar setActivePage={setActivePage} />

        <FileExplorer
          folders={folders}
          setFolders={setFolders}
          files={files}
          setFiles={setFiles}
          notify={notify}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setIsViewingFile={setIsViewingFile}
          setDraft={setDraft}
          setOriginal={setOriginal}
          activePage={activePage}
          isCreatingFolder={isCreatingFolder}
          setIsCreatingFolder={setIsCreatingFolder}
          isCreatingItem={isCreatingItem}
          setIsCreatingItem={setIsCreatingItem}
        />

        <FileEditor
          isViewingFile={isViewingFile}
          setIsViewingFile={setIsViewingFile}
          selectedItem={selectedItem}
          draft={draft}
          original={original}
          setDraft={setDraft}
          setOriginal={setOriginal}
          setSelectedItem={setSelectedItem}
          files={files}
          setFiles={setFiles}
          setIsCreatingFolder={setIsCreatingFolder}
          setIsCreatingItem={setIsCreatingItem}
          notify={notify}
        />
      </div>
    </div>
  );
}
