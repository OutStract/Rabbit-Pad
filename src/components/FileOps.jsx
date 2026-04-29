import React, { useState } from 'react'

export default function FileOps({ clicked }) {

    const dirPath = './data'
    const content = ""
    const name = 'untitled'

    const buttons = "px-4 bg-zinc-700 rounded-2x2 text-zinc-50"


  return (
    <div className="flex font-medium justify-center gap-5 bg-zinc-800 ">
        <button className={buttons} onClick={async() => {
            await window.ipcRenderer.create(dirPath, content, name)
            clicked()}}>CF</button>
        <button className={buttons}>DF</button>
        <button className={buttons}>RF</button>

    </div>
  )
}
