import React from 'react'

import { ModalExample } from './ModalExample';
import { ModalInvalidCoupon } from './ModalInvalidCoupon';
import { ModalValidCoupon } from './ModalValidCoupon';

export function RenderModals(props) {
    const [modal, setModal] = React.useState(<></>);

    React.useEffect(() => {
        renderModal(props.modalSelected.modal_selected)
    }, [props])

    function renderModal(modalSelected) {
        // console.log("modalSelected")
        // console.log(modalSelected)
        if (modalSelected == "ModalExample") {
            console.log("ModalExample")
            setModal(<ModalExample setSelectedModal={props.setSelectedModal}  ></ModalExample>)
            return true
        }
        if (modalSelected == "ModalInvalidCoupon") {
            console.log("ModalInvalidCoupon")
            setModal(<ModalInvalidCoupon setSelectedModal={props.setSelectedModal}  ></ModalInvalidCoupon>)
            return true
        }
        if (modalSelected == "ModalValidCoupon") {
            console.log("ModalValidCoupon")
            setModal(<ModalValidCoupon setSelectedModal={props.setSelectedModal}  ></ModalValidCoupon>)
            return true
        }
        setModal(<></>)
        return true
    }
    return (
        <>
            {modal}
        </>
    )
}