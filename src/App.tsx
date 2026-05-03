
import Header from './components/Header'
import Folder from './components/Folder'
import TextArea from './components/TextArea'
import TimeLine from './components/TimeLine'
import FileOps from './components/FileOps'
import { act, useEffect, useState } from 'react'


function App() {
  const [activePath, setActivePath] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [selectedNode, setSelectedNode] = useState([])
  const [renamePath, setRenamePath] = useState("")
  const [leftPanel, setLeftPanel] = useState(true)
  const [rightPanel, setRightPanel] = useState(true)

  console.log("Active path in app", activePath)


  function leftToggle() {
    setLeftPanel(prev => !prev)
    console.log("Panel triggerd")
  }
  function rightToggle() {
    setRightPanel(prev => !prev)
    console.log("Panel triggerd")
  }

  console.log("App.ts",activePath)
  const handleAction = () => setRefresh(prev => prev + 1);
  console.log("Refresh Count ", refresh)
  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <div className='flex flex-1 w-full h-screen'>
        {leftPanel ? <div>
        <FileOps clicked = {handleAction} activePath = {activePath} selectedNode = {selectedNode} path={setActivePath} />
        <Folder path = {setActivePath} 
                freshTree = {refresh} 
                selectedNode = {selectedNode} 
                setSelectedNode = {setSelectedNode}
                renamePath = {renamePath}
                setRenamePath = {setRenamePath}
                setFreshTree = {handleAction} />
        </div> : "" }
        <div className='w-full'>
        <Header leftPanel = {leftToggle} rightPanel={rightToggle}/>
        <TextArea path = {activePath} refresh ={refresh}/>
        </div>
        {rightPanel ? <TimeLine className="h-full  w-full max-w-85 bg-zinc-700 border border-solid border-zinc-600"/> : "" }
        
      </div>
   </div>
  )
}

export default App