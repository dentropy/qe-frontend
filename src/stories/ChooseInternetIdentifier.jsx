import * as react from 'react'

import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools'
import { generateSeedWords, validateWords, privateKeyFromSeedWords } from 'nostr-tools/nip06'

import bs58 from 'bs58'

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export function ChooseInternetIdentifier(props) {
    const text_encoder = new TextEncoder()
    const [nostrSecretKey, setNostrSecretKey] = react.useState('');
    const [nostrPublicKey, setNostrPublicKey] = react.useState('');
    const [username, setUsername] = React.useState("");
    const [myDID, setMyDID] = React.useState("");
    const [domainNames, setDomainNames] = React.useState(
        props.internet_identifier_lables
        // [
        // { label: 'The Shawshank Redemption', year: 1994 },
        // { label: 'The Godfather', year: 1972 },
        // { label: 'The Godfather: Part II', year: 1974 },
        // { label: 'The Dark Knight', year: 2008 }
        // ]
    )
    const [selectedDomainName, setSelectedDomainName] = React.useState(
        props.internet_identifier_lables[0]
        // { label: 'The Shawshank Redemption', year: 1994 }
    )

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }


    async function check_and_set_internet_identifier() {

        console.log("token_id")
        console.log(props.coupon_token_id)
        

        let nostr_json = await fetch(`/dd/${selectedDomainName.label}/.well-known/nostr.json`)
        nostr_json = await nostr_json.json()
        if (nostr_json.names[username] == undefined) {
            // Check token balance
            let mnemonic = getCookie("mnemonic")
            console.log("mnemonic")
            console.log(mnemonic)
            let secret_key = privateKeyFromSeedWords(mnemonic, "", 0)
            let public_key = getPublicKey(secret_key)
            setNostrSecretKey(secret_key)
            setNostrPublicKey(public_key)

            let app_config = await fetch("/apps")
            app_config = await app_config.json()
            let my_DID = "did:key:" + await bs58.encode(await text_encoder.encode(String(public_key)))
            console.log(`my_DID = ${my_DID}`)
            setMyDID( my_DID )
            let signedEvent = finalizeEvent({
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ['DD']
                ],
                content:
                    JSON.stringify({
                        "app_name": app_config.app_name,
                        "app_key": app_config.app_key,
                        "function_name": "query_dd_token_balances",
                        "body": {
                            "selector": {
                                // "content.token_id": props.coupon_token_id, // TODO
                                "content.did" : my_DID  // { $eq : my_DID }
                            }
                        }
                    }),
            }, secret_key)
            let fetch_response = await fetch("/napi", {
                "method": "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signedEvent)
            })
            let did_balance = await fetch_response.json()
            console.log("fetch_response_token_balances")
            console.log(did_balance)
            console.log("fetch_response.content.balance")
            console.log(did_balance[0].content.balance)

            // Fetch token_state
            signedEvent = finalizeEvent({
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ['DD']
                ],
                content:
                    JSON.stringify({
                        "app_name": app_config.app_name,
                        "app_key": app_config.app_key,
                        "function_name": "get_dd_token_state",
                        "body": {
                            token_id : props.coupon_token_id
                        }
                    }),
            }, secret_key)
            fetch_response = await fetch("/napi", {
                "method": "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signedEvent)
            })
            let token_state = await fetch_response.json()
            console.log("token_state")
            console.log(token_state)
            // Use Coupon

            let transaction_body = {
                "app_name": "DD_token_RBAC",
                "version": "0.0.1",
                "last_transaction_CID": token_state[0].content.previous_CID,
                "token_id": props.coupon_token_id,
                "from_did": my_DID,
                "to_did": app_config.admin_did,
                "operation_name": "transfer",
                "timestamp_ms": Date.now(),
                "value": 1,
                "did_nonce": did_balance[0].content.nonce + 1,
                "token_nonce": token_state[0].content.token_transaction_count,
                "memo": JSON.stringify({ internet_identifier: username + "@"  }),
                "operation_data": {}
            }
            console.log("transaction_body")
            console.log(transaction_body)
            signedEvent = finalizeEvent({
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [
                    ['DD']
                ],
                content:
                    JSON.stringify({
                        "app_name": app_config.app_name,
                        "app_key": app_config.app_key,
                        "function_name": "dd_token",
                        "body": transaction_body
                    }),
            }, secret_key)
            fetch_response = await fetch("/napi", {
                "method": "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signedEvent)
            })
            let transaction_response = await fetch_response.json()
            console.log("transaction_response")
            console.log(transaction_response)


        } else {
            // Render Modal saying username is already taken
        }

    }

    function set_domain_name(input, value) {
        setSelectedDomainName(value)
    }

    return (
        <>
            <Box
                noValidate
                autoComplete="off"
                display="flex" alignItems="center"
            >
                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(event) => { setUsername(event.target.value) }}
                />
                <Typography variant="body1" component="span">@</Typography>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={domainNames}
                    sx={{ width: 300 }}
                    value={selectedDomainName}
                    onChange={set_domain_name}
                    isOptionEqualToValue={(option, value) => option.label === value.label}
                    renderInput={(params) => <TextField {...params} label="Domain Name" />}
                />
            </Box>
            <br></br>
            <Button variant="contained" onClick={check_and_set_internet_identifier}>
                Claim Internet Identifier
            </Button>
        </>
    );
}
