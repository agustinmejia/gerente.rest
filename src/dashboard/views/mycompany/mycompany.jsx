import React, { Component } from 'react';
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    Card,
    CardActionArea,
    CardMedia,
    Button,
    IconButton,
    Tooltip,
    Backdrop,
    CircularProgress
} from '@material-ui/core';
import { IoIosMenu, IoMdCreate, IoIosCamera } from "react-icons/io";
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "axios";
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import Tour from 'reactour';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

import { env } from '../../../config/env';
const { API, color } = env;

const steps = [
    {
        selector: '.banner-step',
        content: 'Presiona el siguiente botón para agregar/cambiar el banner de tu restaurante.',
    },
    {
        selector: '.logo-step',
        content: 'Presiona el siguiente botón para agregar/cambiar el logo de tu restaurante.',
    },
    {
        selector: '.name-step',
        content: 'Puedes editar el nombre de tu restaurante cuendo desees.',
    },
    {
        selector: '.slogan-step',
        content: 'Escribe el slogan de tu negocio, cómo por ejemplo: La mejor atención al mejor precio!. (No obligatorio)',
    },
    {
        selector: '.city-step',
        content: 'Actualiza la ubicación de tu restaurante.',
    },
    {
        selector: '.phone-step',
        content: 'Proporciona tus telefonos de contacto para que tus clientes puedan comunicarse contigo. (No obligatorio)',
    },
    {
        selector: '.address-step',
        content: 'Escribe la dirección de tu restaurante. (No obligatorio)',
    },
    {
        selector: '.description-step',
        content: 'Escribe una descripción corta de tu restaurante con el fín de hacerte conocer con tus posibles clientes. (No obligatorio)',
    },
    {
        selector: '.save-step',
        content: 'Por último, para que los cambios se guarden debes presionar el siguiente botón.',
    }
];


