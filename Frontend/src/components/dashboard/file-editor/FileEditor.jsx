import styles from "../../../pages/dashboard/Dashboard.module.css";

import { RiFileAddLine, RiFolderAddLine } from "react-icons/ri";
import { FiPlus, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import ApiFetch from "../../utils/Api";
import { ValidateInput } from "../../utils/Validation";
import { DEFAULT_FAILURE_MESSAGE } from "../../ui/SmallComponents";

export default function FileEditor({
  setFiles,
  file,
  notify,
}) {

  const [newTag, setNewTag] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [draft, setDraft] = useState({
    title: file.title || "",
    body: file.body || "",
    tags: file.tags || [],
  });

  const [original, setOriginal] = useState({
    title: file.title || "",
    body: file.body || "",
    tags: file.tags || [],
  });

  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  const latest = useRef({ dirty, draft, file });
  latest.current = { dirty, draft, file };

  //  save when changing snippets
  useEffect(
    () => () => {
      if (latest.current.dirty) {
      updateSnippet({
        ...latest.current.file,
        ...latest.current.draft
      });
      }},
    [],
  );

  // auto save
  useEffect(() => {
    if (!dirty) return;

    const timer = setTimeout(() => {
      const snippet = {
        ...file,
        ...draft,
      };
      updateSnippet(snippet);
    }, 5000);

    return () => clearTimeout(timer);
  }, [draft, file]);

  async function updateSnippet(snippet) {
    if (isLoading) return;
    const previousSnippet = file;
    const previousOriginal = original;

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
    setFiles((prev) =>
      prev.map((file) => (file.id === snippet.id ? snippet : file)),
    );

    const { title, body, tags } = snippet;

    const optOriginal = {
      title: title,
      body: body,
      tags: tags,
    };

    setOriginal(optOriginal);

    try {
      setIsLoading(true);

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

      if (!res) {
        rollbackSave(previousSnippet, previousOriginal);
        return;
      }
      const data = await res.json();

      if (!res.ok) {
        notify(data.message || "Could not update snippet", "ERROR");
        rollbackSave(previousSnippet, previousOriginal);
        return;
      }
    } catch (err) {
      notify(DEFAULT_FAILURE_MESSAGE, "ERROR");
    } finally {
      setIsLoading(false);
    }
  }

  function rollbackSave(previousSnippet, previousOriginal) {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === previousSnippet.id ? previousSnippet : file,
      ),
    );
    setOriginal(previousOriginal);
  }

  return (
    <>
      <div
        className={styles.fileBody}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === "s") {
            e.preventDefault();

            if (dirty) {
              const snippet = {
                ...file,
                ...draft,
              };
              updateSnippet(snippet);
            }
          }
        }}>

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
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}>
              {draft.body}
            </textarea>


        {dirty && (
          <div className={styles.saveContainer}>
            <p className={styles.saveStatus}>Unsaved changes</p>
            <button
              className={styles.saveBtn}
              onClick={() => {
                const snippet = {
                  ...file,
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
