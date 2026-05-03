import { useState, useEffect } from 'react'

export default function TextArea({ path }) {

  const [content, setContent] = useState("")

  const [isDirty, setIsDirty] = useState(false)

  const [title, setTitle] = useState("Add title")
// Get title
  useEffect(() => {
    const titleSplit = path.split(/[\\/]/);
    const lastIndex = titleSplit.at(-1)
    const result = lastIndex.replace(/\.md$/, "")
    console.log("Title", result)
    setTitle(result)
  },[path])

    useEffect(() => {
    async function loadFiles() {
      setIsDirty(false)
      const result = await window.ipcRenderer.file(path)
      if(result.ok) {
        setContent(result.value)
      } else {
        console.log("err: ",result.value)
        setContent("")
      }
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
        <h1>{title}</h1>
        <textarea
          className="bg-zinc-700 outline-none h-full w-full  py-6 pr-18 resize-none text-zinc-300 overflow-x-auto text-base/8"
          value={content} onChange={e => {
            setContent(e.target.value) 
            setIsDirty(true)
          }}
        />
      </div>
    </div>
  )
}

