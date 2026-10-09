export const PAGE_CONFIG = {
  REGULAR: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: true,
    itemActions: ["pin", "move", "delete", "openFolders", "create", "share"],
    deleteMode: "trash",
  },

  SHARED: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: false,
    itemActions: ["open" , "openFolders" , "create"],
    deleteMode: null,
  },

  STARRED: {
    showFolders: true,
    showSearch: true,
    showExplorerToolBar: true,
    itemActions: ["pin", "move", "delete", "openFolders" ,"share"],
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