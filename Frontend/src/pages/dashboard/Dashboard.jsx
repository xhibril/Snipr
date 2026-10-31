import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Dashboard.module.css";

import ApiFetch from "../../components/utils/Api.jsx";
import FileExplorer from "../../components/dashboard/file-explorer/FileExplorer.jsx";
import FileEditor from "../../components/dashboard/file-editor/FileEditor.jsx";
import Sidebar from "../../components/dashboard/sidebar/Sidebar.jsx";
import DefaultMenu from "../../components/dashboard/default-menu/DefaultMenu.jsx";

export default function Dashboard({ notify, auth, setAuth }) {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openFileId, setOpenFileId] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const nav = useNavigate();
  const openFile = files.find((file) => file.id === openFileId);

  const [activePage, setActivePage] = useState("ALL");

  const endpoint = {
    ALL: "?view=ALL",
    SHARED: "?view=SHARED",
    PINNED: "?view=PINNED",
    DELETED: "?view=DELETED",
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
        <Sidebar setActivePage={setActivePage} auth = {auth} notify = {notify}
        setAuth={setAuth} />

        <FileExplorer
          folders={folders}
          setFolders={setFolders}
          files={files}
          openFile = {openFile}
          setFiles={setFiles}
          notify={notify}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          openFileId = {openFileId}
          setOpenFileId = {setOpenFileId}
          activePage={activePage}
          isCreatingFolder={isCreatingFolder}
          setIsCreatingFolder={setIsCreatingFolder}
          isCreatingItem={isCreatingItem}
          setIsCreatingItem={setIsCreatingItem}
        />


        {openFile ? 
        <FileEditor notify={notify} file = {openFile} setFiles={setFiles}/>  :
        <DefaultMenu setIsCreatingFolder={setIsCreatingFolder} 
        setIsCreatingItem={setIsCreatingItem}/>}
      </div>
    </div>
  );
}
