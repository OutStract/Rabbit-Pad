import { useState, useEffect } from 'react'

export default function TextArea({ path }) {

  const [content, setContent] = useState("")

  const [isDirty, setIsDirty] = useState(false)


    useEffect(() => {
    async function loadFiles() {
      if (!path) return
      setIsDirty(false)
      const result = await window.ipcRenderer.file(path)
      setContent(result)
    }
    loadFiles()
  }, [path])

    useEffect(() => {
      if (!path) return
      if (!isDirty) return
      const writeFile = setTimeout(async () => {
        await window.ipcRenderer.write(path, content)
        setIsDirty(false)
      }, 500)


      return () => clearTimeout(writeFile)
  }, [content, path, isDirty])


  return (
    <div className="h-full  w-full bg-zinc-700 border border-solid border-zinc-600">
      <div className="flex flex-col h-full ml-18">
        <textarea
          className="bg-zinc-700 outline-none h-full w-full px-6 pt-6 resize-none w-125 text-zinc-300 overflow-x-auto text-base/8"
          value={content} onChange={e => {
            setContent(e.target.value) 
            setIsDirty(true)
          }}
        />
      </div>
    </div>
  )
}

