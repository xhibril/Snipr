import styles from "./FileExplorer.module.css";
import TagInput from "../../ui/TagInput";
import global from "../../../css/Global.module.css";

import {FiSliders} from "react-icons/fi";

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
      <div className={global.fieldWrapper}>
        <input
          type="text"
          className={global.field}
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />



        <FiSliders
          className={global.fieldBtnIcon}
          onClick={() => setToggleSearchFilter(!toggleSearchFilter)}
        />
      </div>

      { toggleSearchFilter && (
        <TagInput onChange={setFilterTags} tags = {filterTags}/>
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
              }}>
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
