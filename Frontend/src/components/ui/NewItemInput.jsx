import styles from "../dashboard/file-explorer/FileExplorer.module.css";
import { FiPlus } from "react-icons/fi";
import { useEffect, useRef } from "react";
import global from "../../css/Global.module.css";

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
    <div>
   <div className={global.fieldWrapper} style={{ marginTop: "0.5rem" }}>
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
          className={global.field}
          ref={inputRef}
          placeholder={creationType === "FOLDER" ? "Folder name" : "File name"}
        />
      </form>

              <button className={global.fieldBtn} type="submit">
          <FiPlus className={global.fieldBtnIcon} />
        </button>
    </div>
    </div>
  );
}
