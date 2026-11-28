import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import global from "../../css/Global.module.css";
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
    <div className={global.tagsContainer}>
      <form
        className={global.tagForm}
        onSubmit={(e) => {
          e.preventDefault();

          addTag();
        }}
      >
        <div className={global.fieldWrapper}>
          <input
            type="text"
            className={global.field}
            placeholder="Add tag"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />

          <button className={global.fieldBtn} type="submit">
            <FiPlus className={global.fieldBtnIcon} />
          </button>
        </div>
      </form>

      <div className={global.tags}>
        {tags?.map((tag, index) => (
          <div className={global.tagItem} key={index}>
            <span>{tag}</span>

            <FiX
              className={global.removeTag}
              onClick={() => removeTag(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
