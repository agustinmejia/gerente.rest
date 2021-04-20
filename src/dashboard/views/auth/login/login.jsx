import React from 'react';
import {
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Paper,
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

import { IoIosEye, IoIosEyeOff, IoLogoFacebook, IoLogoGoogle } from "react-icons/io";
import { makeStyles } from '@material-ui/core/styles';

import { Link, useHistory } from "react-router-dom";

import { env } from '../../../../config/env';

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { API, color } = env;

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(../img/background.jpeg)',
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
        .catch(error => ({'errorServer': error}));
        setLoading(false);
        if(login.user){
            props.setAuthSession(login);
            await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(login));

            let globalConfig = {
                ...props.globalConfig,
                help: {
                    tips: props.globalConfig.help.tips,
                    tour: false,
                }
            };
            props.setGlobalConfig(globalConfig);
            await AsyncStorage.setItem('sessionGlobalConfig', JSON.stringify(globalConfig));

            history.push("/dashboard");
        }else{
            if(login.error){
                setErrorMessage(login.error);
            }else{
                setErrorMessage('Ocurrió un error en nuestro servidor, intente nuevamente;');
            }
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
                    <Grid container direction="column" justify="center" alignItems="center" style={{ marginBottom: 10}}>
                        <Grid item>
                            <img src="favicon.ico" style={{width: 80, marginBottom: 10}} alt="icon" />
                        </Grid>
                        <Grid item>
                            <Typography variant="h4">Iniciar sesión</Typography>
                        </Grid>
                         <Grid item>
                            <Typography variant="body2" style={{textAlign: 'center'}}>Escribe tu Email y contraseña que creaste para ingresar a nuestra plataforma.</Typography>
                        </Grid>
                    </Grid>
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
                            inputProps={{ type: 'email', maxLength: 50 }}
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                required
                                id="outlined-adornment-password"
                                type={ showPassword ? 'text' : 'password'}
                                label="Contraseña"
                                fullWidth
                                value={ password }
                                onChange={ event => setpassword(event.target.value) }
                                inputProps={{ maxLength: 20 }}
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
                        <Grid container spacing={1} style={{marginTop: 15, marginBottom: 10}}>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    style={{ backgroundColor: color.primary, color: 'white'}}
                                >
                                    Iniciar sesión
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{textAlign: 'center'}}>Ingresa con tus redes sociales</Typography>
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
                    </form>
                    <Grid container>
                        <Grid item xs>
                            <a href={ `${API}/password/reset` }>
                                <Typography variant="body1">Olvidate tu contraseña?</Typography>
                            </a>
                        </Grid>
                        <Grid item>
                            <Link to="/register">
                                <Typography variant="body1">Aún no tienes cuenta?</Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Grid>
    </>
  );
}

const mapStateToProps = (state) => {
    return {
        globalConfig: state.globalConfig,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthSession: (authSession) => dispatch({
            type: 'SET_AUTH_SESSION',
            payload: authSession
        }),
        setGlobalConfig: (globalConfig) => dispatch({
            type: 'SET_GLOBAL_CONFIG',
            payload: globalConfig
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInSide);