
import Header from './components/Header'
import Folder from './components/Folder'
import TextArea from './components/TextArea'
import TimeLine from './components/TimeLine'
import FileOps from './components/FileOps'
import { act, useState } from 'react'


function App() {
  const [activePath, setActivePath] = useState("")
  const [freshTree, setFreshTree] = useState(0)
  console.log("App.ts",activePath)
  const handleAction = () => setFreshTree(prev => prev + 1);
  console.log("Tree Refresh Count ", freshTree)
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      {/* <Header className="h-12 w-full bg-zinc-800"/> */}
      <div className='flex flex-1 w-full'>
        <div>
        <FileOps clicked = {handleAction} activePath = {activePath}/>
        <Folder path = {setActivePath} freshTree = {freshTree} />
        </div>
        <TextArea path = {activePath}/>
        <TimeLine className="h-full  w-full max-w-85 bg-zinc-700 border border-solid border-zinc-600"/>
      </div>
   </div>
  )
}

export default App