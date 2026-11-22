import styles from "./FileExplorer.module.css";

import { FiX, FiSliders, FiSearch, FiPlus } from "react-icons/fi";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  toggleSearchFilter,
  setToggleSearchFilter,
  filterTags,
  setFilterTags,
}) {
  return (
    <div className={styles.search}>
      <div className={styles.querySearch}>
        <input
          type="text"
          className={styles.queryField}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FiSliders
          className={styles.toggleFilter}
          onClick={() => setToggleSearchFilter(!toggleSearchFilter)}
        />
      </div>

      {toggleSearchFilter && (
        <div className={styles.filterSearch}>
          <input
            type="text"
            className={styles.filterField}
            placeholder="Add tags"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                const tag = e.target.value.trim();

                if (!tag) return;

                setFilterTags([...filterTags, tag]);
                e.target.value = "";
              }
            }}
          />

          <FiPlus className={styles.addTag} />
        </div>
      )}
      <div className={styles.filter}>
        {filterTags.map((tag, index) => (
          <div key={index} className={styles.tag}>
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
    </div>
  );
}
