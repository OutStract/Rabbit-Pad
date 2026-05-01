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
    <div className="flex flex-col font-medium bg-zinc-800 pl-10.5 h-full min-w-64 border border-solid border-zinc-600">
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

 const isSelected = selectedNode === node.path
 const isRenaming = renamePath === node.path

 const [tempName, setTempName] = useState("")

 console.log("SelectedNode:", selectedNode)

 console.log("Rename path: ", renamePath)

async function handleRename(type) {
  let userInput = tempName
    .replace(/[<>:"/\\|?*]/g, "")

  if (!userInput) {
    return // or show error
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
            onChange={(e) => setTempName(e.target.value)}
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
        <div className= {isSelected ? "border text-zinc-50" : "text-zinc-400"}
        onClick={async () => {
          setSelectedNode(node.path)
          if (node.type === "file") {
            const result = node.path
            path(node.path)
            console.log(result)
          }}}
          onDoubleClick={() => {
            console.log("Double Clicked")
            setRenamePath(node.path)
            console.log(renamePath)
            setTempName(node.name)
          }}>
        {node.name}
      </div>
      )}
      

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
    </div>
  )
}