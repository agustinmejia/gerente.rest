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
    CircularProgress,
    CardMedia,
    Tooltip,
    IconButton
}from '@material-ui/core';
import { IoIosMenu, IoIosCheckmarkCircle, IoIosArrowDropleft, IoIosCamera } from "react-icons/io";
import { Link } from "react-router-dom";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../config/env';

const { API } = env;

class EmployesCreate extends Component {
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
            firstName: '',
            lastName: '',
            ci: '',
            phone: '',
            address: '',
            branchId: 'none',
            userId: 'none',
            picture: `${API}/images/user.svg`,
            filePicture: null,
            displayCameraPicture: false,
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

    hanldeImage = e => {
        try {
            this.setState({picture: URL.createObjectURL(e.target.files[0]), filePicture: e.target.files[0]})
        } catch (error) {console.log(error)}
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.branchId === 'none' && this.state.userId === 'none'){
            this.props.enqueueSnackbar('Debes seleccionar una sucursal y un empleado', { variant: 'warning' });
            return false;
        }

        this.setState({loading: true});
        let params = {
            first_name: this.state.firstName,
            branch_id: this.state.branchId
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

                        <Navbar title='Nuevo empleado' />
                        
                        <div style={{marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={2}>
                                        <Grid container style={{ cursor: 'pointer', width: 250, height: 150 }} onMouseOver={ event => this.setState({displayCameraPicture: 'flex'})} onMouseLeave={ event => this.setState({displayCameraPicture: 'none'})}>
                                            <CardMedia
                                                style={{ width: 150, height: 150, border: '3px solid white' }}
                                                image={ this.state.picture }
                                                title="Foto de perfil"
                                            />
                                            <input type="file" style={{ display: 'none' }} id="input-avatar" name="image" accept="image/*" onChange={ this.hanldeImage }/>
                                            <div style={{ position: 'relative', top: 40, right: 113, zIndex: 1 }}>
                                                <label htmlFor="input-avatar">
                                                    <Tooltip title="Cambiar foto de perfil">
                                                        <IconButton aria-label="Cambiar foto de perfil" style={{display: this.state.displayCameraPicture}} component="span">
                                                            <IoIosCamera color='white' size={50} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </label>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={10}>
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
                                                    id="input-firstName"
                                                    label="Nombre(s)"
                                                    placeholder='Jhon'
                                                    autoFocus
                                                    helperText="Nombre o nombres del empleado"
                                                    value={ this.state.firstName }
                                                    onChange={ event => this.setState({firstName: event.target.value}) }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="input-lastName"
                                                    label="Apellidos"
                                                    placeholder='Doe Smith'
                                                    name="lastName"
                                                    helperText="Apellidos del empleado"
                                                    value={ this.state.lastName }
                                                    onChange={ event => this.setState({lastName: event.target.value}) }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="input-ci"
                                                    label="CI"
                                                    placeholder='10830572 Bn'
                                                    name="lastName"
                                                    helperText="Cédula de identidad del empleado"
                                                    value={ this.state.ci }
                                                    onChange={ event => this.setState({ci: event.target.value}) }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="input-phone"
                                                    label="Celular"
                                                    placeholder='75199157'
                                                    name="phone"
                                                    helperText="Número de contacto del empleado"
                                                    value={ this.state.phone }
                                                    onChange={ event => this.setState({phone: event.target.value}) }
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={12}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="input-address"
                                                    label="Dirección"
                                                    placeholder='75199157'
                                                    name="address"
                                                    helperText="Dirección del domicilio del empleado"
                                                    value={ this.state.address }
                                                    multiline
                                                    rows={2}
                                                    onChange={ event => this.setState({address: event.target.value}) }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* <div style={{ paddingTop: 100 }}>
                                    <Grid container spacing={2} direction="row" justify="flex-end" style={{position: 'fixed', bottom: 0, right: 0, backgroundColor: 'white', padding: 20, zIndex: 10}}>
                                        <Grid item xs={4} sm={3}>
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
                                        <Grid item xs={4} sm={3}>
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
                                </div> */}
                                <FormButtons back='/dashboard/employes' />
                            </form>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}

const FormButtons = (props) => {
    return(
        <div style={{ paddingTop: 100 }}>
            <Grid container spacing={2} direction="row" justify="flex-end" style={{position: 'fixed', bottom: 0, right: 0, backgroundColor: 'white', padding: 20, zIndex: 10}}>
                <Grid item xs={4} sm={3}>
                    <Link to={ props.back }>
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
                <Grid item xs={4} sm={3}>
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
    );
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(EmployesCreate));