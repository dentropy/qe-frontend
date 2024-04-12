import * as react from 'react'
import { useState } from 'react'
import './App.css'

function App() {
  const [NIP07, setNIP07] = useState(false)
  const [NSEC, setNSEC] = useState('nsec....');
  const nsec_invalid_string = "NSEC is Invalid"
  const [NSECValid, setNSECValid] = useState(nsec_invalid_string);

  function validate_NSEC(event){
    setNSEC(event.target.value)
    if(event.target.value.length == 63){
      setNSECValid("NSEC is Valid please select Submit below")
    }
    else {
      setNSECValid(nsec_invalid_string)
    }
  }

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
      <h1>Input your NSEC below or install a nostr NIP07 extension</h1>
      <h1>{NSECValid}</h1>
      <input 
        type="text"
        value={NSEC} 
        onChange={validate_NSEC} 
        placeholder="Type here..."
      >
      </input>
    </>
  )
}

export default App
