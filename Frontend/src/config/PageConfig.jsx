export const PAGE_CONFIG = {
  ALL: {
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

  PINNED: {
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
    showExpiration: true,
    itemActions: ["recover", "delete"],
    deleteMode: "permanent",
  },
};