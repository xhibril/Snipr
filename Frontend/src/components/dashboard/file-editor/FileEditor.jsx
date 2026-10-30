import styles from "../../../pages/dashboard/Dashboard.module.css";

import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import { FiPlus, FiX } from "react-icons/fi";
import { useState, useEffect, useImperativeHandle } from "react";
import ApiFetch from "../../utils/Api";
import { useRef } from "react";
import { ValidateInput } from "../../utils/Validation";

export default function FileEditor({
  isViewingFile,
  setIsViewingFile,
  selectedItem,
  setSelectedItem,
  draft,
  original,
  setDraft,
  setOriginal,
  setFiles,
  files,
  setIsCreatingItem,
  setIsCreatingFolder,
  notify,
  editorRef,
  unsavedChanges,
  setUnsavedChanges,
}) {
  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const selectedIdRef = useRef(selectedItem?.data?.id);

  useImperativeHandle(editorRef, () => ({
    updateSnippet,
  }));

  // auto save
  useEffect(() => {
    if (!selectedItem?.data || !isViewingFile) return;

    const hasChanges =
      draft.body !== original.body ||
      draft.title !== original.title ||
      JSON.stringify(draft.tags ?? []) !== JSON.stringify(original.tags ?? []);

    if (!hasChanges) return;

    const timer = setTimeout(() => {
      const snippet = {
        ...selectedItem?.data,
        ...draft,
      };
      updateSnippet(snippet);
    }, 5000);

    return () => clearTimeout(timer);
  }, [draft, original, selectedItem?.data?.id, 
    selectedItem?.data?.name, isViewingFile]);

  // unsaved changes
  useEffect(() => {
    if (
      draft.body !== original.body ||
      draft.title !== original.title ||
      JSON.stringify(original.tags ?? []) 
      !== JSON.stringify(draft.tags ?? []) // compare by content n order
    ) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [draft, original]);

  useEffect(() => {
    if (selectedItem?.type !== "FILE") return;
    setIsViewingFile(true);
  }, [selectedItem]);

  useEffect(() => {
    selectedIdRef.current = selectedItem?.data?.id;
  }, [selectedItem]);

  async function updateSnippet(snippet) {
    const previousSnippet = structuredClone(selectedItem?.data);

    if (snippet.title.length > 120) {
      notify("File title cannot be more than 120 characters", "ERROR");
      return;
    }

    if (snippet.body.length > 100_000) {
      notify("File body limit exceeded", "ERROR");
      return;
    }

    for (const tag of snippet.tags ?? []) {
      const tagRes = ValidateInput(tag, "TAG");

      if (tagRes !== "VALID") {
        notify(`${tag} is not a valid tag`, "ERROR");
        return;
      }
    }

    // opt update
    setFiles(files.map((file) => (file.id === snippet.id ? snippet : file)));

    const res = await ApiFetch("/snippets", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: snippet.id,
        name: snippet.name,
        body: snippet.body,
        title: snippet.title,
        isPinned: snippet.isPinned,
        tags: snippet.tags,
        folderId: snippet.folderId,
      }),
    });

    if (!res) return;
    const data = await res.json();

    if (!res.ok) {
      notify(data.message || "Could not update snippet", "ERROR");
      syncSelected(previousSnippet);
      syncDraft();
      return;
    }

    if (selectedIdRef.current === snippet.id) {
      syncSelected(data);
      syncDraft(data);
    }
  }

  function syncDraft(data) {
    if (!data) return;

    const {title, body, tags } = data;

    const newData = {
      title: title || "",
      body: body || "",
      tags: tags || [],
    };

    setOriginal(newData);
    setDraft(newData);
  }

  function syncSelected(data) {
    setSelectedItem((prev) => ({
      ...prev,
      data,
    }));
  }

  return (
    <>
      <div
        className={styles.fileBody}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "s") {
            e.preventDefault();

            if (unsavedChanges) {
              const snippet = {
                ...selectedItem?.data,
                ...draft
              };
              updateSnippet(snippet);
            }
          }
        }}
      >
        {isViewingFile ? (
          <>
            <div className={styles.fileInfo}>
              <input
                type="text"
                className={styles.fileTitle}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />

              <div className={styles.tagsWrapper}>
                <div className={styles.tagCounter}>
                  <p>{draft.tags?.length ?? 0}</p>
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

                        setDraft({
                          ...draft,
                          title: draft.title,
                          body: draft.body,
                          tags: [...(draft.tags ?? []), newTag],
                        });

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
                  {draft.tags.map((tag, index) => (
                    <>
                      <p key={index}>{tag}</p>
                      <FiX
                        // remove tag
                        onClick={() => {
                          const newTags = draft.tags.filter(
                            (_, i) => i !== index,
                          );

                          setDraft({
                            ...draft,
                            tags: newTags ?? [],
                          });
                        }}
                      />
                    </>
                  ))}
                </div>
              </div>
            </div>

            <textarea
              className={styles.fileContent}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            >
              {draft.body}
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
          </>
        )}

        {isViewingFile && unsavedChanges && (
          <div className={styles.saveContainer}>
            <p className={styles.saveStatus}>
              {unsavedChanges ? "Unsaved changes" : ""}
            </p>
            <button
              className={styles.saveBtn}
              onClick={() => {
                const snippet = {
                  ...selectedItem?.data,
                  ...draft,
                };
                updateSnippet(snippet);
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </>
  );
}
