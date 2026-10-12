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
  setIsCreatingFolder

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
        
        
        e.stopPropagation()

        console.log("TYPE CONTEXT MENU: " + type)
        console.log("DOES IT ALLOW: "+ page.itemActions.includes("paste"))

      
      }






      }
    >
      {type === "PANEL" ? (
        <>
          <button onClick={(e) => {
            setIsCreatingFolder(false)
            setIsCreatingItem(true)
            setContextMenu(null)
          }}>New file</button>


          <button
        onClick={(e) => {setIsCreatingFolder(true)
          setIsCreatingItem(true);
          setContextMenu(null)
        }

        }>New folder</button>

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




          {page.itemActions.includes("copy") && 
          <button>Copy</button>}
        </>
      )}

{/*allow it to appear in panel n folder, not file */}
{page.itemActions.includes("paste") && 
(type === "FOLDER" || type === "PANEL") && (
  <button>Paste</button>
)}
    </div>
  );
}
