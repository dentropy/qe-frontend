import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import PropTypes from 'prop-types';

import { touchRippleClasses } from '@mui/material';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '4px solid #000',
    boxShadow: 24,
    p: 6,
    color: 'black'
};

export function ModalExample(props) {
    const [open, setOpen] = React.useState(true);
    const [textField, setTextField] = React.useState("TEXT");
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        props.setSelectedModal({
            modal_selected : "NONE",
            data : {}
        })
        setOpen(false)
    }
    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are You Sure You Want To Delete This Project?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        SOME DATA
                    </Typography>
                    <Typography sx={{ textAlign: 'left', fontSize: 18 }} variant="h5">
                        Please type DELETE in all caps below to confirm you want to delete this project
                    </Typography>
                    <TextField
                        value={textField}
                        onChange={(event) => setTextField(event.target.value)}
                        id="set-project-description"
                        label="Server Name"
                        variant="outlined"
                        sx={{ width: 300 }}
                        style={{ padding: "20px" }}
                    /><br/>
                    <Button
                        onClick={() => {console.log("Hello World")}}
                        variant="contained">
                        Confirm
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}