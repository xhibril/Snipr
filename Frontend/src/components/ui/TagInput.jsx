import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import styles from "../../components/dashboard/file-explorer/FileExplorer.module.css";

export default function TagInput({
  tags,
  maxTags,
  onChange,
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const tag = input.trim();

    if (!tag) return;

    if (maxTags && tags.length >= maxTags) return;

    onChange((prev) =>
      Array.isArray(prev)
        ? [...prev, tag]
        : { ...prev, tags: [...prev.tags, tag] },
    );

    setInput("");
  }

  function removeTag(index) {
    onChange((prev) =>
      Array.isArray(prev)
        ? prev.filter((_, i) => i !== index)
        : { ...prev, tags: prev.tags.filter((_, i) => i !== index) },
    );
  }

  return (
    <div className={styles.tagsContainer}>
      <form
        className={styles.tagForm}
        onSubmit={(e) => {
          e.preventDefault();

          addTag();
        }}
      >
        <div className={styles.fieldWrapper}>
          <input
            type="text"
            className={styles.tagField}
            placeholder="Add tag"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />

          <button className={styles.btn} type="submit">
            <FiPlus className={styles.btnIcon} />
          </button>
        </div>
      </form>

      <div className={styles.tags}>
        {tags?.map((tag, index) => (
          <div className={styles.tagItem} key={index}>
            <p>{tag}</p>

            <FiX
              className={styles.removeTag}
              onClick={() => removeTag(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
