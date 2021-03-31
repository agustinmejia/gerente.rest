import React, { Component } from 'react';
import {
    Grid,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Backdrop,
    CircularProgress
}from '@material-ui/core';
import { IoIosMenu, IoIosCheckmarkCircle, IoIosArrowDropleft } from "react-icons/io";
import { Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { FormButtons } from "../../components/forms";
import { env } from '../../../config/env';

const { API } = env;

class BranchesCreate extends Component {
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
            cities: [],
            ownerId: this.props.authSession.company.owner_id,
            name: '',
            city: 'none',
            location: '',
            phones: '',
            address: ''
        }
    }

    componentDidMount(){
        fetch(`${API}/api/cities/list/registers?request=api`)
        .then(res => res.json())
        .then(res => {
            this.setState({cities: res.cities});
        })
        .catch(error => ({'error': error}));
    }

    handleApiLoaded = (map, maps) => {
      // use map and maps objects
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.city === 'none'){
            this.props.enqueueSnackbar('Debes seleccionar una ciudad!', { variant: 'warning' });
            return false;
        }

        this.setState({loading: true});
        let params = {
            ownerId: this.state.ownerId,
            name: this.state.name,
            city: this.state.city,
            location: this.state.location,
            phones: this.state.phones,
            address: this.state.address
        }
        axios({
            method: 'post',
            url: `${API}/api/branch/create`,
            data: params,
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.branch){
                this.props.enqueueSnackbar('Sucursal registrada correctamente!', { variant: 'success' });
                // console.log(res.data)
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

                        <Navbar title={<h1 style={{marginLeft: 20}}> Nueva sucursal</h1>} />
                        
                        <div style={{marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="input-name"
                                            label="Nombre"
                                            placeholder='Casa matriz'
                                            autoFocus
                                            helperText="Nombre de la sucursal"
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
                                            label="Dirección"
                                            name="address"
                                            placeholder='Av. 18 de nov. Esq. Libertad Nro 123'
                                            helperText="Dirección de la sucursal"
                                            value={ this.state.address }
                                            onChange={ event => this.setState({address: event.target.value}) }
                                        />
                                    </Grid>
                                </Grid>
                                <div style={{ height: 350, width: '100%', marginTop: 30 }}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{ key: 'AIzaSyAyKr3gS1Ak--QklLJYJjYOeCnA5UKFVlw', language: 'es' }}
                                        defaultCenter={{ lat: -14.833648, lng: -64.904008}}
                                        defaultZoom={15}
                                        yesIWantToUseGoogleMapApiInternals
                                        onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
                                    >
                                    </GoogleMapReact>
                                </div>
                                <FormButtons back='/dashboard/branches' titleSuccess={ this.state.id ? 'Actualizar' : 'Guardar' } />
                            </form>
                        </div>
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

export default connect(mapStateToProps)(withSnackbar(BranchesCreate));