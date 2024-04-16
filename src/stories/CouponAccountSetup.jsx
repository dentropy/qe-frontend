import * as react from 'react'
import { generateSecretKey, getPublicKey } from 'nostr-tools'
import { finalizeEvent } from 'nostr-tools';

import { CouponInputAndCheck } from './CouponInputAndCheck'

export const CouponAccountSetup = (props) => {


    const [appConfig, setAppConfig] = react.useState('');
    const [couponInput, setCouponInput] = react.useState('');
    const [tmpNostrSecretKey, setTmpNostrSecretKey] = react.useState('');
    const [tmpNostrPublicKey, setTmpNostrPublicKey] = react.useState('');
    const [couponValid, setCouponValid] = react.useState({});
    const [validCouponDomains, setValidCouponDomains] = react.useState({});

    react.useEffect(() => {
        let secret_key = generateSecretKey()
        let public_key = getPublicKey(secret_key)
        setTmpNostrSecretKey(secret_key)
        setTmpNostrPublicKey(public_key)
        async function tmp_fetch_data() {
            let app_config = await fetch("/apps")
            app_config = await app_config.json()
            setAppConfig(app_config)
        }
        tmp_fetch_data()
    }, [])


    async function check_coupon() {
        console.log(couponInput)
        console.log(couponInput)
        let signedEvent = finalizeEvent({
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['DD']
            ],
            content:
                JSON.stringify({
                    "app_name": appConfig.app_name,
                    "app_key": appConfig.app_key,
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
        fetch_response = await fetch_response.json()
        setCouponValid(fetch_response)
        console.log(fetch_response)
        if (fetch_response.status == "error") {
            props.setSelectedModal("ModalInvalidCoupon")
        } else {
            console.log(fetch_response.data.content.token_id)
            check_coupon_domains(fetch_response.data.content.token_id)
            props.setSelectedModal("ModalValidCoupon")
        }
    }

    async function check_coupon_domains(token_id) {
        let signedEvent = finalizeEvent({
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['DD']
            ],
            content:
                JSON.stringify({
                    "app_name": appConfig.app_name,
                    "app_key": appConfig.app_key,
                    "function_name": "internet_identifier_token_checker",
                    "body": {
                        "token_id": token_id
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
        fetch_response = await fetch_response.json()
        console.log(check_coupon_domains)
        console.log(fetch_response)
        setValidCouponDomains(fetch_response)
    }

    return (
        <>
            <CouponInputAndCheck
                check_coupon={check_coupon}
                setCouponInput={setCouponInput}
                couponInput={couponInput}
            >

            </CouponInputAndCheck>
        </>
    )
}