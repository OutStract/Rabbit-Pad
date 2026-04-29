import { useState, useEffect } from 'react'

export default function Folder({ path, freshTree }) {
  const [files, setFiles] = useState([])


  useEffect(() => {
    async function loadFiles() {
      const result = await window.ipcRenderer.tree('./data')
      setFiles(result)
    }
    loadFiles()
  }, [freshTree])

  return (
    <div className="flex flex-col font-medium bg-zinc-800 pl-10.5 h-full min-w-64 border border-solid border-zinc-600">
      <ul>
        {files.map((file) => (
          <Tree
            node={file}
            key={file.name}
            path={path}
          />
        ))}
      </ul>
    </div>
  )
}

function Tree({ node, path }) {
  return (
    <li>
      <p
        onClick={async () => {
          if (node.type === "file") {
            const result = node.path
            path(node.path)
            console.log(result)
          }
        }}
      >
        {node.name}
      </p>

      <ul className="pl-5">
        {node.children?.map((child) => (
          <Tree node={child} key={child.name} path={path} />
        ))}
      </ul>
    </li>
  )
}
