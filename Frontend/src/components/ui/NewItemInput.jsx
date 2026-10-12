
import styles from "../dashboard/file-explorer/FileExplorer.module.css"
import { FiPlus } from "react-icons/fi";
import { useEffect } from "react";

export default function NewItem({
    isCreatingItem,
    setIsCreatingItem,
    isCreatingFolder,

    page,
    inputRef

}){



      // focus on field
      useEffect(() => {
        if (isCreatingItem) {
    
         inputRef.current.focus();
        }
      }, [isCreatingItem, isCreatingFolder]);


      useEffect(() => {
        const closeField = () => {    
            setIsCreatingItem(false)
        }

        document.addEventListener("click" , closeField)


        return () => {
            document.removeEventListener("click", closeField)
        }
     }, [isCreatingItem, isCreatingFolder]);





    return (

     <>
          {isCreatingItem && page.itemActions.includes("create") && (
        <form
          className={styles.addFile}
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateItem(inputRef.current.value || "");
            inputRef.current.value = "";
            setIsCreatingItem(false);
          }}
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
      )}
      </>
    )




}