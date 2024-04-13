import * as react from 'react'
import PropTypes from 'prop-types';

export const ConnectNostr =({ ...props }) => {
    const { nip07Status } = props;
    const [NSEC, setNSEC] = react.useState('nsec....');
    const nsec_invalid_string = "NSEC is Invalid"
    const [NSECValid, setNSECValid] = react.useState(nsec_invalid_string);

    function validate_NSEC(event){
        setNSEC(event.target.value)
        if(event.target.value.length == 68){
          setNSECValid("NSEC is Valid please select Submit below")
        }
        else {
          setNSECValid(nsec_invalid_string)
        }
      }


    
      if( nip07Status){
        return(
          <>
            <h1>NIP07 is Enabed</h1>
          </>
        )
      }
      return (
        <>
          <h1>Input your NSEC below or install a nostr NIP07 extension</h1>
          <h1 data-testid="nsec_validator">{NSECValid}</h1>
          <input 
            type="text"
            value={NSEC} 
            onChange={validate_NSEC} 
            data-testid="nsec_input"
            placeholder="Type here..."
          >
          </input>
        </>
      )
}
