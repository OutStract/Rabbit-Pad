export default function Header({ leftPanel, rightPanel }) {
  return (
    <>
        <header className="flex h-6 w-full bg-zinc-800 justify-between px-4">
          <button onClick={() => {
            leftPanel()
            console.log("Left Panel Clicked")
          }}>L</button>
          <button onClick={() => {
            rightPanel()
            console.log("Right Panel Clicked")
          }}>R</button>
        </header>
    </>
  )
}
