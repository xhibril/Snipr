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
  onRename,
  isEditing,
  setIsEditing,
  setEditingId
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
      <button onClick={() => onOpen(file, type)}>Open</button>

      <button
        onClick={() => {
          onDelete(file, type);
          setContextMenu(null);
        }}
      >
        Delete
      </button>

      
      <button onClick={() => {setIsEditing(true)
       setEditingId(file.id)
        setContextMenu(null)
       
      }}>Rename</button>



      <button onClick={() => setContextMenu(null)}>Close</button>

      {file?.isDeleted && (
        <button onClick={() => { onRecover(file, type); setContextMenu(null)}}>Recover</button>
      )}
    </div>
  );
}
