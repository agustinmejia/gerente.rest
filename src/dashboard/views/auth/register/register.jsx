import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Box,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Typography,
    Select,
    MenuItem,
    OutlinedInput,
    InputAdornment,
    IconButton,
    InputLabel,
    FormControl,
    Backdrop,
    CircularProgress,
}from '@material-ui/core';
import { IoIosEye, IoIosEyeOff, IoLogoFacebook, IoLogoGoogle, IoMdArrowBack } from "react-icons/io";
import { Link, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TextFieldCustom } from "../../../components/forms";
import PhoneInput from 'react-phone-input-2'
import es from 'react-phone-input-2/lang/es.json'
import '../../../assets/css/material-input-code-number.css'

import Footer from '../../../../landingpage/components/footer';

import { env } from '../../../../config/env';

const { API, color } = env;


function SignUp(props) {
    const [loading, setLoading] = React.useState(false);
    const [cities, setCities] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [city, setCity] = React.useState('none');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = React.useState('');
    const [password, setpassword] = React.useState('');
    const [showPassword, setshowPassword] = React.useState(false);
    const history = useHistory();

    const handleChangeCity = (event) => {
        setCity(event.target.value);
    };

    useEffect(() => {
        fetch(`${API}/api/cities/list/registers?request=api`)
        .then(res => res.json())
        .then(res => {
            setCities(res.cities);
        })
        .catch(error => ({'error': error}));
    }, []);
    
    const handleRegistre = async (event) => {
        event.preventDefault();
        if(city === 'none'){
            props.enqueueSnackbar('Debes seleccionar una ciudad!', { variant: 'warning' });
            return false;
        }

        if(phone.length < 11 || phone.length > 12){
            props.enqueueSnackbar('Telefono inválido! Ej: +59175199157', { variant: 'error' });
            return false;
        }

        setLoading(true);
        let params = {
            firstName,lastName,companyName,city,phone,email, password
        }
        let register = await fetch(`${API}/api/auth/register`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        })
        .then(res => res.json())
        .catch(error => ({'error': error}));
        setLoading(false);
        if(register.user){
            props.setAuthSession(register);
            await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(register));
            history.push("/dashboard");
        }else{
            props.enqueueSnackbar(register.error, { variant: 'error' });
        }
    }

    return (
        <>
            { loading &&
                <Backdrop open={true} style={{ zIndex: 2 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            <Container maxWidth="sm">
                <div>
                    <Grid container direction="column" justify="center" alignItems="center" style={{marginTop: 20, marginBottom: 50}}>
                        <Grid item>
                            <img src="favicon.ico" style={{width: 100, marginBottom: 20}} />
                        </Grid>
                        <Grid item>
                            <Typography variant="h4">Registrarse</Typography>
                        </Grid>
                         <Grid item>
                            <Typography variant="body2" style={{textAlign: 'center'}}>Rellena el siguiente formulario con el nombre de tu restaurante y tus datos personales para registrarte en nuestra plataforma.</Typography>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleRegistre}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextFieldCustom
                                    autoFocus={true}
                                    required={true}
                                    label="Nombre de tu restaurante"
                                    helperText="Ingresa el nombre de tu restaurante"
                                    name="companyName"
                                    value={ companyName }
                                    onChange={ event => setCompanyName(event.target.value) }
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextFieldCustom
                                    name="firstName"
                                    required={true}
                                    label="Tu(s) nombre(s)"
                                    helperText="Escribe tu nombre o nombres"
                                    value={ firstName }
                                    onChange={ event => setFirstName(event.target.value) }
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextFieldCustom
                                    required={true}
                                    id="lastName"
                                    label="Tus apellidos"
                                    name="lastName"
                                    helperText="Escribe tus apellidos"
                                    value={ lastName }
                                    onChange={ event => setLastName(event.target.value) }
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-city">Ciudad de tu restaurante</InputLabel>
                                    <Select
                                        labelId="outlined-adornment-city"
                                        id="select-city"
                                        variant="outlined"
                                        label="Ciudad de tu restaurante"
                                        inputProps={{ 'aria-label': 'Ciudad de tu restaurante' }}
                                        required
                                        fullWidth
                                        value={ city }
                                        onChange={ handleChangeCity }
                                        >
                                            <MenuItem disabled key={0} value="none">
                                                <em>Selecciona tu ciudad</em>
                                            </MenuItem>
                                            {
                                                cities.map(city => 
                                                    <MenuItem key={city.id} value={city.id}>{city.name} - {city.state}</MenuItem>
                                                )
                                            }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <PhoneInput
                                    country={'bo'}
                                    value={phone}
                                    onChange={ phone => setPhone(phone) }
                                    localization={es}
                                    specialLabel='Tu Nº de celular'
                                    inputProps={{
                                        name: 'phone',
                                        required: 'required',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextFieldCustom
                                    required={true}
                                    id="email"
                                    label="Tu Email"
                                    name="email"
                                    helperText="Escribe tu correo electrónico."
                                    value={ email }
                                    onChange={ event => setEmail(event.target.value) }
                                    inputProps={{ type: 'email', maxLength: 50 }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Contraseña para el sistema</InputLabel>
                                    <OutlinedInput
                                        required
                                        id="outlined-adornment-password"
                                        type={ showPassword ? 'text' : 'password'}
                                        label="Contraseña para el sistema"
                                        fullWidth
                                        value={ password }
                                        onChange={ event => setpassword(event.target.value) }
                                        inputProps={{ maxLength: 20, minLength: 6 }}
                                        endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={ () => setshowPassword(!showPassword) }
                                            edge="end"
                                            >
                                            { showPassword ? <IoIosEyeOff /> : <IoIosEye /> }
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" checked />}
                                    label="Quiero recibir promociones de marketing y actualizaciones por correo electrónico"
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{marginTop: 15}}>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    style={{ backgroundColor: color.primary, color: 'white'}}
                                >
                                    Registrarse
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{textAlign: 'center'}}>O regístrate con tus redes sociales</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    type="button"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    // color="primary"
                                    style={{ backgroundColor: '#3b5998', color: 'white'}}
                                >
                                    Facebook <IoLogoFacebook style={{marginLeft: 10}} size={25} />
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    type="button"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    // color="primary"
                                    style={{ backgroundColor: '#F73929', color: 'white'}}
                                >
                                    Google <IoLogoGoogle style={{marginLeft: 10}} size={25} />
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container style={{marginTop: 30}} justify="flex-end">
                            <Grid item xs>
                                <Link to="/">
                                    <Typography variant="subtitle1"> <IoMdArrowBack size={12} /> Volver al inicio</Typography>
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/login">
                                    <Typography variant="subtitle1">Ya tienes una cuenta?</Typography>
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
            <Footer />
        </>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthSession : (authSession) => dispatch({
            type: 'SET_AUTH_SESSION',
            payload: authSession
        })
    }
}

export default connect(null, mapDispatchToProps)(withSnackbar(SignUp));