import React, { Component } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Backdrop,
    CircularProgress,
    CardMedia,
    Tooltip,
    IconButton,
    OutlinedInput,
    InputAdornment,
    Typography
}from '@material-ui/core';
import { IoIosMenu, IoIosCamera, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { Redirect } from "react-router-dom";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../env';
import { FormButtons } from "../../components/forms";

const { API } = env;

class EmployesCreateEdit extends Component {
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
            redirect: false,
            branches: [],
            roles: [],
            id: this.props.match.params ? this.props.match.params.id : null,
            firstName: '',
            lastName: '',
            ci: '',
            phone: '',
            address: '',
            branchId: 'none',
            roleId: 'none',
            email: '',
            password: '',
            picture: `${API}/images/user.svg`,
            filePicture: null,
            displayCameraPicture: false,
            showPassword: false
        }
    }

    componentDidMount(){
        // Get branches company
        let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/branches/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            this.setState({branches: res.branches}, () => {
                // Si solo hay una sucursal la seleccionamos por defecto
                if(res.branches.length == 1){
                    this.setState({branchId: res.branches[0].id});
                }
            });
        })
        .catch(error => ({'error': error}));

        // Get roles list
        fetch(`${API}/api/roles/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            this.setState({roles: res.roles});
        })
        .catch(error => ({'error': error}));

        // If edit get data employe
        let { id } = this.state;
        if(id){
            this.setState({loading: true})
            fetch(`${API}/api/employe/${id}`, {headers: this.state.headers})
            .then(res => res.json())
            .then(res => {
                if(res.employe){
                    this.setState({
                        firstName: res.employe.person.first_name,
                        lastName: res.employe.person.last_name,
                        ci: res.employe.person.ci_nit ? res.employe.person.ci_nit : '',
                        phone: res.employe.person.phone,
                        address: res.employe.person.address ? res.employe.person.address : '',
                        branchId: res.employe.branch.id,
                        roleId: res.employe.user.roles[0].id,
                        email: res.employe.user.email,
                        picture: res.employe.user.avatar ? `${API}/storage/${res.employe.user.avatar}` : this.state.picture
                    });
                }
            })
            .catch(error => ({'error': error}))
            .then(() => this.setState({loading: false}));
        }
    }

    hanldeImage = e => {
        try {
            this.setState({picture: URL.createObjectURL(e.target.files[0]), filePicture: e.target.files[0]})
        } catch (error) {console.log(error)}
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.branchId === 'none' || this.state.roleId === 'none'){
            this.props.enqueueSnackbar('Debes seleccionar una sucursal y un rol', { variant: 'warning' });
            return false;
        }

        if(this.state.password.length < 6 && !this.state.id){
            this.props.enqueueSnackbar('Tu contraseña debe tener al menos 6 letras o números', { variant: 'warning' });
            return false;
        }

        this.setState({loading: true});
        let { company } = this.props.authSession;
        let formData = new FormData();
        let { id, filePicture, firstName, lastName, ci, phone, address, branchId, roleId, email, password } = this.state;

        formData.append('image', filePicture);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("ci", ci);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("branch_id", branchId);
        formData.append("role_id", roleId);
        formData.append("email", email);
        formData.append("password", password);

        // Change URL for update or create
        let url = id ? `${API}/api/employe/${id}/update` : `${API}/api/company/${company.id}/employes/create`;
        axios({
            method: 'post',
            url,
            data: formData,
            headers: this.state.headers
        })
        .then(res => {
            let { data } = res;
            if(data.employe){
                this.props.enqueueSnackbar(`Empleado ${this.state.id ? 'editado' : 'registrado'} correctamente.`, { variant: 'success' });
            }else{
                this.props.enqueueSnackbar(data.error, { variant: 'error' });
            }
        })
        .catch((err) => this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor!', { variant: 'error' }))
        .then(() => this.setState({loading: false, redirect: true}));
    }

    render() {
        if (this.state.redirect) {
           return <Redirect to='/dashboard/branches'/>;
        }
        
        return (
            <>
                { this.state.loading &&
                    <Backdrop open={true} style={{ zIndex: 20 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
                <div className='app'>
                    <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                    <main style={{paddingTop: 10}}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>

                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> { this.state.id ? 'Editar' : 'Nuevo' } empleado</h1>} />
                        
                        <Paper style={{ backgroundColor: 'white', padding: 30, marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2}   direction="row" justify="center" alignItems="flex-start">
                                    <Grid item xs={12} sm={3}>
                                        <Grid container style={{ cursor: 'pointer', width: 250, height: 150 }} onMouseOver={ event => this.setState({displayCameraPicture: 'flex'})} onMouseLeave={ event => this.setState({displayCameraPicture: 'none'})}>
                                            <CardMedia
                                                style={{ width: 150, height: 150, borderRadius: 75, border: '3px solid white' }}
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
                                    <Grid item xs={12} sm={9}>
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
                                                    <InputLabel htmlFor="outlined-adornment-password">Rol</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-filled-label"
                                                        id="demo-simple-select-filled"
                                                        variant="outlined"
                                                        label="Rol"
                                                        inputProps={{ 'aria-label': 'Rol' }}
                                                        required
                                                        fullWidth
                                                        value={ this.state.roleId }
                                                        onChange={ event => this.setState({roleId: event.target.value}) }
                                                        >
                                                            <MenuItem disabled key={0} value="none">
                                                                <em>Selecciona su rol</em>
                                                            </MenuItem>
                                                            {
                                                                this.state.roles.map(role => 
                                                                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
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
                                                    // required
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
                                            <div style={{margin:10, marginTop: 20}}>
                                                <Grid container alignItems="center">
                                                    <Grid item xs>
                                                        <Typography gutterBottom variant="h6">Datos de inicio de sesión</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Typography color="textSecondary" variant="body2">
                                                    Debe proporcionar un correo electrónico y contraseña para que su empleado pueda ingresar al sistema y hacer uso del mismo.
                                                </Typography>
                                            </div>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Email"
                                                    name="email"
                                                    helperText="Email con el que su empleado podrá ingresar al sistema"
                                                    value={ this.state.email }
                                                    onChange={ event => this.setState({email: event.target.value}) }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-password"
                                                        type={ this.state.showPassword ? 'text' : 'password'}
                                                        label="Contraseña"
                                                        fullWidth
                                                        required={ this.state.id ? false : true }
                                                        value={ this.state.password }
                                                        onChange={ event => this.setState({password: event.target.value}) }
                                                        inputProps={{ minLength: '6', maxLength: '20' }}
                                                        endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={ () => this.setState({showPassword: !this.state.showPassword}) }
                                                                edge="end"
                                                            >
                                                            { this.state.showPassword ? <IoIosEyeOff /> : <IoIosEye /> }
                                                            </IconButton>
                                                        </InputAdornment>
                                                        }
                                                    />
                                                    {
                                                        this.state.id && <small style={{marginTop: 3, marginLeft: 14, color: '#757575'}}>Deja la contraseña en blanco para mantener la misma.</small>
                                                    }
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <FormButtons back='/dashboard/employes' titleSuccess={ this.state.id ? 'Actualizar' : 'Guardar' } />
                            </form>
                        </Paper>
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

export default connect(mapStateToProps)(withSnackbar(EmployesCreateEdit));