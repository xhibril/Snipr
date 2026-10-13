import styles from "../dashboard/file-explorer/FileExplorer.module.css";
import { FiPlus } from "react-icons/fi";
import { useEffect, useRef } from "react";

export default function NewItem({
  isCreatingItem,
  setIsCreatingItem,
  isCreatingFolder,
  handleCreateItem,
  page,
  inputRef,
}) {
  const formRef = useRef(null);

  useEffect(() => {
    if (isCreatingItem) {
      inputRef.current?.focus();
    }
  }, [isCreatingItem, isCreatingFolder]);

  useEffect(() => {
    if (!isCreatingItem) return;

    const closeField = (e) => {
      // let submission continue if click is inside the form
      if (formRef.current?.contains(e.target)) return;

      setIsCreatingItem(false);
    };

    document.addEventListener("click", closeField);

    return () => {
      document.removeEventListener("click", closeField);
    };
  }, [isCreatingItem, setIsCreatingItem]);

  if (!isCreatingItem || !page.itemActions.includes("create")) {
    return null;
  }

  return (
    <form
      ref={formRef}
      className={styles.addFile}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const value = inputRef.current?.value || "";

        handleCreateItem(value);

 
          inputRef.current.value = "";

        setIsCreatingItem(false);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        className={styles.addFileField}
        ref={inputRef}
        placeholder={isCreatingFolder ? "Folder name" : "File name"}
      />

      <button type="submit">
        <FiPlus className={styles.addBtn} />
      </button>
    </form>
  );
}
