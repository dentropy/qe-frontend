import * as react from 'react'

export function CouponInputAndCheck( props ) {



    return(
    <>
            <h1>Please Input Coupon Code Below</h1>
            <br></br>
            <input 
                type="text"
                value={props.couponInput} 
                onChange={(event) => {props.setCouponInput(event.target.value)}} 
                data-testid="nsec_input"
                placeholder="Type here..."
            >
            </input>
            <br></br>
            <button onClick={() => { props.check_coupon() }}>Submit Coupon</button>
            <br></br>
    </>
    )
}
