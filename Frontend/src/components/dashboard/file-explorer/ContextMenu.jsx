export default function ContextMenu({
  x,
  y,
  file,
  onDelete,
  setContextMenu,
  onRecover,
type
}){

return (
    <div
      className="context-menu"
      style={{
        position: "fixed",
        left: x,
        top: y
      }}
      onClick={(e) => e.stopPropagation()}
    >

        <button>Open</button>
        <button onClick={() => onDelete(file,type )}>Delete</button>
        <button>Rename</button>
        <button onClick={() => setContextMenu(null)}>Close</button>


       {file?.isDeleted && (
  <button onClick={() => onRecover(file, type)}>
    Recover
  </button>
)}
       
        </div>
)
}