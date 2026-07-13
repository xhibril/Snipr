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


    const [unsavedChanges, setUnsavedChanges] = useState("")

    const [draftTags, setDraftTags] = useState([])
    const [newTag, setNewTag] = useState("")
    const [previousSnippet, setPreviousSnippet] = useState([])



    const [tagAmount, setTagAmount] = useState("")



  useEffect(() => {
    if (draftBody !== originalBody || draftTitle !== originalTitle 
    || selectedItem?.data.tags != draftTags
    ) {
        setUnsavedChanges("Unsaved Changes");
    } else {
        setUnsavedChanges("");
    }
}, [draftBody, draftTitle, originalBody, originalTitle, draftTags]);

    useEffect(() => {
        fetchFolders();
        fetchFiles();
    }, [])


    useEffect(() => {

console.log(selectedItem?.data.tags)


        selectedItem?.type === "FILE" ? setIsViewingFile(true) : "";

        if (selectedItem?.type === "FILE") {
            setOriginalTitle(selectedItem.data.title || "");
            setOriginalBody(selectedItem.data.body || "");
            setDraftTags(selectedItem.data.tags || [])
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
        setFiles(data);
    }

    async function updateSnippet(snippet) {

        const previousSnippet = structuredClone(selectedItem?.data);
const previousFiles = structuredClone(files);
        setUnsavedChanges("Saving...")

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

        console.log("BACKEND RESPONSE:", data);

        if (!res.ok) {
            notify(data.message || "Could not update snippet", "ERROR");
            setFiles(previousFiles);
            setSelectedItem({
                type:"FILE",
                data: previousSnippet
            })

            setPreviousSnippet([])
            return;
        }


                    setSelectedItem({
                                                        ...selectedItem,
                                                        data: data
                                
                                                    })


                
            setDraftBody(snippet.body || "")
            setDraftTitle(snippet.title || "")

            setOriginalBody(snippet.body || "")
            setOriginalTitle(snippet.title || "")

    
            setDraftTags(snippet.tags || [])

    }









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



            <div className={styles.mainContent}
            
            
            onKeyDown={(e) => {
                if(e.ctrlKey && e.key === "s" && unsavedChanges){
                    e.preventDefault();

                    const snippet = {
                        ...selectedItem?.data,
                        body: draftBody,
                        title: draftTitle
                    }
                    updateSnippet( snippet);
                }
            }}>

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

                                <div className = {styles.tagCounter}>
                                    <p>{draftTags?.length ?? 0}</p>
                                    <p>/5</p>



                                </div>

                                    <div className={styles.tagsActionWrapper}>
                                        <div className={styles.tagsAction}>
                                            <h4>Tags</h4>
                                            <FiPlus className={styles.addTag} onClick={() => setIsAddingTag(!isAddingTag)} />

                                        </div>

                                        {isAddingTag &&

                                            <form className={styles.addTagFieldWrapper}
                                             onSubmit={(e) => {
                                                    e.preventDefault()


                                        

                                                    const snippet = {
                                                        ...selectedItem?.data,
                                                        tags: [ ...(selectedItem.data.tags ?? []), newTag]

                                                    }



                                                    updateSnippet(snippet)
                                                    setNewTag("")


                                                }




                                                }>
                                                <input type="text" className={styles.addTagField} placeholder="Add tag" 
                                                onChange={(e) => setNewTag(e.target.value)}
                                                       value={newTag}
                                                
                                            />
                                                <FiPlus className={styles.finalizeAddingTag} />
                                            </form>
                                        }
                                    </div>


                                    <div className={styles.tags}>
                                       {draftTags.map((tag, index) => (
                                    

                                    <>
                                            <p key = {index}>{tag}</p>
                                            <FiX onClick={(e) => {

                                                const newTags = draftTags.filter((_, i) => i !== index)




                                                const snippet = {
                                                    ...selectedItem.data,
                                                    tags: (newTags ?? [])
                                                }

                                                updateSnippet(snippet)
                                            }}/>
                                            </>
                                            

                                       ))
                                       }

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

                            <p className={styles.saveStatus}>{unsavedChanges}</p>
                            <button className={styles.saveBtn} onClick={() => {
                                updateSnippet();





                            }}>Save</button>
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}