class MyCompany extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            tourActive: false,
            loading: false,
            banner: `${API}/images/default-image.png`,
            logo: `${API}/images/logo.png`,
            sidebarToggled: false,
            cities: [],
            imputCompanyName: 'Mi restaurante',
            inputSlogan: '',
            selectCity: 'none',
            inputPhones: '',
            inputAddress: '',
            inputBanner: null,
            inputLogo: null,
            inputShortDescription: ''
        }

        this.myForm = React.createRef();
    }

    componentDidMount(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if(urlParams.get('tour') == 1){
            this.setState({tourActive: true});
        }

        // Get cities
        axios.get(`${API}/api/cities/list/registers?request=api`)
        .then(response => {
            let { cities } = response.data;
            this.setState({
                cities
            });
        })
        
        // Get company info
        let { company } = this.props.authSession;
        this.setState({
            imputCompanyName: company.name,
            inputSlogan: company.slogan ? company.slogan : '',
            selectCity: company.city_id,
            inputPhones: company.phones ? company.phones : '',
            inputAddress: company.address ? company.address : '',
            inputShortDescription: company.short_description ? company.short_description : ''
        });

        if(company.logos){
            this.setState({logo: `${API}/storage/${company.logos.replace('.', '-cropped.')}`});
        }
        if(company.banners){
            this.setState({banner: `${API}/storage/${company.banners}`});
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        let { company } = this.props.authSession;
        let params = {
            name: this.state.imputCompanyName,
            slogan: this.state.inputSlogan,
            city_id: this.state.selectCity,
            phones: this.state.inputPhones,
            address: this.state.inputAddress,
            short_description: this.state.inputShortDescription
        }
        axios({
            method: 'post',
            url: `${API}/api/company/${company.id}/update`,
            data: params,
            headers: this.state.headers
        })
        .then(async res => {
            if(res.data.company){
                let { company } = res.data;
                let authSession = {
                    ...this.props.authSession,
                    company
                };
                this.props.setAuthSession(authSession);
                await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(authSession));
                this.props.enqueueSnackbar('Datos actualizados correctamente!', { variant: 'success' });
            }else{
                this.props.enqueueSnackbar('Ocurrió un error inesparado, intente nuevamente!', { variant: 'error' })
            }
        })
        .catch((err) => this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor!', { variant: 'error' }))
        .then(() => this.setState({loading: false}));
    }

    handleChangeImage(event, name){
        this.setState({loading: true});
        let { company } = this.props.authSession;
        let file = event.target.files[0];

        let formData = new FormData();
        formData.append(name, file);

        axios({
            method: 'post',
            url: `${API}/api/company/${company.id}/update/images`,
            data: formData,
            headers: this.state.headers
        })
        .then(async res => {
            let { company } = res.data;
            let authSession = {
                ...this.props.authSession,
                company
            };
            this.props.setAuthSession(authSession);
            await AsyncStorage.setItem('sessionAuthSession', JSON.stringify(authSession));

            if(company.logos){
                this.setState({logo: `${API}/storage/${company.logos.replace('.', '-cropped.')}`});
                this.props.enqueueSnackbar('Logo actualizado correctamente!', { variant: 'success' });
            }
            if(company.banners){
                this.setState({banner: `${API}/storage/${company.banners}`});
                this.props.enqueueSnackbar('Banner actualizado correctamente!', { variant: 'success' });
            }
        })
        .catch((err) => alert("File Upload Error"))
        .then(() => this.setState({loading: false}));
    }

    render() {
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

                        <Navbar title={<h1 style={{marginLeft: 20}}> { this.state.imputCompanyName ? this.state.imputCompanyName : 'Mi restaurante' }</h1>} />

                        <Grid style={{ marginTop: -60 }}>
                            <form>
                                <input accept="image/*" style={{ display: 'none' }} id="input-banner" type="file" onChange={ event => this.handleChangeImage(event, 'banner') } />
                                <input accept="image/*" style={{ display: 'none' }} id="input-logo" type="file" onChange={ event => this.handleChangeImage(event, 'logo') } />
                            </form>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', bottom: -90, paddingRight: 10, zIndex: 1 }} >
                                <label htmlFor="input-banner">
                                    <Tooltip title="Click para cambiar banner">
                                        <IconButton aria-label="Click para cambiar banner" component="span" className="banner-step">
                                            <IoIosCamera color='white' size={50} />
                                        </IconButton>
                                    </Tooltip>
                                </label>
                            </div>
                            <Card>
                                <CardActionArea>
                                    <CardMedia
                                        style={{ height: 350 }}
                                        image={ this.state.banner }
                                        title="Banner de Company name"
                                    />
                                </CardActionArea>
                            </Card>
                            <Grid container style={{ position: 'relative', bottom: 40, cursor: 'pointer', width: 200 }} >
                                <CardMedia
                                    style={{ width: 120, height: 120, position: 'relative', bottom: 100, left: 20, zIndex: 1, border: '3px solid white' }}
                                    image={ this.state.logo }
                                    title="Logo de Company name"
                                />
                                <div style={{ position: 'relative', bottom: 78, right: 78, zIndex: 1 }}>
                                    <label htmlFor="input-logo">
                                        <Tooltip title="Click para cambiar logo">
                                            <IconButton aria-label="Click para cambiar logo" component="span" className="logo-step" >
                                                <IoIosCamera color='white' size={50} />
                                            </IconButton>
                                        </Tooltip>
                                    </label>
                                </div>
                            </Grid>
                        </Grid>
                        <form onSubmit={ this.handleSubmit }>
                            <Grid container spacing={2} style={{ marginTop: -80 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="input-name"
                                        label="Nombre de tu restaurante *"
                                        placeholder="La clave"
                                        helperText="Nombre de tu restaurante"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={ this.state.imputCompanyName }
                                        onChange={ event => this.setState({imputCompanyName: event.target.value}) }
                                        className="name-step"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="input-slogan"
                                        label="Slogan de tu restaurante"
                                        placeholder="El cliente primero..."
                                        helperText="Escribe una frase corta que describa a tu restaurante."
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={ this.state.inputSlogan }
                                        onChange={ event => this.setState({inputSlogan: event.target.value}) }
                                        className="slogan-step"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        labelId="select-city"
                                        id="demo-simple-select-filled"
                                        variant="outlined"
                                        // label="Ciudad"
                                        inputProps={{ 'aria-label': 'Ciudad' }}
                                        required
                                        fullWidth
                                        value={ this.state.selectCity }
                                        onChange={ event => this.setState({selectCity: event.target.value}) }
                                        className="city-step"
                                        >
                                            <MenuItem disabled key={0} value="none">
                                                <em>Selecciona tu ciudad</em>
                                            </MenuItem>
                                            {
                                                this.state.cities.map(city => 
                                                    <MenuItem key={city.id} value={city.id}>{city.name} - {city.state}</MenuItem>
                                                )
                                            }
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="input-phones"
                                        label="Telefonos de contacto"
                                        placeholder="462 4545 - 75199157"
                                        helperText="Números de telefono o celular para atención al cliente separados por -"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        style={{ marginTop: 0}}
                                        value={ this.state.inputPhones }
                                        onChange={ event => this.setState({inputPhones: event.target.value}) }
                                        className="phone-step"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="input-address"
                                        label="Dirección del restaurante"
                                        placeholder="Av. 18 de nov nro 123"
                                        helperText="Escribe la dirección de tu restaurante Ej: Av. Av. 18 de nov nro 123."
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        style={{ marginTop: 0}}
                                        multiline
                                        rows={2}
                                        value={ this.state.inputAddress }
                                        onChange={ event => this.setState({inputAddress: event.target.value}) }
                                        className="address-step"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="input-small-description"
                                        label="Descríbenos tu restaurante"
                                        placeholder="La mejor opción a la hora de degustar de un platillo de tu predilección."
                                        helperText="Describe de manera breve tu restaurante"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        style={{ marginTop: 0}}
                                        multiline
                                        rows={2}
                                        value={ this.state.inputShortDescription }
                                        onChange={ event => this.setState({inputShortDescription: event.target.value}) }
                                        className="description-step"
                                    />
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<IoMdCreate />}
                                    style={{marginTop: 30}}
                                    className="save-step"
                                >
                                    Actualizar datos
                                </Button>
                            </Grid>
                        </form>
                    </main>
                </div>

                <Tour
                    steps={ steps }
                    isOpen={ this.state.tourActive }
                    accentColor={ color.primary }
                    onRequestClose={() => this.setState({tourActive: false})}
                />

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

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(MyCompany));