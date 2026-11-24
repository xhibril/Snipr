import { useState } from "react";
import styles from "./FileExplorer.module.css";

import { FiX, FiSliders, FiPlus } from "react-icons/fi";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  toggleSearchFilter,
  setToggleSearchFilter,
  filterTags,
  setFilterTags,
}) {
  const [tagInput, setTagInput] = useState(null);

  return (
    <div className={styles.search}>
      <div className={styles.fieldWrapper}>
        <input
          type="text"
          className={styles.field}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FiSliders
          className={styles.btn}
          onClick={() => setToggleSearchFilter(!toggleSearchFilter)}
        />
      </div>

      {toggleSearchFilter && (
        <form
          className={styles.tagInputForm}
          onSubmit={(e) => {
            e.preventDefault();

            const tag = tagInput.trim();
            if (!tag) return;

            setFilterTags([...filterTags, tag]);
            setTagInput("");
          }}
        >
          <div className={styles.fieldWrapper}>
            <input
              type="text"
              className={styles.field}
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />

            <button className={styles.btn} type="submit">
              <FiPlus className={styles.btnIcon} />
            </button>
          </div>
        </form>
      )}

      {filterTags.length > 0 && (
        <div className={styles.selectedTags}>
          <div className={styles.selectedTagsActions}>
            <span
              className={styles.selectedTagsAmount}
            >{`Selected tags (${filterTags.length})`}</span>
            <button
              className={styles.clearTags}
              onClick={() => {
                setFilterTags([]);
                setTagInput("");
              }}
            >
              Clear all
            </button>
          </div>

          {filterTags.map((tag, index) => (
            <div key={index} className={styles.tagItem}>
              <p>{tag}</p>

              <FiX
                className={styles.removeTag}
                onClick={() =>
                  setFilterTags(filterTags.filter((_, i) => i !== index))
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
