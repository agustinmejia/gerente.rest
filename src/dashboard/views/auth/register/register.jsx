import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Box, Avatar, Button, TextField, FormControlLabel, Checkbox, Typography, Select, MenuItem, OutlinedInput, InputAdornment, IconButton, InputLabel, FormControl
}from '@material-ui/core';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PhoneInput from 'react-phone-input-2'
import es from 'react-phone-input-2/lang/es.json'
import '../../../assets/css/material-input-code-number.css'

import { env } from '../../../../config/env';

const { API } = env;


function Copyright() {
  return (
    <Typography color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // fontSize: 20
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    small: {
        fontSize: 12
    }
}));


function SignUp(props) {
    const classes = useStyles();
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
        if(register.user){
            props.setAuthSession(register);
            await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(register));
            history.push("/dashboard");
        }else{
            console.log(register)
        }
    }

    return (
        <Container maxWidth="sm">
            <div className={classes.paper}>
                <Avatar className={classes.avatar} />
                <Typography variant="h4">
                    Registrarse
                </Typography>
                <form className={classes.form} onSubmit={handleRegistre}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Nombre(s)"
                                autoFocus
                                value={ firstName }
                                onChange={ event => setFirstName(event.target.value) }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Apellidos"
                                name="lastName"
                                value={ lastName }
                                onChange={ event => setLastName(event.target.value) }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="companyName"
                                label="Nombre de tu restaurante"
                                name="companyName"
                                value={ companyName }
                                onChange={ event => setCompanyName(event.target.value) }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Ciudad</InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    variant="outlined"
                                    label="Ciudad"
                                    inputProps={{ 'aria-label': 'Ciudad' }}
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
                                onChange={ code => setPhone(code) }
                                localization={es}
                                specialLabel='Nº de celular'
                                inputProps={{
                                    name: 'phone',
                                    required: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                value={ email }
                                onChange={ event => setEmail(event.target.value) }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={ showPassword ? 'text' : 'password'}
                                    label="Contraseña"
                                    fullWidth
                                    value={ password }
                                    onChange={ event => setpassword(event.target.value) }
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={ () => setshowPassword(!showPassword) }
                                        // onMouseDown={handleMouseDownPassword}
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
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Registrarse
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login" className="btn btn-link">
                                Ya tienes una cuenta?
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
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

export default connect(null, mapDispatchToProps)(SignUp);