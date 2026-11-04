import { useEffect } from "react";

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
  editingTarget,
  setEditingTarget,
  page,
  updatePinStatus,
  
          setCreationType,
  pasteItem,
  copy,
  setCopy,
  setPendingName
}) {
  return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        left: x,
        top: y,
      }
    }


    onClick={(e) => e.stopPropagation()}
    >
      {type !== "FILE" && (
        <>
          <button
            onClick={() => {
              setSelectedItem({
                data: file,
                type: type,
              });
             setCreationType((prev) => prev === "FILE" ? null : "FILE");
              setContextMenu(null);
            }}
          >
            New file
          </button>

          <button
            onClick={() => {

              setSelectedItem({
                data: file,
                type: type,
              });

                setCreationType((prev) => prev === "FOLDER" ? null : "FOLDER");
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
                setEditingTarget({
  id: file.id,
  type: "FILE",
});


                setPendingName(file.name)





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
            <button onClick={() => setCopy({
              data: file,
              type: type
            })}>Copy</button>
          )}
        </>
      )}

      {/*allow copy to appear in panel n folder, not file */}
      {page.itemActions.includes("paste") &&
        (type === "FOLDER" || type === "PANEL") && <button onClick={() =>{

          if(copy?.type === "FOLDER"){
            pasteItem(copy?.data, "FOLDER")
          } 

          if(copy?.type === "FILE" && type === "PANEL"){
            pasteItem(copy?.data, "FILE");
          }

          if(copy?.type === "FILE" && type === "FOLDER"){
            pasteItem(copy?.data, "FILE", file?.id)
          }
        }
        }>Paste</button>}
    </div>
  );
}
