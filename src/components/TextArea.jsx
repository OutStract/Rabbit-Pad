import { useState, useEffect } from 'react'

export default function TextArea({ path }) {

  const [content, setContent] = useState("")

    useEffect(() => {
    async function loadFiles() {
      if (!path) return

      const result = await window.ipcRenderer.file(path)
      setContent(result || "File is empty. Click to start writing")
    }
    loadFiles()
  }, [path])


  return (
    <div className="h-full  w-full bg-zinc-700 border border-solid border-zinc-600">
      <div className="flex flex-col h-full ml-18">
        <textarea
          className="bg-zinc-700 outline-none h-full w-full px-6 pt-6 resize-none w-125 text-zinc-300 overflow-x-auto text-base/8"
          value={content}
        />
      </div>
    </div>
  )
}

