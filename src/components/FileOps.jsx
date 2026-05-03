import React, { useState } from 'react'

export default function FileOps({ clicked, activePath, selectedNode, path }) {

    const defPath = './data/Projects'
    const trashDir = './data'
    const content = ""
    const defName = 'untitled'
    const defDirName = 'New Folder'

    console.log("FileOps activePath: ",activePath)

    const buttons = "px-4 bg-zinc-700 text-zinc-50"

    async function handleDelete() {
        for (const nodepath of selectedNode) {
            console.log(nodepath)
            await window.ipcRenderer.delete(trashDir, nodepath)
        }
        clicked()
        path("")
    }


  return (
    <div className="flex font-medium justify-center gap-5 bg-zinc-800 h-6">
        <button className={buttons} onClick={async() => {
            const result = await window.ipcRenderer.create(defPath, content, defName)
            if(result.success) {
                path(result.newPath)
            }
            clicked()}}>CF</button>

        <button className={buttons} onClick={handleDelete}>DF</button>

        <button className={buttons} onClick={async() => {
            await window.ipcRenderer.createFolder(defPath, defDirName)
            clicked()}}>CD</button>

    </div>
  )
}
