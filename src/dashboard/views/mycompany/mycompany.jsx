import React, { Component } from 'react';
import {
    Grid, TextField, Select, MenuItem, Card, CardActionArea, CardMedia, Button, IconButton, Backdrop, CircularProgress
} from '@material-ui/core';
import { IoIosMenu, IoMdCreate, IoIosCamera } from "react-icons/io";

import axios from "axios";
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

import { env } from '../../../config/env';
const { API } = env;

class MyCompany extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            loading: false,
            displayCameraLogo: 'none',
            banner: `${API}/images/default-image.png`,
            logo: `${API}/images/logo.png`,
            sidebarToggled: false,
            cities: [],
            imputCompanyID: null,
            imputCompanyName: 'Mi restaurante',
            inputSlogan: '',
            selectCity: 'none',
            inputPhones: '',
            inputAddress: '',
            inputBanner: null,
            inputLogo: null,
            inputSmallDescription: ''
        }

        this.myForm = React.createRef();
    }

    componentDidMount(){
        
        // Get cities
        axios.get(`${API}/api/cities/list/registers?request=api`)
        .then(response => {
            let { cities } = response.data;
            this.setState({
                cities
            });
        })
        
        // Get company info
        let auth = this.props.authSession;
        let options = {
            headers: this.state.headers
        }
        axios.get(`${API}/api/company/owner/${auth.user.owner.id}`, options)
        .then(response => {
            let { company } = response.data;
            this.setState({
                imputCompanyID: company.id,
                imputCompanyName: company.name,
                inputSlogan: company.slogan,
                selectCity: company.city_id,
                inputPhones: company.phones,
                inputAddress: company.address,
                inputSmallDescription: company.small_description
            });

            if(company.logos){
                this.setState({logo: `${API}/storage/${company.logos.replace('.', '-cropped.')}`});
            }
            if(company.banners){
                this.setState({banner: `${API}/storage/${company.banners}`});
            }
        })
        .catch(error => {
            // handle error
            console.log(error);
        })

    }

    handleChangeImage(event, name){
        this.setState({loading: true});
        let auth = this.props.authSession;
        let file = event.target.files[0];

        let formData = new FormData();
        formData.append(name, file);
        formData.append("id", this.state.imputCompanyID);

        axios({
            method: 'post',
            url: `${API}/api/company/owner/${auth.user.owner.id}/update/images`,
            data: formData,
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.logo){
                this.setState({logo: `${API}/storage/${res.data.logo.replace('.', '-cropped.')}`});
                this.props.enqueueSnackbar('Logo actualizado correctamente!', { variant: 'success' });
            }
            if(res.data.banner){
                this.setState({banner: `${API}/storage/${res.data.banner}`});
                this.props.enqueueSnackbar('Banner actualizado correctamente!', { variant: 'success' });
            }
        })
        .catch((err) => alert("File Upload Error"))
        .then(() => this.setState({loading: false}));
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        let auth = this.props.authSession;
        let params = {
            id: this.state.imputCompanyID,
            name: this.state.imputCompanyName,
            slogan: this.state.inputSlogan,
            city_id: this.state.selectCity,
            phones: this.state.inputPhones,
            address: this.state.inputAddress,
            small_description: this.state.inputSmallDescription
        }
        axios({
            method: 'post',
            url: `${API}/api/company/owner/${auth.user.owner.id}/update`,
            data: params,
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.company){
                this.props.enqueueSnackbar('Datos actualizados correctamnete!', { variant: 'success' });
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
                    <main style={{ paddingBottom: 50 }}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>
                        <Navbar/>
                        <header style={{ paddingLeft: 30 }}>
                            <h1>{ this.state.imputCompanyName ? this.state.imputCompanyName : 'Mi restaurante' }</h1>
                        </header>
                        <Grid style={{ marginTop: -100 }}>
                            <form>
                                <input accept="image/*" style={{ display: 'none' }} id="input-banner" type="file" onChange={ event => this.handleChangeImage(event, 'banner') } />
                                <input accept="image/*" style={{ display: 'none' }} id="input-logo" type="file" onChange={ event => this.handleChangeImage(event, 'logo') } />
                            </form>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', bottom: -90, paddingRight: 10, zIndex: 1 }}>
                                <label htmlFor="input-banner">
                                    <IconButton aria-label="upload picture" component="span">
                                        <IoIosCamera color='white' size={50} />
                                    </IconButton>
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
                            <Grid container style={{ position: 'relative', bottom: 40, cursor: 'pointer', width: 200 }} onMouseOver={ event => this.setState({displayCameraLogo: 'flex'})} onMouseLeave={ event => this.setState({displayCameraLogo: 'none'})}>
                                <CardMedia
                                    style={{ width: 120, height: 120, position: 'relative', bottom: 100, left: 20, zIndex: 1, border: '3px solid white' }}
                                    image={ this.state.logo }
                                    title="Logo de Company name"
                                />
                                <div style={{ position: 'relative', bottom: 78, right: 78, zIndex: 1 }}>
                                    <label htmlFor="input-logo">
                                        <IconButton aria-label="upload picture" style={{display: this.state.displayCameraLogo}} component="span">
                                            <IoIosCamera color='white' size={50} />
                                        </IconButton>
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="input-slogan"
                                        label="Slogan"
                                        placeholder="El cliente primero..."
                                        helperText="Frase corta que describe a tu restaurante"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={ this.state.inputSlogan }
                                        onChange={ event => this.setState({inputSlogan: event.target.value}) }
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="input-address"
                                        label="Dirección"
                                        placeholder="Av. 18 de nov nro 123"
                                        helperText="Dirección de tu(s) sucursal(es)"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        style={{ marginTop: 0}}
                                        multiline
                                        rows={2}
                                        value={ this.state.inputAddress }
                                        onChange={ event => this.setState({inputAddress: event.target.value}) }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="input-small-description"
                                        label="Descripción corta"
                                        placeholder="La mejor opción a la hora de degustar de un platillo de tu predilección."
                                        helperText="Describe de manera breve tu restaurante"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        style={{ marginTop: 0}}
                                        multiline
                                        rows={2}
                                        value={ this.state.inputSmallDescription }
                                        onChange={ event => this.setState({inputSmallDescription: event.target.value}) }
                                    />
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    endIcon={<IoMdCreate />}
                                >
                                    Actualizar datos
                                </Button>
                            </Grid>
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

export default connect(mapStateToProps)(withSnackbar(MyCompany));