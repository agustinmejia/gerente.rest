import React from 'react';
import {
    Avatar,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Paper,
    Box,
    Grid,
    Typography,
    OutlinedInput,
    InputAdornment,
    IconButton,
    InputLabel,
    FormControl,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { makeStyles } from '@material-ui/core/styles';

import { Link, useHistory } from "react-router-dom";

import { env } from '../../../../config/env';

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { API } = env;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
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
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2016/11/21/16/02/bar-1846137_960_720.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    small: {
        fontSize: 12
    }
}));

function SignInSide(props) {
    const [loading, setLoading] = React.useState(false);
    const classes = useStyles();
    const [email, setEmail] = React.useState('');
    const [password, setpassword] = React.useState('');
    const [showPassword, setshowPassword] = React.useState(false);
    const history = useHistory();
    const [errorMessage, setErrorMessage] = React.useState('');


    const handleLogin = async (event) => {
        setLoading(true);
        event.preventDefault();
        let params = {
            email, password
        }
        let login = await fetch(`${API}/api/auth/login`, {
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
        if(login.user){
            props.setAuthSession(login);
            await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(login));
            history.push("/dashboard");
        }else{
            // console.log(login)
            setErrorMessage(login.error);
        }
    }

  return (
    <>
        { loading &&
            <Backdrop open={true} style={{ zIndex: 2 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }
        <Grid container component="main" className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar} />
                    <Typography component="h1" variant="h4">
                        Iniciar sesión
                    </Typography>
                    <form className={classes.form} onSubmit={handleLogin}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={ email }
                            onChange={ event => setEmail(event.target.value) }
                        />
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
                        { errorMessage && <Alert severity="error" style={{marginTop: 20, marginBottom: 10}}>{ errorMessage }</Alert> }
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Recuerdame"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Iniciar sesión
                        </Button>
                    </form>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/" variant="body2" className={classes.small}>
                                Olvidate tu contraseña?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/register" variant="body2" className={classes.small}>
                                Aún no tienes cuenta?
                            </Link>
                        </Grid>
                    </Grid>
                    <Box mt={5}>
                        <Copyright />
                    </Box>
                </div>
            </Grid>
        </Grid>
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

export default connect(null, mapDispatchToProps)(SignInSide);