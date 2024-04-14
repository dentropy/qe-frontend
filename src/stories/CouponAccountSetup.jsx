import * as react from 'react'
import { generateSecretKey, getPublicKey } from 'nostr-tools'
import { finalizeEvent } from 'nostr-tools';

export const CouponAccountSetup =({ ...props }) => {


    const [appConfig, setAppConfig] = react.useState('');
    const [couponInput, setCouponInput] = react.useState('');
    const [tmpNostrSecretKey, setTmpNostrSecretKey] = react.useState('');
    const [tmpNostrPublicKey, setTmpNostrPublicKey] = react.useState('');
    const [couponValid, setCouponValid] = react.useState({});

    react.useEffect(() => {
        let secret_key = generateSecretKey()
        let public_key = getPublicKey(secret_key)
        setTmpNostrSecretKey(secret_key)
        setTmpNostrPublicKey(public_key)
        async function tmp_fetch_data(){
            let app_config = await fetch("/apps")
            app_config = await app_config.json()
            setAppConfig(app_config)
        }
        tmp_fetch_data()
    }, [])


    async function check_coupon(){
        let signedEvent = finalizeEvent({
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['DD']
            ],
            content:
                JSON.stringify({
                    "app_name" : appConfig.app_name,
                    "app_key" : appConfig.app_key,
                    "function_name": "check_coupon",
                    "body": {
                        "coupon_code": couponInput
                    }
                }),
        }, tmpNostrSecretKey)
        let fetch_response = await fetch("/napi", {
            "method": "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signedEvent)
        })
        console.log("signedEvent")
        console.log(signedEvent)
        fetch_response = await fetch_response.json()
        console.log(fetch_response)
        setCouponValid(fetch_response)
    }

    return(
        <>
            <h1>Please Input Coupon Code Below</h1>
            <br></br>
            <input 
                type="text"
                value={couponInput} 
                onChange={(event) => {setCouponInput(event.target.value)}} 
                data-testid="nsec_input"
                placeholder="Type here..."
            >
            </input>
            <br></br>
            <button onClick={() => { check_coupon() }}>Submit Coupon</button>
            <br></br>
            <h1>Secret key: {tmpNostrSecretKey}</h1>
            <h1>Public Key: {tmpNostrPublicKey}</h1>
            <h1>{JSON.stringify(appConfig)}</h1>
            <h1>{JSON.stringify(couponValid)}</h1>
        </>
    )
}