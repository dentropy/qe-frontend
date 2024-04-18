import * as react from 'react'

import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools'
import { generateSeedWords, validateWords, privateKeyFromSeedWords } from 'nostr-tools/nip06'

import { CouponInputAndCheck } from './CouponInputAndCheck'
import { ChooseInternetIdentifier } from './ChooseInternetIdentifier';


export const CouponAccountSetup = (props) => {


    const [appConfig, setAppConfig] = react.useState('');
    const [couponInput, setCouponInput] = react.useState('');
    const [nostrSecretKey, setNostrSecretKey] = react.useState('');
    const [nostrPublicKey, setNostrPublicKey] = react.useState('');
    const [couponValid, setCouponValid] = react.useState({});
    const [validCouponDomains, setValidCouponDomains] = react.useState({});
    const [couponStep, setCouponStep] = react.useState("input_coupon");
    const [couponTokenID, setCouponTokenID] = react.useState('');

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    react.useEffect(() => {
        let existing_cookie = getCookie("mnemonic")
        let mnemonic = ""
        if(existing_cookie == undefined || existing_cookie == "" ){
            mnemonic = generateSeedWords()
            setCookie("mnemonic", mnemonic, 365)
        } 
        else {
            mnemonic = existing_cookie
        }

        let secret_key = privateKeyFromSeedWords(mnemonic, "", 0)
        setNostrSecretKey(secret_key)
        setNostrPublicKey(getPublicKey(secret_key))

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
        }, nostrSecretKey)
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
            console.log("fetch_response.data.content.token_id")
            console.log(fetch_response.data.content.token_id)
            check_coupon_domains(fetch_response.data.content.token_id)
            setCouponTokenID(fetch_response.data.content.token_id)
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
        }, nostrSecretKey)


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


        let internet_identifier_lables = []
        for(var i = 0; i < fetch_response.data.length; i++){
            internet_identifier_lables.push({
                label : fetch_response.data[i]
            })
        }


        signedEvent = finalizeEvent({
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['DD']
            ],
            content:
                JSON.stringify({
                    "app_name": appConfig.app_name,
                    "app_key": appConfig.app_key,
                    "function_name": "claim_coupon",
                    "body": {
                        "coupon_code": couponInput
                    }
                }),
        }, nostrSecretKey)

        fetch_response = await fetch("/napi", {
            "method": "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signedEvent)
        })
        fetch_response = await fetch_response.json()
        console.log(check_coupon_domains)
        console.log(fetch_response)
        
        // TODO the coupon code validation


        console.log(internet_identifier_lables)
        setValidCouponDomains(internet_identifier_lables)
        setCouponStep("select_intenret_identifier")
    }

    function render_coupon_step(){
        if (couponStep == "input_coupon") {
            return (
                <CouponInputAndCheck
                    check_coupon={check_coupon}
                    setCouponInput={setCouponInput}
                    couponInput={couponInput}
                    setCouponStep={setCouponStep}
                >
                </CouponInputAndCheck>
            )
        }
        if (couponStep == "select_intenret_identifier") {
            return (
                <ChooseInternetIdentifier
                    internet_identifier_lables={validCouponDomains}
                    coupon_token_id={couponTokenID}
                ></ChooseInternetIdentifier>
            )
        }
    }

    return (
        <>
            {render_coupon_step()}
        </>
    )
}