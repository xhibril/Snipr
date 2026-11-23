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

  function addTag() {
    setFilterTags([...filterTags, tagInput]);
    setTagInput("");
  }

  return (
    <div className={styles.search}>
      <div className={styles.querySearch}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.queryField}
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <FiSliders
            className={styles.toggleTagFilter}
            onClick={() => setToggleSearchFilter(!toggleSearchFilter)}
          />
        </div>
      </div>

      {toggleSearchFilter && (
        <form
          className={styles.tagInputForm}
          onSubmit={(e) => {
            e.preventDefault();
            addTag();
          }}
        >
          <div className={styles.inputWrapper}>
            <input
              type="text"
              className={styles.tagField}
              placeholder="Add tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />

            <FiPlus className={styles.addTag} onClick={addTag} />
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
