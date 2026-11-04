import styles from "../file-editor/FileEditor.module.css";
import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";

export default function DefaultMenu({setCreationType}) {
  return (
    <div className={styles.defaultMenu}>
      <h1>SNIPR.</h1>
      <p>Start</p>

      <div
        className={styles.newFile}
        onClick={() => {
             setCreationType((prev) => prev === "FILE" ? null : "FILE");
        }}
      >
        <RiFileAddLine /> <a>New File</a>
      </div>

      <div
        className={styles.newFolder}
        onClick={() => {
            setCreationType((prev) => prev === "FOLDER" ? null : "FOLDER");
        }}
      >
        <RiFolderAddLine />
        <a>New Folder</a>
      </div>
    </div>
  );
}
