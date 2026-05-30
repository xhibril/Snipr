import styles from "./Dashboard.module.css";
import { BrandHeader } from "../../components/ui/SmallComponents";
import logo from "../../assets/images/logo.svg";

import ApiFetch from "../../components/utils/Api.jsx";

import FileExplorer from "../../components/dashboard/file-explorer/FileExplorer.jsx";

import { FiHome, FiFolder, FiFile, FiX, FiSliders, FiShare2, FiStar, FiTrash2, FiChevronUp, FiChevronDown, FiTrash, FiSearch, FiPlus } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

import { RiFile2Fill, RiFolderFill, RiImageFill, RiFolderAddLine, RiFileAddLine } from "react-icons/ri";
import { isCookie, useNavigate } from "react-router-dom";

export default function Dashboard({ notify }) {

    const [isViewingFile, setIsViewingFile] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [toggleSettings, setToggleSettings] = useState(false);
    const [toggleFolder, setToggleFolder] = useState(false);
    const [folders, setFolders] = useState([])
    const [files, setFiles] = useState([])
    const [selectedItem, setSelectedItem] = useState(null)

    const [creatingState, setCreatingState] = useState({
        type: null,
        tick: 0
    });


    const [originalTitle, setOriginalTitle] = useState("")
    const [originalBody, setOriginalBody] = useState("")


    const nav = useNavigate();


    const [draftTitle, setDraftTitle] = useState("")
    const [draftBody, setDraftBody] = useState("")


    const [unsavedChanges, setUnsavedChanges] = useState(false)

useEffect(() => {


    if (draftBody !== originalBody || draftTitle !== originalTitle) {
        setUnsavedChanges(true);
    } else {
        setUnsavedChanges(false);
    }
}, [draftBody, draftTitle, originalBody, originalTitle]);


    useEffect(() => {
        fetchFolders();
        fetchFiles();
    }, [])


    useEffect(() => {
        selectedItem?.type === "FILE" ? setIsViewingFile(true) : setIsViewingFile(null);

        if (selectedItem?.type === "FILE") {
            setOriginalTitle(selectedItem.data.title);
            setOriginalBody(selectedItem.data.body);
        }
    }, [selectedItem])


    async function fetchFolders() {
        const res = await ApiFetch("/folders", { method: "GET" }, notify, nav)

        if (!res) return;

        if (!res.ok) {
            notify("Could not fetch folders, please try again", "ERROR");
            return;
        }

        const data = await res.json();
        console.log("FOLDERS: ", data)
        setFolders(data);
    }

    async function fetchFiles() {
        const res = await ApiFetch("/snippets", { method: "GET" }, notify, nav)

        if (!res) return;

        if (!res.ok) {
            notify("Could not fetch snippets, please try again", "ERROR");
            return;
        }

        const data = await res.json();
        console.log("FILES: ", data)
        setFiles(data);
    }

    async function updateSnippet(snippet) {

        const previousFiles = files;

        // opt update

        setFiles(
            files.map(file => file.id === snippet.id ? snippet : file
            )
        )

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
                folderId: snippet.folderId
            })
        })

        if (!res) return;

        const data = await res.json();

        if (!res.ok) {
            notify(data.message || "Could not update snippet", "ERROR");
            setFiles(previousFiles);
            return;
        }


        console.log("updated snippet")
    }


    useEffect(() => {
    console.log("draftBody changed:", draftBody);
}, [draftBody]);







    return (
        <div className={styles.mainContainer}>

            <div className={styles.sideBar}>

                <div className={styles.brandHeader}>

                    <img src={logo} />
                    <h1>SNIPR</h1>

                </div>

                <div className={styles.options}>

                    <button className={styles.optionRow}>
                        <FiFolder className={styles.optionIcon} />
                        <p className={styles.optionText}>My Files</p>
                    </button>

                    <button className={styles.optionRow}>
                        <FiShare2 className={styles.optionIcon} />
                        <p className={styles.optionText}>Shared Files</p>
                    </button>


                    <button className={styles.optionRow}>
                        <FiStar className={styles.optionIcon} />
                        <p className={styles.optionText}>Starred</p>
                    </button>

                    <button className={styles.optionRow}>
                        <FiTrash className={styles.optionIcon} />
                        <p className={styles.optionText}>Trash</p>
                    </button>

                </div>



                <div className={styles.accountContainer}>

                    <div className={`${styles.accountSettings} ${toggleSettings ? styles.show : " "}`}>
                        <button> Change Password</button>
                        <button> Change Email</button>
                        <button> Delete Account</button>
                    </div>


                    <div className={styles.accountRow}>

                        <div className={styles.accountDetails}>
                            <p className={styles.accountName}>Account name</p>
                            <p className={styles.accountEmail}>email@gmail.com</p>
                        </div>


                        <div className={styles.accountArrowIcons}
                            onClick={() => setToggleSettings(!(toggleSettings))}>
                            <FiChevronUp />
                            <FiChevronDown />
                        </div>
                    </div>
                </div>
            </div>



            <div className={styles.mainContent}>

                <FileExplorer toggleSettings={toggleSettings} setToggleSettings={setToggleSettings}
                    toggleFolder={toggleFolder} setToggleFolder={setToggleFolder}
                    folders={folders} setFolders={setFolders}
                    files={files} setFiles={setFiles}
                    notify={notify} setSelectedItem={setSelectedItem} selectedItem={selectedItem}

                    creatingState={creatingState} setCreatingState={setCreatingState}
                    setDraftTitle={setDraftTitle} draftTitle={draftTitle}
                    setDraftBody={setDraftBody} draftBody={draftBody}
                    setOriginalBody={setOriginalBody} originalBody={originalBody}
                    setOriginalTitle={setOriginalTitle} originalTitle={originalTitle} updateSnippet={updateSnippet} />










                <div className={styles.fileBody}>


                    {isViewingFile ? (

                        <>


                            <div className={styles.fileInfo}>


                                <input type="text" className={styles.fileTitle} value={draftTitle}
                                    onChange={(e) => setDraftTitle(e.target.value)} />


                                <div className={styles.tagsWrapper}>

                                    <div className={styles.tagsActionWrapper}>
                                        <div className={styles.tagsAction}>
                                            <h4>Tags</h4>
                                            <FiPlus className={styles.addTag} onClick={() => setIsAddingTag(!isAddingTag)} />

                                        </div>

                                        {isAddingTag &&

                                            <div className={styles.addTagFieldWrapper}>
                                                <input type="text" className={styles.addTagField} placeholder="Add tag" />
                                                <FiPlus className={styles.finalizeAddingTag} />
                                            </div>
                                        }
                                    </div>


                                    <div className={styles.tags}>
                                        <p>Python</p>
                                        <p>Java</p>
                                        <p>C++</p>
                                        <p>C</p>
                                        <p>SQL</p>

                                    </div>
                                </div>
                            </div>



                            <textarea className={styles.fileContent} value={draftBody} onChange={(e) => setDraftBody(e.target.value)}>
                                {selectedItem?.data?.body}
                            </textarea>
                        </>

                    ) : (
                        <>
                            <div className={styles.defaultMenu}>

                                <h1>SNIPR.</h1>
                                <p>Start</p>


                                <div className={styles.newFile}
                                    onClick={() => {
                                        setCreatingState({
                                            type: "FILE",
                                            tick: Date.now()
                                        });

                                    }
                                    }>
                                    <RiFileAddLine />   <a>New File</a>
                                </div>

                                <div className={styles.newFolder}

                                    onClick={() => {
                                        setCreatingState({
                                            type: "FOLDER",
                                            tick: Date.now()
                                        });

                                    }

                                    }
                                >
                                    <RiFolderAddLine /><a>New Folder</a>
                                </div>


                            </div>
                        </>
                    )}


{isViewingFile && unsavedChanges &&
                     <div className={styles.saveContainer}>

                    <p className={styles.saveStatus}> {unsavedChanges ? "Unsaved changes" : ""}</p>
                    <button className={styles.saveBtn}  onClick= {() => {

const snippet = {
    id: selectedItem.data.id,
                name: selectedItem.data.name,
                body: draftBody,
                title: draftTitle,
                isPinned: selectedItem.data.isPinned,
                tags: selectedItem.data.tags,
                folderId: selectedItem.data.folderId
}


updateSnippet(snippet);





                    }}>Save</button>
                </div>
                }

                </div>
            </div>
        </div>
    )
}
