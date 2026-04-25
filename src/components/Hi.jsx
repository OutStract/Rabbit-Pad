import { useState } from "react"


export default function Hi() {

    const [message,setMessage] = useState('')
  return (
    <div>
        <button onClick={async () => { const result = await window.ipcRenderer.invoke('hi')
            setMessage(result)
        }}>
            Call Node
        </button>
        <p>Reply : {message}</p>
    </div>
  )
}
