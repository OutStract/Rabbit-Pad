import React, { useState } from 'react'

export default function FileOps({ clicked, activePath }) {

    const defPath = './data/Projects'
    const trashDir = './data'
    const content = ""
    const defName = 'untitled'
    const defDirName = 'New Folder'

    console.log("FileOps activePath: ",activePath)

    const buttons = "px-4 bg-zinc-700 text-zinc-50"


  return (
    <div className="flex font-medium justify-center gap-5 bg-zinc-800 ">
        <button className={buttons} onClick={async() => {
            await window.ipcRenderer.create(defPath, content, defName)
            clicked()}}>CF</button>
        <button className={buttons} onClick={async() => {
            await window.ipcRenderer.delete(trashDir, activePath)
            clicked()}}>DF</button>
        <button className={buttons} onClick={async() => {
            await window.ipcRenderer.createFolder(defPath, defDirName)
            clicked()}}>CD</button>

    </div>
  )
}
