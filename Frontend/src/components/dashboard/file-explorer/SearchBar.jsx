import styles from "./FileExplorer.module.css";

import {
  FiX,
  FiSliders,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  toggleSearchFilter,
  setToggleSearchFilter,
  filterTags,
  setFilterTags,
  page
}) {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.search}>
        <input
          type="text"
          className={styles.searchField}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <FiSearch className={styles.searchIcon} />

        <FiSliders
          className={styles.searchFilter}
          onClick={() => setToggleSearchFilter(!toggleSearchFilter)}
        />
      </div>

      <div
        className={`${styles.filter} ${
          toggleSearchFilter ? styles.show : ""
        }`}
      >
        <div className={styles.filterFieldWrapper}>
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

          <FiPlus className={styles.addBtn} />
        </div>

        <div className={styles.filterContainer}>
          {filterTags.map((tag, index) => (
            <div key={index} className={styles.tag}>
              <p>{tag}</p>

              <FiX
                className={styles.removeTag}
                onClick={() =>
                  setFilterTags(
                    filterTags.filter((_, i) => i !== index)
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}