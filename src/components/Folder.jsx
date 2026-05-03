import { useState, useEffect } from 'react'

export default function Folder({ path, freshTree, setFreshTree, selectedNode, setSelectedNode, renamePath, setRenamePath }) {
  const [files, setFiles] = useState([])



  useEffect(() => {
    async function loadFiles() {
      const result = await window.ipcRenderer.tree('./data/Projects')
      setFiles(result)
    }
    loadFiles()
  }, [freshTree])

  return (
    <div id='folder' className="flex flex-col font-medium bg-zinc-800 pl-10.5 h-full min-w-64 border border-solid border-zinc-600 overflow-y-auto">
      <div>
        {files.map((file) => (
          <Tree
            node={file}
            key={file.name}
            path={path}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            renamePath = {renamePath}
            setRenamePath = {setRenamePath}
            refreshTree = {setFreshTree}
          />
        ))}
      </div>
    </div>
  )
}

function Tree({ node, path, selectedNode, setSelectedNode, renamePath, setRenamePath, refreshTree }) {

 const isSelected = selectedNode.includes(node.path)
 const isRenaming = renamePath === node.path


 const [tempName, setTempName] = useState("")

 const [isOpen, setIsOpen] = useState(false)

async function handleRename(type) {
  let userInput = tempName.trim(" ")
                .replace(/[<>:"/\\|?*]/g, "")
  console.log("trimmed: ", userInput)

      
      
  if(!userInput || userInput === node.name) { 
    setRenamePath("")
    refreshTree()
    return
    
  }

  if (type === "file") {
    userInput = userInput
                .replace(/\.md$/i, "")
                .replace(/\.+$/, "")
    if (!userInput.endsWith(".md")) {
      userInput += ".md"
    }
  }

  if (type === "folder") {
    // remove only extension-like endings
    userInput = userInput.replace(/\.+$/, "")
  }

  const result = await window.ipcRenderer.changeName(node.path, userInput)
  if(result.success) {
    setSelectedNode(prev => [...prev, result.newPath] )
  }

  if (result.success) {
    if (type === "file") {
      path(result.newPath)
    }
    setRenamePath("")
    refreshTree()
  }
}




  return (
    <div>
      {isRenaming ? (
          <input
            value={tempName}
            autoFocus
            onChange={(e) => {setTempName(e.target.value)}}
            onBlur={() => handleRename(node.type)}
            onKeyDown={(e) => {
              if(e.key === "Enter") {
                handleRename(node.type)
              }
              if(e.key === "Escape") {
                setRenamePath("")
              }}}
          />
      ) : (
        <div draggable = 'true' 
            // When user drag a folder without selecting it, so it will select it
            onDragStart={() => {if(!selectedNode.includes(node.path)){
                                  setSelectedNode([node.path])
                          }}} 
            // Needed for drop events to trigger, preventing default(opening the link and such) actions during the dragging
            onDragOver={(ev) => ev.preventDefault()}

            // async function checking if the drop place is a folder, if yes then it uses a for..of loop to iterate over the selected paths
            onDrop={async () => {
              if(node.type === "folder") {
                for (const nodePath of selectedNode) {
                   console.log(nodePath)
                  await window.ipcRenderer.move(nodePath, node.path)
              }
              refreshTree()
            }}}
            className= {isSelected ? "flex gap-1 border text-zinc-50" : "flex gap-1 text-zinc-400"}

        onClick={(e) => {
          if (e.ctrlKey) {
            setSelectedNode(prev =>
              prev.includes(node.path)
                ? prev.filter(p => p !== node.path)
                : [...prev, node.path]
            )
          } else {
            setSelectedNode([node.path])
            if (node.type === "file") {
              path(node.path)
            }
          }
        }}
          onDoubleClick={() => {
            console.log("Double Clicked")
            setRenamePath(node.path)
            console.log(renamePath)
            setTempName(node.name)
          }}>
            <div onClick={() => setIsOpen(prev => !prev)}>
            {node.type === "folder" ? (isOpen ? <div className='text-green-300'>D</div> : <div>D</div>) : <div>F</div>}
            </div>
        {node.name}
      </div>
      )}
      
      {isOpen &&
      <div className="pl-5">
        {node.children?.map((child) => (
          <Tree node={child} 
                key={child.name} 
                path={path} 
                selectedNode={selectedNode} 
                setSelectedNode={setSelectedNode}
                renamePath = {renamePath}
                setRenamePath = {setRenamePath}
                refreshTree = {refreshTree}
            />
        ))}
      </div>
      }
    </div>
  )
}