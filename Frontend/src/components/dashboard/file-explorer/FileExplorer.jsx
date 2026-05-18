import styles from "./FileExplorer.module.css"

import { FiHome, FiFolder, FiFile, FiX, FiSliders, FiShare2, FiStar, FiTrash2, FiChevronUp, FiChevronDown, FiTrash, FiSearch, FiPlus } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

import { RiFile2Fill, RiFolderFill, RiImageFill, RiFolderAddLine, RiFileAddLine } from "react-icons/ri";

export default function FileExplorer({ toggleSettings, setToggleSettings,
    toggleFolder, setToggleFolder,
    folders, setFolders,
    files, setFiles }) {

    const [isCreatingItem, setIsCreatingItem] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    const [toggleSearchFilter, setToggleSearchFilter] = useState(false);
    const inputRef = useRef(null);


    const [tags, setTags] = useState([])

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

                    <FiTrash className={styles.snippetAction} />
                    <FiStar className={styles.snippetAction} />
                    <FiShare2 className={styles.snippetAction} />

                </div>

                {isCreatingItem && (
                    <form className={styles.addFile}>

                        <input
                            className={styles.addFileField}
                            ref={inputRef}
                            placeholder={
                                isCreatingFolder
                                    ? "Folder name"
                                    : "File name"
                            }
                        />

                        <FiPlus className={styles.addBtn} />

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


                    {folders.map(folder => {

                        <div className={styles.folderItem}>
                            <RiFolderFill className={styles.folderIcon} />
                            <p className={styles.folderName}>{folder.name}</p>


                            {files.filter(file => file.folderId === folder.id)
                                .map(file => {
                                    <div className={styles.fileItem}>
                                        <RiFile2Fill className={styles.fileIcon} />
                                        <p className={styles.fileName}>{file.name}</p>
                                    </div>
                                })
                            }

                            {toggleFolder ? (
                                <FiChevronUp className={styles.toggleFolder} />
                            ) : (
                                <FiChevronDown className={styles.toggleFolder} />
                            )}
                        </div>


                    })}


                                {files.filter(file => file.folderId === null)
                                .map(file => {
                                    <div className={styles.fileItem}>
                                        <RiFile2Fill className={styles.fileIcon} />
                                        <p className={styles.fileName}>{file.name}</p>
                                    </div>
                                })
                            }

                </div>
            </div>
        </>
    )
}