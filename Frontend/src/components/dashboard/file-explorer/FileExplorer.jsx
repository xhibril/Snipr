import styles from "./FileExplorer.module.css"

import { FiHome, FiFolder, FiFile, FiX, FiSliders, FiShare2, FiStar, FiTrash2, FiChevronUp, FiChevronDown, FiTrash, FiSearch, FiPlus } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

import { RiFile2Fill, RiFolderFill, RiImageFill, RiFolderAddLine, RiFileAddLine, RiPushpinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ApiFetch from "../../utils/Api.jsx";

export default function FileExplorer({ toggleSettings, setToggleSettings,
    toggleFolder, setToggleFolder,
    folders, setFolders,
    files, setFiles, notify }) {

    const [isCreatingItem, setIsCreatingItem] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    const [toggleSearchFilter, setToggleSearchFilter] = useState(false);
    const inputRef = useRef(null);
    const [foldersToggled, setFoldersToggle] = useState([])

    const [prevExplorerState, setPrevExplorerState] = useState([])

    const [tags, setTags] = useState([])

    const [snippetDesc, setSnippetDesc] = useState("")
    const [snippetCode, setSnippetCode] = useState("")
    const [snippetTags, setSnippetTags] = useState([])


    const [selectedItem, setSelectedItem] = useState(null)
    const [allItems, setAllItems] = useState({})



    const [sortedFolders, setSortedFolders] = useState([])
    const [sortedFiles, setSortedFiles] = useState([])


    const nav = useNavigate();



    function setCreatingState(type) {

        if (type === "FOLDER") {
            if (isCreatingFolder && isCreatingItem) {

                setIsCreatingFolder(false);
                setIsCreatingItem(false);
            } else {
                setIsCreatingFolder(true);
                setIsCreatingItem(true);
            }
        } else {

            if (!isCreatingFolder && isCreatingItem) {

                setIsCreatingFolder(false);
                setIsCreatingItem(false);
            } else {
                setIsCreatingFolder(false);
                setIsCreatingItem(true);
            }

        }
    }


    useEffect(() => {
        if (isCreatingItem) {
            inputRef.current.focus();
        }
    }, [isCreatingItem, isCreatingFolder]);


    async function addFile() {



    }


    async function handleCreateItem(path, itemName) {
        let methods = {};
        let newFolder;
        let newFile;
        let folderId = null;

        if(selectedItem?.type === "FOLDER" && selectedItem?.data.id !== null){
            folderId = selectedItem.data.id;
        }

        if (isCreatingFolder) {
            setPrevExplorerState(folders)

            newFolder = { name: itemName }

            setFolders([...folders, newFolder])

            methods = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: itemName })
            }

        } else {
            setPrevExplorerState(files)

            newFile = {
                name: itemName,
                folderId: null
            }

            setFiles([...files, newFile])

            methods = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: itemName, title: snippetDesc, body: snippetCode, tags: snippetTags, folderId: folderId})
            }

        }
        const res = await ApiFetch(path, methods, notify, nav)

        if (!res) return;

        const data = await res.json();

        if (!res.ok) {
            notify(data.message || isCreatingFolder ? "Something went wrong while creating folder" :
                "Something went wrong while creating file", "ERROR")

            isCreatingFolder ? setFolders(prevExplorerState) : setFiles(prevExplorerState)
            return;
        }

        if (isCreatingFolder) {



            setFolders(prev =>
                prev.map(folder => (
                    folder === newFolder ? data : folder
                ))
            )


        } else {

            setFiles(prev =>
                prev.map(file => (
                    file === newFile ? data : file
                ))
            )
        }
    }


    // compare two folders at a time
    // pinned = 1 gets placed before unpinned = 0
    useEffect(() => {
        const finalizedFolders = [...folders].sort((a, b) => b.isPinned - a.isPinned);
        setSortedFolders(finalizedFolders);
        console.log("FINALIZED FOLDERS: " + finalizedFolders);

    }, [folders])

    useEffect(() => {
        const finalizedFiles = [...files].sort((a, b) => b.isPinned - a.isPinned)
        setSortedFiles(finalizedFiles);
        console.log("FINALIZED FILES: " + finalizedFiles);
    }, [files])




    async function updateItemPinStatus(selectedItem) {

        let status = false;
        selectedItem.data.isPinned === true ? status = false : status = true;

        let path;

        if (selectedItem.type === "FOLDER") {
            path = "/folders/" + selectedItem.data.id + "/pin"
        } else {
            path = "/snippets/" + selectedItem.data.id + "/pin"
        }

        const res = await ApiFetch(path, { method: "PATCH" }, notify, nav)

        if (!res) return;

        const data = await res.json();

        if (!res.ok) {
            notify(data.message || "Could not pin, please try again", "ERROR")
            return;
        }

        if (selectedItem.type === "FOLDER") {
            setFolders(
                folders.map(
                    folder => folder.id === selectedItem.data.id ?
                        {
                            ...folder,
                            isPinned: status
                        } : folder
                )
            )
        } else {
            setFiles(
                files.map(
                    file => file.id === selectedItem.data.id ? {
                        ...file,
                        isPinned: status
                    } : file
                )
            )
        }
    }


    async function deleteItem(){
        let path;

        if (selectedItem.type === "FOLDER") {
            path = "/folders/" + selectedItem.data.id;
        } else {
            path = "/snippets/" + selectedItem.data.id;
        }


        const res = await ApiFetch(path, {method: "DELETE"}, notify, nav);

        if(!res) return;

        const data = await res.json();

        if(!res.ok){
            notify(data.message || "Could not delete, please try again", "ERROR");
            return;
        }


        notify(data.message, "SUCCESS");
        
        if(selectedItem.type === "FOLDER"){
            setFolders(
                folders.filter(folder => folder.id !== selectedItem.data.id)
            )
        } else {
            setFiles(
                files.filter(file => file.id !== selectedItem.data.id)
            )
        }
    }



    return (
        <>
            <div className={styles.fileExplorer}>

                <h4 className={styles.fileExplorerTitle}>
                    My snippets
                </h4>

                <div className={styles.snippetControls}>

                    <RiFolderAddLine
                        className={styles.snippetAction}
                        onClick={() => {
                            setCreatingState("FOLDER")
                        }}
                    />

                    <RiFileAddLine
                        className={styles.snippetAction}
                        onClick={() => setCreatingState("FILE")}
                    />

                    <FiTrash className={styles.snippetAction} 
                    onClick={() => deleteItem()}/>
                    <FiStar className={styles.snippetAction}


                        onClick={() => updateItemPinStatus(selectedItem)}





                    />
                    <FiShare2 className={styles.snippetAction} />

                </div>

                {isCreatingItem && (
                    <form className={styles.addFile}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateItem(isCreatingFolder ? "/folders" : "/snippets", inputRef.current.value)
                            inputRef.current.value = ""
                        }}>

                        <input
                            className={styles.addFileField}
                            ref={inputRef}
                            placeholder={
                                isCreatingFolder
                                    ? "Folder name"
                                    : "File name"
                            }
                        />

                        <button type="submit">
                            <FiPlus className={styles.addBtn} />
                        </button>

                    </form>
                )}

                <div className={styles.searchContainer}>

                    <div className={styles.search}>

                        <input
                            type="text"
                            className={styles.searchField}
                            placeholder="Search"
                        />

                        <FiSearch className={styles.searchIcon} />

                        <FiSliders
                            className={styles.searchFilter}
                            onClick={() =>
                                setToggleSearchFilter(!toggleSearchFilter)
                            }
                        />

                    </div>

                    <div
                        className={`${styles.filter} ${toggleSearchFilter ? styles.show : ""
                            }`}
                    >

                        <div className={styles.filterFieldWrapper}>

                            <input
                                type="text"
                                className={styles.filterField}
                                placeholder="Add tags"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()

                                        setTags([
                                            ...tags,
                                            e.target.value
                                        ])

                                        e.target.value = ""
                                    }
                                }}
                            />

                            <FiPlus className={styles.addBtn} />

                        </div>

                        <div className={styles.filterContainer}>

                            {tags.map((tag, index) => (
                                <div
                                    key={index}
                                    className={styles.tag}
                                >
                                    <p>{tag}</p>

                                    <FiX
                                        className={styles.removeTag}
                                        onClick={() =>
                                            setTags(
                                                tags.filter(
                                                    (_, i) => i !== index
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ))}

                        </div>

                    </div>

                </div>





                <div className={styles.snippetFiles}>

                    {sortedFolders.map((folder, index) => (

                        <div className={styles.folderItem}>


                            <div className={`${styles.folderHeader} ${selectedItem?.type === "FOLDER" && 
                                                                      selectedItem?.data?.id === folder?.id ? styles.selected : ""}`}

                                onClick={() => {


                                    setSelectedItem({
                                        type: "FOLDER",
                                        data: folder
                                    })



                                    if (foldersToggled.includes(index)) {
                                        setFoldersToggle(
                                            foldersToggled.filter(folder => folder !== index)
                                        )
                                    } else {
                                        setFoldersToggle([...foldersToggled, index])

                                    }
                                }
                                }>

                                <RiFolderFill className={styles.folderIcon} />

                                {folder.isPinned && <RiPushpinFill 

                                onClick={() => {

                                      const item = {
                                    type: "FOLDER",
                                    data:folder
                                }

    
                                updateItemPinStatus(item)

                                }}

                              
                                
                                
                                />}

                                <p className={styles.folderName}>{folder.name}</p>
                                {foldersToggled.includes(index) ? (
                                    <FiChevronUp className={styles.toggleFolder} />
                                ) : (
                                    <FiChevronDown className={styles.toggleFolder} />
                                )}
                            </div>



                            <div className={`${styles.folderFiles} ${foldersToggled.includes(index) ? styles.show : ""}`}>

                                {/*add files belonging to folders */}
                                {sortedFiles.filter(file => file.folderId === folder.id)
                                    .map(file => (
                                        <div className={styles.fileItem}>
                                           <div className={`${styles.fileHeader} ${selectedItem?.type === "FILE" && 
                                                                                  selectedItem?.data?.id === file?.id ? styles.selected : ""}`}

                                                onClick={() => {
                                                    setSelectedItem({
                                                        type: "FILE",
                                                        data: file
                                                    })

                                                }}

                                            >
                                                <RiFile2Fill className={styles.fileIcon} />
                                                {file.isPinned && <RiPushpinFill 

                                                onClick={() => {
                                                    const item = {
                                                        type: "FILE",
                                                        data: file
                                                    }

                                                    updateItemPinStatus(item)
                                                }}
                                                />}
                                                <p className={styles.fileName}>{file.name}</p>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}


                    {sortedFiles.filter(file => file.folderId === null)
                        .map(file => (
                            <div className={styles.fileItem}>
                                <div className={`${styles.fileHeader} ${selectedItem?.type === "FILE" && selectedItem?.data?.id === file?.id ? styles.selected : ""}`}

                                    onClick={() => {
                                        setSelectedItem({
                                            type: "FILE",
                                            data: file
                                        })

                                    }}



                                >
                                    <RiFile2Fill className={styles.fileIcon} />
                                    {file.isPinned && <RiPushpinFill 
                                                onClick={() => {
                                                    const item = {
                                                        type: "FILE",
                                                        data: file
                                                    }
                                                    updateItemPinStatus(item)
                                                }}/>}
                                    <p className={styles.fileName}>{file.name}</p>
                                </div>

                            </div>
                        ))
                    }

                </div>
            </div>
        </>
    )
}