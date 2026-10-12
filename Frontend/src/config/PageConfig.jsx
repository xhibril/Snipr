export const PAGE_CONFIG = {
  REGULAR: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: true,
    itemActions: ["pin", "move", "delete", "openFolders", "create", "share", "rename", "share", "copy", "paste"],
    deleteMode: "trash",
  },

  SHARED: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: false,
    itemActions: ["TO COMPLETE LATER"],
    deleteMode: null,
  },

  STARRED: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: true,
    itemActions: ["pin", "move", "delete", "openFolders" ,"share", "rename", "share", "copy", "paste"],
    deleteMode: "trash",
  },

  DELETED: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: true,
    itemActions: ["recover", "permanentDelete"],
    deleteMode: "permanent",
  },
};