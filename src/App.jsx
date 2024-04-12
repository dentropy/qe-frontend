import * as react from 'react'
import { useState } from 'react'
import './App.css'

function App() {
  const [NIP07, setNIP07] = useState(false)
  react.useEffect(() =>{
    if(Object.keys(window).includes("nostr")){
      setNIP07(true)
    }
  })

  if(NIP07){
    return(
      <>
        <h1>NIP07 is Enabed</h1>
      </>
    )
  }
  return (
    <>
      <h1>NIP07 is not enabled get your NSEC ready</h1>
    </>
  )
}

export default App
