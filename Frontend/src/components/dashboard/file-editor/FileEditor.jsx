import styles from "../../../pages/dashboard/Dashboard.module.css"


import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { FiX } from "react-icons/fi";




export default function FileEditor({isViewingFile, setIsViewingFile, selectedItem, setSelectedItem,
  draftTitle, setDraftTitle, draftTags, setDraftTags, draftBody, setDraftBody, isAddingTag, setIsAddingTag,
  setUnsavedChanges, unsavedChanges, newTag, setNewTag, updateSnippet
}){



    return (

        <>
       
        <div className={styles.fileBody}>
          {isViewingFile ? (
            <>
              <div className={styles.fileInfo}>
                <input
                  type="text"
                  className={styles.fileTitle}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />

                <div className={styles.tagsWrapper}>
                  <div className={styles.tagCounter}>
                    <p>{draftTags?.length ?? 0}</p>
                    <p>/5</p>
                  </div>

                  <div className={styles.tagsActionWrapper}>
                    <div className={styles.tagsAction}>
                      <h4>Tags</h4>
                      <FiPlus
                        className={styles.addTag}
                        onClick={() => setIsAddingTag(!isAddingTag)}
                      />
                    </div>

                    {isAddingTag && (
                      <form
                        className={styles.addTagFieldWrapper}
                        onSubmit={(e) => {
                          e.preventDefault();

                          const snippet = {
                            ...selectedItem?.data,
                            tags: [...(selectedItem.data.tags ?? []), newTag],
                          };

                          updateSnippet(snippet);
                          setNewTag("");
                        }}
                      >
                        <input
                          type="text"
                          className={styles.addTagField}
                          placeholder="Add tag"
                          onChange={(e) => setNewTag(e.target.value)}
                          value={newTag}
                        />
                        <FiPlus className={styles.finalizeAddingTag} />
                      </form>
                    )}
                  </div>

                  <div className={styles.tags}>
                    {draftTags.map((tag, index) => (
                      <>
                        <p key={index}>{tag}</p>
                        <FiX
                          onClick={(e) => {
                            const newTags = draftTags.filter(
                              (_, i) => i !== index,
                            );

                            const snippet = {
                              ...selectedItem.data,
                              tags: newTags ?? [],
                            };

                            updateSnippet(snippet);
                          }}
                        />
                      </>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                className={styles.fileContent}
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
              >
                {selectedItem?.data?.body}
              </textarea>
            </>
          ) : (
            <>
              <div className={styles.defaultMenu}>
                <h1>SNIPR.</h1>
                <p>Start</p>

                <div
                  className={styles.newFile}
                  onClick={() => {
                    setCreatingState({
                      type: "FILE",
                      tick: Date.now(),
                    });
                  }}
                >
                  <RiFileAddLine /> <a>New File</a>
                </div>

                <div
                  className={styles.newFolder}
                  onClick={() => {
                    setCreatingState({
                      type: "FOLDER",
                      tick: Date.now(),
                    });
                  }}
                >
                  <RiFolderAddLine />
                  <a>New Folder</a>
                </div>
              </div>
            </>
          )}

          {isViewingFile && unsavedChanges && (
            <div className={styles.saveContainer}>
              <p className={styles.saveStatus}>{unsavedChanges}</p>
              <button
                className={styles.saveBtn}
                onClick={() => {
                  updateSnippet();
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>     
        </>
    )









}