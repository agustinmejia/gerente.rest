import React, { Component } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Select,
    Button,
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
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../config/env';
import { FormButtons } from "../../components/forms";

const { API, color } = env;

class Profile extends Component {
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
            id: null,
            firstName: this.props.authSession,
            lastName: '',
            ci: '',
            phone: '',
            address: '',
            email: '',
            password: '',
            picture: `${API}/images/user.svg`,
            filePicture: null,
            showPassword: false
        }
    }

    componentDidMount(){
        // If edit get data employe
        const { user } = this.props.authSession;
        const { person } = user.owner ? user.owner : user.employe;
        this.setState({
            id: user.id,
            firstName: person.first_name,
            lastName: person.last_name,
            ci: person.ci_nit ? person.ci_nit : '',
            phone: person.phone ? person.phone : '',
            address: person.address ? person.address : '',
            email: user.email,
            picture: `${API}/storage/${user.avatar}`
        });
    }

    hanldeImage = e => {
        try {
            this.setState({picture: URL.createObjectURL(e.target.files[0]), filePicture: e.target.files[0]})
        } catch (error) {console.log(error)}
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.password.length > 0 && this.state.password.length < 6){
            this.props.enqueueSnackbar('Tu contraseña debe tener al menos 6 letras o números', { variant: 'warning' });
            return false;
        }

        this.setState({loading: true});
        let { company } = this.props.authSession;
        let formData = new FormData();
        let { id, filePicture, firstName, lastName, ci, phone, address, email, password } = this.state;

        formData.append('image', filePicture);
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("ci", ci);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("email", email);
        formData.append("password", password);

        axios({
            method: 'post',
            url: `${API}/api/config/profile/${id}/update`,
            data: formData,
            headers: this.state.headers
        })
        .then(async res => {
            let { data } = res;
            if(data.profile){
                let authSession = {
                    ...this.props.authSession,
                    user: data.profile
                };

                this.props.setAuthSession(authSession);
                await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(authSession));

                this.props.enqueueSnackbar(`Información de perfil actualizada correctamente.`, { variant: 'success' });
            }else{
                this.props.enqueueSnackbar(data.error, { variant: 'error' });
            }
        })
        .catch((err) => this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor!', { variant: 'error' }))
        .then(() => this.setState({loading: false}));
    }

    render() {
        let { user } = this.props.authSession;
        let role = 'Desconocido';
        if(user){
            if(user.owner){
                role = 'Propietario';
            }else if(user.employe){
                if(user.roles.length > 0){
                    role = user.roles[0].name;
                }
            }
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

                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Perfil de usuario</h1>} />
                        
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2} direction="row" justify="center" alignItems="flex-start">
                                    <Grid item xs={12} sm={4}>
                                        <Paper style={{ backgroundColor: 'white', padding: 30, paddingBottom: 40, marginTop: 50}}>
                                            <Grid container direction="column" justify="center" alignItems="center">
                                                <Grid item xs={12}>
                                                    <CardMedia
                                                        style={{ width: 200, height: 200, borderRadius: 100, border: `3px solid ${color.primary}` }}
                                                        image={ this.state.picture }
                                                        title="Foto de perfil"
                                                    />
                                                </Grid>
                                                <Grid item style={{ marginTop: 10 }}>
                                                    <Typography variant="h6">{ `${this.state.firstName} ${ this.state.lastName ? this.state.lastName : '' }` }</Typography>
                                                    <Typography variant="subtitle2" style={{ textAlign: 'center', color: 'rgba(0,0,0,0.7)', textTransform: 'capitalize' }}>{ role }</Typography>
                                                </Grid>
                                                <Grid item xs={12} style={{ marginTop: 20 }}>
                                                    <input type="file" style={{ display: 'none' }} id="input-avatar" name="image" accept="image/*" onChange={ this.hanldeImage }/>
                                                    <label htmlFor="input-avatar">
                                                        <Tooltip title="Cambiar foto de perfil">
                                                            <IconButton aria-label="Cambiar foto de perfil" component="span">
                                                                <IoIosCamera color='white' size={50} color={ color.primary } />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </label>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Paper style={{ backgroundColor: 'white', padding: 30, paddingTop: 10, marginTop: 50}}>
                                            <Grid container spacing={2}>
                                                <div style={{ margin: 20, marginBottom: 30 }}>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs>
                                                            <Typography gutterBottom variant="h6">Datos personales</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Typography color="textSecondary" variant="body2">
                                                        Puedes modificar tus datos personales registrados en nuestra plataforma.
                                                    </Typography>
                                                </div>
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
                                            </Grid>
                                        </Paper>

                                        <Paper style={{ backgroundColor: 'white', padding: 30, paddingTop: 10, marginTop: 30}}>
                                            <Grid container spacing={2}>
                                                <div style={{margin:10, marginTop: 20, marginBottom: 30}}>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs>
                                                            <Typography gutterBottom variant="h6">Datos de inicio de sesión</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Typography color="textSecondary" variant="body2">
                                                        Datos de usuario que sirven para que inicies sesión en nuestra plataforma.
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
                                                        <small style={{marginTop: 3, marginLeft: 14, color: '#757575'}}>Deja la contraseña en blanco para mantener la misma.</small>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <FormButtons back='/dashboard' titleSuccess="Actualizar" />
                            </form>
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

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthSession : (authSession) => dispatch({
            type: 'SET_AUTH_SESSION',
            payload: authSession
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Profile));