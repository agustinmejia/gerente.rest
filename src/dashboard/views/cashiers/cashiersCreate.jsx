import React, { Component } from 'react';
import {
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Backdrop,
    CircularProgress
}from '@material-ui/core';
import { IoIosMenu, IoIosCheckmarkCircle, IoIosArrowDropleft } from "react-icons/io";
import { Link } from "react-router-dom";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../config/env';

const { API } = env;

class CashiersCreate extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            sidebarToggled: false,
            loading: false,
            branches: [],
            users: [],
            name: '',
            branchId: 'none',
            userId: 'none',
            openingAmount: 0,
        }
    }

    componentDidMount(){
        let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/branches/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            this.setState({branches: res.branches});
        })
        .catch(error => ({'error': error}));
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.branchId === 'none' || this.state.userId === 'none'){
            this.props.enqueueSnackbar('Debes seleccionar una sucursal y un empleado', { variant: 'warning' });
            return false;
        }

        this.setState({loading: true});
        let params = {
            name: this.state.name,
            branch_id: this.state.branchId,
            opening_amount: this.state.openingAmount
        }
        axios({
            method: 'post',
            url: `${API}/api/branch/create`,
            data: params,
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.branch){
                this.props.enqueueSnackbar('Sucursal registrada correctamente!', { variant: 'success' });
                // console.log(res.data)
            }else{
                this.props.enqueueSnackbar('Ocurrió un error inesparado, intente nuevamente!', { variant: 'error' })
            }
        })
        .catch((err) => this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor!', { variant: 'error' }))
        .then(() => this.setState({loading: false}));
    }

    render() {
        return (
            <>
                { this.state.loading &&
                    <Backdrop open={true} style={{ zIndex: 2 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
                <div className='app'>
                    <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                    <main style={{paddingTop: 10}}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>

                        <Navbar title={<h1 style={{marginLeft: 20}}> Nueva caja</h1>} />
                        
                        <div style={{marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} style={{marginBottom: 20}}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Sucursal</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-filled-label"
                                                id="demo-simple-select-filled"
                                                variant="outlined"
                                                label="Sucursal"
                                                inputProps={{ 'aria-label': 'Sucursal' }}
                                                required
                                                fullWidth
                                                value={ this.state.branchId }
                                                onChange={ event => this.setState({branchId: event.target.value}) }
                                                >
                                                    <MenuItem disabled key={0} value="none">
                                                        <em>Selecciona la sucursal</em>
                                                    </MenuItem>
                                                    {
                                                        this.state.branches.map(branch => 
                                                            <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
                                                        )
                                                    }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Empleado</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-filled-label"
                                                id="demo-simple-select-filled"
                                                variant="outlined"
                                                label="Empleado"
                                                inputProps={{ 'aria-label': 'Empleado' }}
                                                required
                                                fullWidth
                                                value={ this.state.userId }
                                                onChange={ event => this.setState({userId: event.target.value}) }
                                                >
                                                    <MenuItem disabled key={0} value="none">
                                                        <em>Selecciona al empleado</em>
                                                    </MenuItem>
                                                    {
                                                        this.state.users.map(user => 
                                                            <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                                        )
                                                    }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="input-name"
                                            label="Nombre"
                                            placeholder='Caja principal'
                                            autoFocus
                                            helperText="Nombre descriptivo de la caja"
                                            value={ this.state.name }
                                            onChange={ event => this.setState({name: event.target.value}) }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="input-opening_amount"
                                            label="Monto de apertura"
                                            placeholder='100'
                                            name="opening_amount"
                                            helperText="Monto de apertura de la caja"
                                            value={ this.state.openingAmount }
                                            onChange={ event => this.setState({openingAmount: event.target.value}) }
                                            inputProps={{ type: 'number', min: '0', step: '0.5' }}
                                        />
                                    </Grid>
                                </Grid>
                                <div style={{ paddingTop: 50 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Link to='/dashboard/cashiers'>
                                                <Button
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    startIcon={ <IoIosArrowDropleft/> }
                                                >
                                                    Volver
                                                </Button>
                                            </Link> 
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                endIcon={ <IoIosCheckmarkCircle/> }
                                            >
                                                Guardar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(CashiersCreate));