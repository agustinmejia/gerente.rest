import React, { Component } from 'react';
import {
    Grid,
    Button,
    TextField,
    Backdrop,
    CircularProgress,
    CardMedia,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
}from '@material-ui/core';
import { IoIosMenu, IoIosCheckmarkCircle, IoIosArrowDropleft, IoIosCamera, IoIosAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import ProductsCategories from "../../components/productsCategories/productsCategories";
import { env } from '../../../config/env';

const { API } = env;

class ProductsEdit extends Component {
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
            categories: [],
            id: this.props.match.params.id,
            inputName: '',
            inputType: '',
            inputPrice: '',
            selectCategoryId: 'none',
            inputShortDescription: '',
            image: `${API}/images/default-image.png`,
            fileImage: null,
            showDialogCreateCategory: false,
            inputNameCategory: '',
            inputDescriptionCategory: '',
            imageCategory: `${API}/images/default-image.png`,
            fileImageCategory: null,
            errorCreateCategory: false
        }
    }

    componentDidMount(){
        if(this.props.authSession){
            let { company, user } = this.props.authSession;
            fetch(`${API}/api/company/${company.id}/product_category/list`, {headers: this.state.headers})
            .then(res => res.json())
            .then(res => {
                this.setState({categories: res.categories});
            })
            .catch(error => ({'error': error}));
            this.setState({ownerId: user.owner.id})
        }

        // Get branch info
        fetch(`${API}/api/product/${this.state.id}`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            let { product } = res;
            this.setState({
                inputName: product.name,
                inputType: product.type,
                inputPrice: product.price,
                selectCategoryId: product.product_category_id,
                inputShortDescription: product.short_description ? product.short_description : '',
                image: product.image ? `${API}/storage/${product.image.replace('.', '-medium.')}`: `${API}/images/default-image.png`
            });
            // console.log(res)
        })
        .catch(error => ({'error': error}));
    }

    hanldeImage = e => {
        try {
            this.setState({image: URL.createObjectURL(e.target.files[0]), fileImage: e.target.files[0]})
        } catch (error) {console.log(error)}
    }

    handleSelectCategory = event => {
        if(event.target.value !== 'create'){
            this.setState({selectCategoryId: event.target.value})
        }else{
            this.setState({showDialogCreateCategory: true})
        }
    }

    handleSubmitCategory = event => {
        if(this.state.inputNameCategory){
            this.setState({loading: true, showDialogCreateCategory: false})
            event.preventDefault();
            let { owner } = this.props.authSession.user;
            let formData = new FormData();
            formData.append('image', this.state.fileImageCategory);
            formData.append("owner_id", owner.id);
            formData.append("name", this.state.inputNameCategory);
            formData.append("description", this.state.inputDescriptionCategory);

            axios({
                method: 'post',
                url: `${API}/api/product_category/create`,
                data: formData,
                headers: this.state.headers
            })
            .then(res => {
                if(res.data.product_category){
                    let { product_category } = res.data;
                    let categories = this.state.categories;
                    categories.push(product_category);                    
                    this.setState({
                        categories,
                        selectCategoryId: product_category.id,
                        // Reset form
                        inputNameCategory: '',
                        inputDescriptionCategory: '',
                        imageCategory: `${API}/images/default-image.png`,
                        fileImageCategory: null,
                    });
                    this.props.enqueueSnackbar('Categoría registrado correctamente!', { variant: 'success' });
                }else{
                    this.props.enqueueSnackbar('Ocurrió un error inesparado, intente nuevamente!', { variant: 'error' })
                }            
            })
            .catch((err) => this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor!', { variant: 'error' }))
            .then(() => this.setState({loading: false}));
        }else{
            this.setState({errorCreateCategory: true});
            this.props.enqueueSnackbar('Debes ingresar al menos el nombre de la categoría', { variant: 'warning' })
        }
    }

    hanldeImageCategory = e => {
        try {
            this.setState({imageCategory: URL.createObjectURL(e.target.files[0]), fileImageCategory: e.target.files[0]})
        } catch (error) {console.log(error)}
    }

    handleSubmit = (event) => {
        this.setState({loading: true})
        event.preventDefault();
        let formData = new FormData();
        formData.append("name", this.state.inputName);
        formData.append("type", this.state.inputType);
        formData.append("price", this.state.inputPrice);
        formData.append("product_category_id", this.state.selectCategoryId);
        formData.append("short_description", this.state.inputShortDescription);
        formData.append('image', this.state.fileImage);

        axios({
            method: 'post',
            url: `${API}/api/product/${this.state.id}/update`,
            data: formData,
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.product){
                this.props.enqueueSnackbar('Producto actualizado correctamente!', { variant: 'success' });
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
                    <Backdrop open={true} style={{ zIndex: 2 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
                <div className='app'>
                    <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
                    <main style={{paddingTop: 10}}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>

                        <Navbar title='Editar producto' />

                        <div style={{marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit } >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-password">Categoría</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-filled-label"
                                                    id="demo-simple-select-filled"
                                                    variant="outlined"
                                                    label="Categoría"
                                                    inputProps={{ 'aria-label': 'Categoría' }}
                                                    required
                                                    fullWidth
                                                    value={ this.state.selectCategoryId }
                                                    onChange={ this.handleSelectCategory }
                                                    style={{ marginBottom: 20 }}
                                                >
                                                        <MenuItem disabled key='none' value="none">
                                                            <em>Selecciona la categoría</em>
                                                        </MenuItem>
                                                        <MenuItem key='create' value="create">
                                                            <IoIosAddCircleOutline size={20} color="blue" /> <em><b>Crear nueva</b></em>
                                                        </MenuItem>
                                                        {
                                                            this.state.categories.map(city => 
                                                                <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                                                            )
                                                        }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="name"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="input-name"
                                                label="Nombre"
                                                placeholder='Hamburguesa'
                                                autoFocus
                                                helperText="Nombre descriptivo del producto"
                                                value={ this.state.inputName }
                                                onChange={ event => this.setState({inputName: event.target.value}) }
                                                style={{ marginBottom: 20 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="input-type"
                                                label="Categoría"
                                                placeholder='Completa'
                                                name="type"
                                                helperText="Categoría del productos Ej: económica, completa, familiar, etc."
                                                value={ this.state.inputType }
                                                onChange={ event => this.setState({inputType: event.target.value}) }
                                                style={{ marginBottom: 20 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="input-price"
                                                label="Precio"
                                                placeholder='15'
                                                name="price"
                                                helperText="Precio de venta del producto"
                                                value={ this.state.inputPrice }
                                                onChange={ event => this.setState({inputPrice: event.target.value}) }
                                                inputProps={{ type: 'number', min: '1', step: '0.5' }}
                                                style={{ marginBottom: 20 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="input-short_description"
                                                label="Descripción"
                                                placeholder='Descripción corta de su producto'
                                                name="short_description"
                                                helperText="Ej: Pan, carne, ensalada, huevo, salsas, etc."
                                                value={ this.state.inputShortDescription }
                                                onChange={ event => this.setState({inputShortDescription: event.target.value}) }
                                                style={{ marginBottom: 20 }}
                                                multiline
                                                rows={2}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={6} style={{paddingLeft: 20, paddingRight: 20,}}>
                                        <input type="file" style={{ display: 'none' }} id="input-image" name="image" accept="image/*" onChange={ this.hanldeImage }/>
                                        <CardMedia
                                            style={{ width: '100%', height: '80%', position: 'relative', zIndex: 1, border: '3px solid #E2E3E3', marginBottom: 10 }}
                                            image={ this.state.image }
                                            title="Imagen del producto"
                                        />
                                        <div style={{ display: 'flex', justifyContent:'center' }}>
                                            <label htmlFor="input-image">
                                                <Tooltip title="Click para cambiar imagen" placement="top">
                                                    <IconButton aria-label="Click para cambiar imagen" component="span">
                                                        <IoIosCamera size={30} color="grey" />
                                                    </IconButton>
                                                </Tooltip>
                                            </label>
                                        </div>
                                    </Grid>
                                </Grid>

                                <div style={{ paddingTop: 50 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Link to='/dashboard/products'>
                                                <Button
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    startIcon={ <IoIosArrowDropleft/> }
                                                >
                                                    Volver
                                                </Button>
                                            </Link> 
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                size="large"
                                                variant="contained"
                                                color="primary"
                                                endIcon={ <IoIosCheckmarkCircle/> }
                                            >
                                                Guardar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </form>
                        </div>

                        {/* Create category */}
                        <ProductsCategories
                            showDialogCreateCategory={ this.state.showDialogCreateCategory }
                            onClose={ () => this.setState({showDialogCreateCategory: false}) }
                            errorCreateCategory={ this.state.errorCreateCategory }
                            inputNameCategory= { this.state.inputNameCategory }
                            setInputNameCategory={ event => this.setState({inputNameCategory: event.target.value}) }
                            inputDescriptionCategory={ this.state.inputDescriptionCategory }
                            setInputDescriptionCategory={ event => this.setState({inputDescriptionCategory: event.target.value}) }
                            hanldeImageCategory={ this.hanldeImageCategory }
                            imageCategory={ this.state.imageCategory }
                            handleSubmitCategory={ this.handleSubmitCategory }
                        />
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

export default connect(mapStateToProps)(withSnackbar(ProductsEdit));