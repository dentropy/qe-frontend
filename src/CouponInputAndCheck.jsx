import * as react from 'react'

export default CouponInputAndCheck =({ ...props }) => {
    const [couponCode, setCouponCode] = react.useState("");


    return(
    <>
        <h1>Coupon Code</h1>
        <input 
            id="coupon_code"
            onChange={(value) => {setCouponCode(event.target.value)}}
            value={couponCode}
        >    
        </input>
    </>
    )
}
