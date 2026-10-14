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
  setIsCreatingItem,
  setIsCreatingFolder,
  pasteItem,
  copy,
  setCopy
}) {
  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        left: x,
        top: y,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {type !== "FILE" && (
        <>
          <button
            onClick={(e) => {
              setSelectedItem({
                data: file,
                type: type,
              });
              setIsCreatingFolder(false);
              setIsCreatingItem((prev) =>
                prev?.type === "FILE" ? false : { type: "FILE" },
              );
              setContextMenu(null);
            }}
          >
            New file
          </button>

          <button
            onClick={(e) => {
              setIsCreatingFolder(true);

              setSelectedItem({
                data: file,
                type: type,
              });

              setIsCreatingItem((prev) =>
                prev?.type === "FOLDER" ? false : { type: "FOLDER" },
              );
              setContextMenu(null);
            }}
          >
            New folder
          </button>
        </>
      )}

      {type !== "PANEL" && (
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

          {page.itemActions.includes("copy") && (
            <button onClick={() => setCopy(file)}>Copy</button>
          )}
        </>
      )}

      {/*allow it to appear in panel n folder, not file */}
      {page.itemActions.includes("paste") &&
        (type === "FOLDER" || type === "PANEL") && <button onClick={() =>{
        console.log("ITEM: " + copy);
        
        pasteItem(copy, "FOLDER")
        }
        
        
        }>Paste</button>}
    </div>
  );
}
