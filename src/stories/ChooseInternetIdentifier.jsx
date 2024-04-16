import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

export function ChooseInternetIdentifier(props) {
    const [username, setUsername] = React.useState("");
    const [domainNames, setDomainNames] = React.useState([
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 }
    ])
    const [ selectedDomainName, setSelectedDomainName ] = React.useState(
        { label: 'The Shawshank Redemption', year: 1994 }
    )

    function set_domain_name(input, value) {
        setSelectedDomainName(value)
    }

    return (
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
    );
}
