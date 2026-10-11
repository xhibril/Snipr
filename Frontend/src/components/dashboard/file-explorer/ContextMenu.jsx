export default function ContextMenu({
  x,
  y,
  file,
  onDelete,
  setContextMenu,
  onRecover,
  type,
  setSelectedItem,
  onOpen,
  setIsEditing,
  setEditingId,
  editingId,
  page,
  updatePinStatus,
}) {
  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        left: x,
        top: y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === "PANEL" ? (
        <>
          <button>New file</button>
          <button>New folder</button>
          <button>Paste</button>
        </>
      ) : (
        <>
          <button onClick={() => onOpen(file, type)}>Open</button>

          {page.itemActions.includes("pin") && (
            <button
              onClick={() => {
                updatePinStatus(file, type);
                setContextMenu(null);
              }}
            >
              {file?.isPinned ? "Unpin" : "Pin"}
            </button>
          )}

          {page.itemActions.includes("rename") && (
            <button
              onClick={() => {
                setIsEditing(true);
                setEditingId(file.id);
                setContextMenu(null);
              }}
            >
              Rename
            </button>
          )}

          {page.itemActions.includes("delete") && (
            <button
              onClick={() => {
                onDelete(file, type);
                setContextMenu(null);
              }}
            >
              Delete
            </button>
          )}

          {page.itemActions.includes("share") && (
            <button onClick={() => setContextMenu(null)}>Share</button>
          )}

          {page.itemActions.includes("recover") && (
            <button
              onClick={() => {
                onRecover(file, type);
                setContextMenu(null);
              }}
            >
              Recover
            </button>
          )}
        </>
      )}
    </div>
  );
}
