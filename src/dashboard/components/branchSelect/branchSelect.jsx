import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Slide,
    MenuItem,
    Button
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';

import { env } from '../../../config/env';

const { API } = env;

// Sale confirmation
const transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BranchSelect = props => {
    const [show, setShow] = useState(true);
    const [branches, setBranches] = useState([]);
    const [branchSelect, setBranchSelect] = useState('none');
    const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${props.authSession.token}`
    };
    var { company } = props.authSession;

    const handleBranchSelect = e => {
        setBranchSelect(e.target.value);
    }

    const handleSubmitBranch = async e => {
        if(branchSelect != 'none'){
            let authSession = {
                ...props.authSession,
                currentBranch: branchSelect
            }
            props.setAuthSession(authSession);
            await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(authSession));
            setShow(false);
        }else{
            props.enqueueSnackbar('Debes seleccionar una sucursal!', { variant: 'warning' });
        }
    }

    useEffect(() => {
        if(company){
            fetch(`${API}/api/company/${company.id}/branches/list`, {headers})
            .then(res => res.json())
            .then(res => {
                if(res.branches){
                    setBranches(res.branches);
                }
            });
        }
    }, []);

    return(
        <Dialog
            open={ show }
            TransitionComponent={ transition }
            keepMounted
            aria-labelledby="alert-dialog-customer-title"
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle id="alert-dialog-customer-title">Seleccionar sucursal en la que te encuantras</DialogTitle>
            <DialogContent>
                <div>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-branch">Sucursal</InputLabel>
                        <Select
                            labelId="outlined-adornment-branch"
                            id="select-branch"
                            variant="outlined"
                            label="Sucursal"
                            inputProps={{ 'aria-label': 'Sucursal' }}
                            required
                            fullWidth
                            value={ branchSelect }
                            onChange={ handleBranchSelect }
                            >
                                <MenuItem disabled key={0} value="none">
                                    <em>Selecciona la sucursal</em>
                                </MenuItem>
                                {
                                    branches.map(branch => 
                                        <MenuItem key={branch.id} value={branch.id}>{ branch.name }</MenuItem>
                                    )
                                }
                        </Select>
                    </FormControl>
                </div>
                <div style={{marginTop: 20}}>
                    <Alert severity="info">
                        <AlertTitle>Información</AlertTitle>
                        Para registrar una venta debes seleccionar la sucursal en la que te encuentras.
                    </Alert>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={ handleSubmitBranch } color="primary">
                    Seleccionar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthSession : (authSession) => dispatch({
            type: 'SET_AUTH_SESSION',
            payload: authSession
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(BranchSelect))