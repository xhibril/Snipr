import styles from "../dashboard/file-explorer/FileExplorer.module.css";
import { FiPlus } from "react-icons/fi";
import { useEffect, useRef } from "react";

export default function NewItem({
          creationType,
          setCreationType,
  createItem,
  page,
  inputRef,
}) {
  const formRef = useRef(null);

  useEffect(() => {
    if (creationType) {
      inputRef.current?.focus();
    }
  }, [creationType]);

  useEffect(() => {
    if (!creationType) return;

    const closeField = (e) => {
      // let submission continue if click is inside the form
      if (formRef.current?.contains(e.target)) return;

      setCreationType(null);
    };

    document.addEventListener("mousedown", closeField);

    return () => {
      document.removeEventListener("mousedown", closeField);
    };
  }, [creationType]);

  if (!creationType || !page.itemActions.includes("create")) {
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

        createItem(value);

        inputRef.current.value = "";
        
        setCreationType(null);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        className={styles.addFileField}
        ref={inputRef}
        placeholder={creationType === "FOLDER" ? "Folder name" : "File name"}
      />

      <button type="submit">
        <FiPlus className={styles.addBtn} />
      </button>
    </form>
  );
}
