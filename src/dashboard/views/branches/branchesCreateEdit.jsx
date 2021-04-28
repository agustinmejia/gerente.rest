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
    CircularProgress
}from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { IoIosMenu } from "react-icons/io";
import { Redirect } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { FormButtons } from "../../components/forms";
import { env } from '../../../env';

const { API, services, location } = env;

const containerStyle = {
    height: 350, width: '100%', marginTop: 50
};

class BranchesCreateEdit extends Component {
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
            id: this.props.match.params.id,
            cities: [],
            ownerId: this.props.authSession.company.owner_id,
            name: '',
            city: 'none',
            phones: '',
            address: '',
            // Map
            center: {
                lat: location.latitude, lng: location.longitude
            },
            marker: null
        }
    }

    componentDidMount(){
        fetch(`${API}/api/cities/list/registers?request=api`)
        .then(res => res.json())
        .then(res => {
            this.setState({cities: res.cities});
        })
        .catch(error => ({'error': error}));

        // If edit get data product
        if(this.state.id){
            fetch(`${API}/api/branch/${this.state.id}`, {headers: this.state.headers})
            .then(res => res.json())
            .then(res => {
                let { branch } = res;
                this.setState({
                    name: branch.name,
                    city: branch.city_id ? branch.city_id : 'none',
                    phones: branch.phones,
                    address: branch.address
                });
                
                // Set location
                if(branch.location != null){
                    let location = JSON.parse(branch.location);
                    this.setState({
                        center: location,
                        marker: location
                    });
                }
            })
            .catch(error => ({'error': error}));
        }
    }

    onMapLoad = map => {
        navigator?.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                const pos = { lat, lng };
                if(!this.state.id || this.state.marker == null){
                    this.setState({ center: pos, marker: pos });
                }
            }
        );
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.city === 'none'){
            this.props.enqueueSnackbar('Debes seleccionar una ciudad!', { variant: 'warning' });
            return false;
        }

        let { id, ownerId, name, city, center, phones, address } = this.state;

        // Change URL for update or create
        let url = id ? `${API}/api/branch/${id}/update` : `${API}/api/branch/create`;

        this.setState({loading: true});
        let params = {
            ownerId, name, city, location: center, phones, address
        }
        axios({
            method: 'post',
            url,
            data: params,
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.branch){
                this.props.enqueueSnackbar(`Sucursal ${this.state.id ? 'editada' : 'registrada'} correctamente!`, { variant: 'success' });
            }else{
                this.props.enqueueSnackbar('Ocurrió un error inesparado, intente nuevamente!', { variant: 'error' })
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

                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> { this.state.id ? 'Editar' : 'Nueva' } sucursal</h1>} />
                        
                        <Paper style={{ backgroundColor: 'white', padding: 30, marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="input-name"
                                            label="Nombre de la sucursal"
                                            placeholder='Sucursal 2'
                                            autoFocus
                                            helperText="Escribe el nombre de la sucursal."
                                            value={ this.state.name }
                                            onChange={ event => this.setState({name: event.target.value}) }
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
                                                value={ this.state.city }
                                                onChange={ event => this.setState({city: event.target.value}) }
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
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="input-phones"
                                            label="Telefono(s)"
                                            placeholder='462 5656 - 75199157'
                                            name="phones"
                                            helperText="Telefonos de contacto de la sucursal"
                                            value={ this.state.phones }
                                            onChange={ event => this.setState({phones: event.target.value}) }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="input-address"
                                            label="Dirección de la sucursal"
                                            name="address"
                                            placeholder='Av. 18 de nov. Esq. Libertad Nro 123'
                                            helperText="Escribe la dirección de la sucursal."
                                            value={ this.state.address }
                                            onChange={ event => this.setState({address: event.target.value}) }
                                        />
                                    </Grid>
                                </Grid>
                                <div style={{ height: 350, width: '100%', marginTop: 50 }}>
                                    <Alert severity="info">
                                        <AlertTitle>Información</AlertTitle>
                                        Para seleccionar otra ubicación arrastre el marcador del mapa hacia la ubicación de su <strong>Restaurante!</strong>
                                    </Alert>
                                    <LoadScript
                                        googleMapsApiKey={ services.googleMaps }
                                        language='es'
                                        onLoad={ this.onMapLoad }
                                    >
                                        <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={ this.state.center }
                                        zoom={14}
                                        >
                                        { /* Child components, such as markers, info windows, etc. */ }
                                        <>
                                            {
                                                this.state.marker != null &&
                                                <Marker
                                                    position={ this.state.marker }
                                                    draggable
                                                    onDragEnd={ e => {
                                                        let center = {
                                                            lat: e.latLng.lat(),
                                                            lng: e.latLng.lng()
                                                        }
                                                        this.setState({center});
                                                    } }
                                                />
                                            }
                                        </>
                                        </GoogleMap>
                                    </LoadScript>

                                </div>
                                <FormButtons back='/dashboard/branches' titleSuccess={ this.state.id ? 'Actualizar' : 'Guardar' } />
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

export default connect(mapStateToProps)(withSnackbar(BranchesCreateEdit));