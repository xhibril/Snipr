import styles from "../file-editor/FileEditor.module.css";
import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";

export default function DefaultMenu({setIsCreatingItem, setIsCreatingFolder}) {
  return (
    <div className={styles.defaultMenu}>
      <h1>SNIPR.</h1>
      <p>Start</p>

      <div
        className={styles.newFile}
        onClick={() => {
          setIsCreatingItem((prev) =>
            prev?.type === "FILE" ? false : { type: "FILE" },
          );
          setIsCreatingFolder(false);
        }}
      >
        <RiFileAddLine /> <a>New File</a>
      </div>

      <div
        className={styles.newFolder}
        onClick={() => {
          setIsCreatingItem((prev) =>
            prev?.type === "FOLDER" ? false : { type: "FOLDER" },
          );
          setIsCreatingFolder(true);
        }}
      >
        <RiFolderAddLine />
        <a>New Folder</a>
      </div>
    </div>
  );
}
