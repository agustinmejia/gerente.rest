import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Box, Avatar, Button, TextField, FormControlLabel, Checkbox, Typography, Select, MenuItem
}from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useHistory } from "react-router-dom";

import PhoneInput from 'react-phone-input-2'
import es from 'react-phone-input-2/lang/es.json'
import '../../../assets/css/material-input-code-number.css'

import { env } from '../../../../config/env'

const URL = env.API;


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


export default function SignUp() {
    const classes = useStyles();
    const [cities, setCities] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [city, setCity] = React.useState('none');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = React.useState('');
    const [password, setpassword] = React.useState('');
    const history = useHistory();

    const handleChangeCity = (event) => {
        setCity(event.target.value);
    };

    useEffect(() => {
        fetch(`${URL}/api/cities/list/registers?request=api`)
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
        let register = await fetch(`${URL}/api/auth/register`, {
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
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                variant="outlined"
                                // label="Ciudad"
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
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                value={ password }
                                onChange={ event => setpassword(event.target.value) }
                            />
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