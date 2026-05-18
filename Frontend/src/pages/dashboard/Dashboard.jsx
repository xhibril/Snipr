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
 
    const [isViewingFile, setIsViewingFile] = useState(true);
    const [isAddingTag, setIsAddingTag] = useState(true);
    const [toggleSettings, setToggleSettings] = useState(false);
    const [toggleFolder, setToggleFolder] = useState(false);
    const [folders, setFolders] = useState([])
    const [files, setFiles ] = useState([])

    const nav = useNavigate();



    useEffect(()=> {
        fetchFolders();
        fetchFiles();
    },[])


    async function fetchFolders(){
        const res = await ApiFetch("/folders", {method:"GET"},notify, nav)

        if(!res) return;

        if(!res.ok){
            notify("Could not fetch folders, please try again", "ERROR");
            return;
        }

        const data = await res.json();
         console.log("FOLDERS: ", data)
        setFolders(data);
    }

    async function fetchFiles(){
        const res = await ApiFetch("/snippets", {METHOD: "GET"}, notify, nav)

        if(!res) return;

        if(!res.ok){
            notify("Could not fetch snippets, please try again", "ERROR");
            return;
        }

        const data = await res.json();
        console.log("FILES: ", data)
        setFiles(data);
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



            <div className={styles.mainContent}>

                <FileExplorer toggleSettings={toggleSettings} setToggleSettings={setToggleSettings}
                              toggleFolder = {toggleFolder} setToggleFolder={setToggleFolder}
                              folders = {folders} setFolders={setFolders}
                              files = {files} setFiles = {setFiles}/>










                <div className={styles.fileBody}>


                    {isViewingFile ? (

<>
                        <div className={styles.viewingFile}>

                            <div className={styles.fileInfo}>
                                <h1>File title</h1>

                                <div className={styles.tagsWrapper}>

                                    <div className={styles.tagsActionWrapper}>
                                        <div className={styles.tagsAction}>
                                            <h4>Tags</h4>
                                            <FiPlus className={styles.addTag} />

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

                        </div>


<pre className = {styles.fileContent}>
{`
// ============================================
// Authentication Service
// ============================================

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/client.js";

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const createdUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const accessToken = jwt.sign(
            {
                id: createdUser.id,
                email: createdUser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(201).json({
            message: "Account created successfully",
            token: accessToken,
            user: {
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// ============================================
// Middleware
// ============================================

export async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Missing authorization header"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

// ============================================
// Utilities
// ============================================

export function generateRandomId(length = 16) {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    return result;
}

export function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const i = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        parseFloat(
            (bytes / Math.pow(1024, i)).toFixed(2)
        ) +
        " " +
        sizes[i]
    );
}

// ============================================
// TODO
// ============================================

// - implement websocket syncing
// - add collaborative editing
// - optimize search indexing
// - improve caching layer
// - add markdown support
// - create folder permissions
// - implement syntax highlighting
// - improve mobile responsiveness
// - add drag and drop uploads
// - create autosave system
`}
</pre>
</>

                    ) : (
                        <>
                            <div className={styles.defaultMenu}>

                                <h1>SNIPR.</h1>
                                <p>Start</p>


                                <div className={styles.newFile}
                                    onClick={() => setCreatingState("FILE")}>
                                    <RiFileAddLine />   <a>New File</a>
                                </div>

                                <div className={styles.newFolder}

                                    onClick={() => {
                                        setCreatingState("FOLDER")
                                    }

                                    }
                                >
                                    <RiFolderAddLine /><a>New Folder</a>
                                </div>


                            </div>
                        </>
                    )}
                </div>

            </div>
            </div>
    )
}
