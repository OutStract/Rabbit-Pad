
import Header from './components/Header'
import Folder from './components/Folder'
import TextArea from './components/TextArea'
import TimeLine from './components/TimeLine'
import { useState } from 'react'


function App() {
  const [activePath, setActivePath] = useState("")
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <Header className="h-12 w-full bg-zinc-800"/>
      <div className='flex flex-1 w-full'>
        <Folder path = {setActivePath} />
        <TextArea path = {activePath}/>
        <TimeLine className="h-full  w-full max-w-85 bg-zinc-700 border border-solid border-zinc-600"/>
      </div>
   </div>
  )
}

export default App