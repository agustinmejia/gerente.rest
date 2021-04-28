import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    AppBar,
    Tabs,
    Tab,
    Typography,
    Box,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    Tooltip,
    IconButton,
    Button,
    Fab,
    Backdrop,
    LinearProgress,
    CircularProgress,
    // Form input
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    // Table
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    // Dialog
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
} from '@material-ui/core';

import {
    Autocomplete,
    Alert,
    AlertTitle,
    // Toggle buttons
    ToggleButtonGroup,
    ToggleButton
} from '@material-ui/lab';

import { IoIosMenu, IoIosAddCircleOutline, IoIosCreate, IoIosList, IoIosKeypad, IoIosCart, IoIosTrash } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";
import { io } from "socket.io-client";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../env';

const { API, SOCKET_IO, color } = env;
const defaultImg = `${API}/images/default-image.png`;
const socket = io(SOCKET_IO);

// Sale confirmation
const transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Tab panels config
function tabProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class SalesCreate extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            sidebarToggled: false,
            tabActive: 0,
            productsCategories: [],
            customers: [],
            productCategoryIdActive: null,
            productsCategoriesShowType: this.props.globalConfig.TPVSales.productsShowType,
            loading: false,
            loadingAlt: false,
            // Products details
            saleDetails: [],
            // Form sales
            selectCustomerId: 1,
            selectCustomerSelected: {id: 1, person: {ci_nit: ''}},
            selectCustomerText: '',
            radioSaleType: 'mesa',
            inputSaleAmount: 0,
            inputDiscountAmount: 0,
            amountReceived: '',
            showDialogSaleConfirm: false,
            formSaleSending: false,
            checkType: false,
            paymentType: false,
            inputObservations: '',
            // formCustomer
            cashier: null,
            loadCashier: true,
            branch: this.props.authSession.branch,
            showDialogCustomer: false,
            inputFirstName: '',
            inputFirstNameError: false,
            inputCI: '',
            inputCIError: false,
            inputPhones: '',
            inputAddress: '',
            // formCashier
            showDialogCashier: false,
            inputNameCashier: 'principal',
            inputNameCashierError: false,
            inputAmountCashier: 0,
            inputAmountCashierError: false,
        }
    }

    async componentDidMount(){
        document.addEventListener("keyup", this.capturekeyPress, false);
        this.getProducts();
        this.getCustomers();
        this.getCashiers();
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.capturekeyPress, false);
    }

    // Capture keyPress
    capturekeyPress = (e) => {
        switch (e.keyCode) {
            case 13:
                if(!this.state.showDialogCustomer && !this.state.showDialogSaleConfirm){
                    this.handleConfirm();
                    return;
                }
                if(this.state.showDialogSaleConfirm){
                    this.handleSubmitSale();
                    return;
                }
                break;
            case 27:
                break;
            default: 
                break;
        }
    }

    getProducts(){
        let { authSession, productsTPV } = this.props;
        if(productsTPV.length){
            this.setState({productsCategories: productsTPV});
        }else{
            fetch(`${API}/api/company/${authSession.company.id}/products/category/list`, {headers: this.state.headers})
            .then(res => res.json())
            .then(res => {
                if(res.products_category){
                    let { products_category } = res;
                    this.setState({productsCategories: products_category});
                    this.props.setProductsTPV(products_category);
                }
            })
            .catch(error => ({'error': error}));
        }
    }

    getCashiers(){
        let { branch } = this.state;
        let { user } = this.props.authSession;

        if(branch && user.id){
            fetch(`${API}/api/branch/${branch.id}/cashier/user/${user.id}`, {headers: this.state.headers})
            .then(res => res.json())
            .then(res => {
                if(res.cashier){
                    this.setState({cashier: res.cashier});
                }
            })
            .catch(error => ({'error': error}))
            .finally(() => this.setState({loadCashier: false}));
        }
    }

    handleChangeTab = (event, newValue) => {
        this.setState({tabActive: newValue})
    }

    // sale Details
    handlePressProduct(product){
        let saleDetails = this.state.saleDetails;
        let newProduct = {
            ...product,
            code: `${Math.floor(Math.random() * 1000000)}_${product.id}`,
            quantity: 1,
            subtotal: product.price
        }
        saleDetails.push(newProduct);
        this.setState({saleDetails, inputSaleAmount: (this.state.inputSaleAmount + parseFloat(product.price) ) });
    }

    handleChangeQuantity(code, quantity){
        let total = 0;
        let saleDetails = this.state.saleDetails.map(item => {
            let newItem = item;
            if(item.code == code){
                newItem = {
                    ...item,
                    quantity,
                    subtotal: (item.price * quantity).toFixed(2)
                }
            }
            total += parseFloat(newItem.subtotal);
            return newItem;
        });
        this.setState({saleDetails, inputSaleAmount: total });
    }

    handleDeleteSaleDetail(code){
        let saleDetails = this.state.saleDetails;
        let indexDelete = null;
        let total = 0;
        saleDetails.map((item, index) => {
            if(item.code == code){
                indexDelete = index;
            }else{
                total += parseFloat(item.subtotal);
            }
        });
        saleDetails.splice( indexDelete, 1 );
        this.setState({saleDetails, inputSaleAmount: total });
    }

    handleSelectCustomerId = (event, value, reason) => {
        if(value){
            this.setState({ selectCustomerId: value.id, selectCustomerSelected: value, /* checkType: true,*/ selectCustomerText: '' });
        }else{
            this.setState({
                selectCustomerId: 1,
                selectCustomerSelected: {id: 1, person: {ci_nit: ''}},
                // checkType: false,
                selectCustomerText: '',
                inputFirstName: '',
                inputCI: '',
                inputPhones: '',
                inputAddress: '',
            });
        }
    }

    handleChangeSelectCustomer = (event, value, reason) => {
        if(value){
            this.setState({ selectCustomerText: value });
        }
    }

    handleChangeProductsCategoriesShowType = (event, newAlignment) => {
        if(newAlignment){
            let { TPVSales } = this.props.globalConfig;
            let newTPVSales = {
                ...TPVSales,
                productsShowType: newAlignment
            }
            let newGlobalConfig = {
                ...this.props.globalConfig,
                TPVSales: newTPVSales
            }
            this.setState({productsCategoriesShowType: newAlignment}, () => this.props.setGlobalConfig(newGlobalConfig));
        }
    }

    handleConfirm(){
        if(this.state.saleDetails.length > 0){
            this.setState({showDialogSaleConfirm: true});
        }else{
            this.props.enqueueSnackbar('Debes seleccionar algún producto!', { variant: 'warning' });
        }
    }

    // Customers
    getCustomers(){
        let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/customer/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            if(res.customers){
                let { customers } = res;
                this.setState({customers});
            }
        })
        .catch(error => ({'error': error}));
    }

    validateFormCustomer(){
        if(!this.state.inputFirstName){
            this.setState({inputFirstNameError: true});
            return;
        }
        if(!this.state.inputCI){
            this.setState({inputCIError: true});
            return;
        }
        return true;
    }

    async handleSubmitCreateCustomer(){
        if(!this.validateFormCustomer()){
            return;
        }

        this.setState({loading: true, showDialogCustomer: false});

        let { company } = this.props.authSession;
        let params = {
            owner_id: company.owner_id,
            company_id: company.id,
            first_name: this.state.inputFirstName,
            ci_nit: this.state.inputCI,
            phone: this.state.inputPhones,
            address: this.state.inputAddress,

        };

        let res = await axios({
            method: 'post',
            url: `${API}/api/customer/create`,
            data: JSON.stringify(params),
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.customer){
                return {customer: res.data.customer};
            }
            return {error: true};
        })
        .catch(error => ({error}))

        if(res.customer){
            let { customers } = this.state;
            customers.push(res.customer);
            let count = customers.length - 1;
            this.setState({customers, selectCustomerSelected: customers[count], selectCustomerId: customers[count].id /*, checkType: true */});
            this.props.enqueueSnackbar('Cliente registrado correctamente!', { variant: 'success' });
        }else{
            this.props.enqueueSnackbar('Ocurrió un error al registrar el cliente!', { variant: 'error' });
            this.setState({showDialogCustomer: true});
        }
        this.setState({loading: false});
    }

    handleEditCustomer = e => {
        let { first_name, last_name, ci_nit, phone, address } = this.state.selectCustomerSelected.person;
        this.setState({
            showDialogCustomer: true,
            inputFirstName: first_name ? first_name : '',
            inputCI: ci_nit ? ci_nit : '',
            inputPhones: phone ? phone : '',
            inputAddress: address ? address : '',
        })
    }

    async handleSubmitEditCustomer(){
        if(!this.validateFormCustomer()){
            return;
        }

        this.setState({loading: true, showDialogCustomer: false});
        let params = {
            first_name: this.state.inputFirstName,
            ci_nit: this.state.inputCI,
            phone: this.state.inputPhones,
            address: this.state.inputAddress,
        };

        let res = await axios({
            method: 'post',
            url: `${API}/api/customer/${this.state.selectCustomerId}/update`,
            data: JSON.stringify(params),
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.customer){
                return {customer: res.data.customer};
            }
            return {error: true};
        })
        .catch(error => ({error}))

        if(res.customer){
            let { customers } = this.state;

            let updateCustomers = customers.map(customer => {
                if(customer.id == res.customer.id){
                    return res.customer;
                }else{
                    return customer;
                }
            });

            this.setState({customers: updateCustomers, selectCustomerSelected: res.customer});
            this.props.enqueueSnackbar('Cliente editado correctamente!', { variant: 'success' });
        }else{
            this.props.enqueueSnackbar('Ocurrió un error al registrar el cliente!', { variant: 'error' });
            this.setState({showDialogCustomer: true});
        }
        this.setState({loading: false});
    }

    handleSubmitCashier = e => {
        if(!this.state.inputNameCashier){
            this.props.enqueueSnackbar('Debes ingresar el título de la caja', { variant: 'error' });
            this.setState({inputNameCashierError: true});
            return;
        }
        if(this.state.inputAmountCashier === ''){
            this.props.enqueueSnackbar('Debes ingresar el monto de apertura', { variant: 'error' });
            this.setState({inputAmountCashierError: true});
            return;
        }

        this.setState({showDialogCashier: false, loading: true});

        let params = {
            user_id: this.props.authSession.user.id,
            name: this.state.inputNameCashier,
            opening_amount: this.state.inputAmountCashier
        }

        axios({
            method: 'post',
            url: `${API}/api/branch/${this.state.branch.id}/cashier/create`,
            data: JSON.stringify(params),
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.cashier){
                this.setState({cashier: res.data.cashier});
                this.props.enqueueSnackbar('Caja aperturada correctamente', { variant: 'success' });
            }else{
                this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor', { variant: 'error' });
            }
        })
        .catch(error => this.props.enqueueSnackbar('Error al realizar la petición', { variant: 'warning' }))
        .finally(() => {
            this.setState({loading: false});
        })
    }

    handleSubmitSale(){
        if(this.state.cashier === null){
            this.props.enqueueSnackbar('Debes abrir caja primero', { variant: 'error' });
            return
        }
        if(!this.state.formSaleSending && this.state.saleDetails.length){
            this.setState({formSaleSending: true, loadingAlt: true}, async () => {
                let params = {
                    branch_id: this.state.branch.id,
                    customer_id: this.state.selectCustomerId,
                    user_id: this.props.authSession.user.id,
                    cashier_id: this.state.cashier.id,
                    payment_type: this.state.paymentType ? 2 : 1,
                    sale_type: this.state.radioSaleType,
                    sales_status_id: 2,
                    total: this.state.inputSaleAmount,
                    discount: this.state.inputDiscountAmount,
                    amount_received: this.state.amountReceived,
                    observations: this.state.inputObservations,
                    bill: this.state.checkType ? true : false,
                    sale_details: this.state.saleDetails
                }

                let options = {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: this.state.headers
                }
                let res = await fetch(`${API}/api/sales/create`, options)
                .then(res => res.json())
                .then(res => res)
                .catch(error => ({'error': error}))
                .finally(() => this.setState({formSaleSending: false, showDialogSaleConfirm: false, loadingAlt: false}))

                if(res.sale){
                    this.setState({
                        saleDetails: [],
                        selectCustomerId: 1,
                        selectCustomerSelected: {id: 1, person: {ci_nit: ''}},
                        radioSaleType: 'mesa',
                        inputSaleAmount: 0,
                        inputDiscountAmount: 0,
                        amountReceived: 0,
                        checkType: false,
                        inputObservations: ''
                    });
                    this.props.enqueueSnackbar('Venta realizada correctamente!', { variant: 'success' });

                    // Emitir evento para cocina
                    socket.emit(`change status`, {status: 2, branchId: this.state.branch.id});
                    window.open(`/dashboard/sales/print/${res.sale.id}`, 'Factura', 'toolbar=0,location=0,menubar=0,width=370,height=420,top=100,left:300')
                }else{
                    this.props.enqueueSnackbar('Ocurrió un error inesperado', { variant: 'error' });
                }
            });
        }
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

                        <Navbar
                            title={
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <Grid item>
                                        <h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}>
                                            Caja - { this.state.cashier ? this.state.cashier.name : 'cerrada' }
                                        </h1>
                                    </Grid>
                                    <Grid item style={{paddingTop: 10}}>
                                        <Tooltip title="Cambiar de sucursal" placement="bottom">
                                            <IconButton aria-label="Cambiar de sucursal" color='primary' onClick={ event => this.props.enqueueSnackbar('Ésta opción no está disponible para tu tipo de suscripción.', { variant: 'warning' }) }>
                                                <FaRegEdit />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            }
                        />

                        <Grid container direction="row" justify="flex-end" alignItems="center" style={{ marginTop: 5, marginBottom: 5 }}>

                            {/* Products show type */}
                            <ToggleButtonGroup
                                value={ this.state.productsCategoriesShowType }
                                exclusive
                                onChange={ this.handleChangeProductsCategoriesShowType }
                                aria-label="Tipo de visualización"
                            >
                                <ToggleButton value="cuadricula" aria-label="Vista en cuadrícula">
                                    <IoIosKeypad size={20} />
                                </ToggleButton>
                                <ToggleButton value="agrupado" aria-label="Vista agrupada">
                                    <IoIosList size={20} />
                                </ToggleButton>
                            </ToggleButtonGroup>

                        </Grid>

                        { this.state.cashier === null && this.state.loadCashier === false &&
                            <Alert severity="error">
                                <AlertTitle>Advertencia</AlertTitle>
                                Debes abrir caja para registrar tus ventas realizadas.
                                <Button variant="outlined" color="secondary" onClick={ e => this.setState({showDialogCashier: true}) } style={{marginLeft: 10}}>
                                    Abrir caja
                                </Button>
                            </Alert>
                        }

                        {/* Products list and sale details */}
                        <Paper elevation={2}>
                            <Grid container spacing={2}>
                                
                                {/* Tabs products */}
                                <Grid item xs={12} sm={8} >
                                    <AppBar position="static" style={{backgroundColor: color.secondary, color: 'white', margin: 0}}>
                                        <Tabs value={ this.state.tabActive } onChange={ this.handleChangeTab } aria-label="Panel de productos">
                                            {
                                                this.state.productsCategories.map((category, index) => {
                                                    if(category.products.length){
                                                        return <Tab key={ category.id } label={ category.name } {...tabProps(index)} />                                                        
                                                    }
                                                })
                                            }
                                        </Tabs>
                                    </AppBar>
                                    <div style={{maxHeight: 350, overflowY: 'auto' }}>
                                        
                                        {/* Recorrer lista de productos */}
                                        {
                                            this.state.productsCategories.map((category, index) => {
                                                
                                                if(category.products.length){
                                                    // Show group by
                                                    if(this.state.productsCategoriesShowType === 'agrupado'){
                                                        return (
                                                            <TabPanel key={category.id} value={ this.state.tabActive } index={index}>
                                                                {
                                                                    Array.from(
                                                                    category.products.reduce((a,{type, ...rest})=>{
                                                                        return a.set(type, [rest].concat(a.get(type)||[]));
                                                                    }, new Map())
                                                                    ).map(([type, children])=>({type,children}))
                                                                    .map(type => {
                                                                        return(
                                                                            <div key={type.type} style={{marginBottom: 20}}>
                                                                                <Typography variant='body2' style={{marginBottom: 5}}>{type.type}</Typography>
                                                                                <Grid container spacing={1} style={{margin: 0}} >
                                                                                    {
                                                                                        type.children.map(product => <CardProduct key={product.id} product={product} onClick={ (e) => this.handlePressProduct(product) } />)
                                                                                    }
                                                                                </Grid>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </TabPanel>
                                                        )
                                                    }
                                                    
                                                    // Show whitout group by
                                                    return(
                                                        <TabPanel key={category.id} value={ this.state.tabActive } index={index}>
                                                            <Grid container spacing={1} style={{margin: 0}} >
                                                                {
                                                                    category.products.map(product => <CardProduct key={product.id} product={product} onClick={ (e) => this.handlePressProduct(product) } />)
                                                                }
                                                            </Grid>
                                                        </TabPanel>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </Grid>

                                {/* Sale info */}
                                <Grid item xs={12} sm={4} style={{ padding: 10, paddingTop: 20 }}>
                                    <Grid container>

                                        {/* Select customer */}
                                        <Grid item sm={12}>
                                            <Grid container>
                                                <Grid item xs={8} sm={10} style={{margin: 0}}>
                                                    <Autocomplete
                                                        id="combo-customers"
                                                        fullWidth
                                                        options={ this.state.customers }
                                                        getOptionLabel={(option) => `${option.person.ci_nit}`}
                                                        renderInput={(params) => <TextField {...params} label="NIT para la factura" variant="outlined" />}
                                                        renderOption={(option, { selected }) => (
                                                            <React.Fragment>
                                                                <div>
                                                                    <b>{option.person.ci_nit}</b>
                                                                    <br/>
                                                                    <small>{option.person.first_name} {option.person.last_name}</small>
                                                                </div>
                                                            </React.Fragment>
                                                        )}
                                                        // inputValue={false}
                                                        noOptionsText='No hay resultados'
                                                        onChange={ this.handleSelectCustomerId }
                                                        onInputChange={ this.handleChangeSelectCustomer }
                                                        value={ this.state.selectCustomerSelected }
                                                    />
                                                </Grid>
                                                <Grid item xs={4} sm={2} style={{paddingLeft: 5}}>
                                                    {
                                                        this.state.selectCustomerId == 1 &&
                                                        <Tooltip title="Crear nuevo" placement="top">
                                                            <Fab color="secondary" aria-label="Crear nuevo" onClick={(e) => this.setState({showDialogCustomer: true, inputCI: this.state.selectCustomerText })}>
                                                                <IoIosAddCircleOutline size={30} />
                                                            </Fab>
                                                        </Tooltip>
                                                    }
                                                    {
                                                        this.state.selectCustomerId != 1 &&
                                                        <Tooltip title="Editar información" placement="top">
                                                            <Fab color="primary" aria-label="Editar información" onClick={ this.handleEditCustomer }>
                                                                <IoIosCreate size={30} />
                                                            </Fab>
                                                        </Tooltip>
                                                        
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* Type sale */}
                                        <Grid item sm={12} style={{marginTop: 10}}>
                                            <RadioGroup row aria-label="position" name="position" defaultValue={ this.state.radioSaleType }>
                                                <Grid container direction="row" justify="space-around" alignItems="flex-start">
                                                    <Grid item>
                                                        <FormControlLabel
                                                            value="mesa"
                                                            control={<Radio color="primary" />}
                                                            label="Mesa"
                                                            labelPlacement="end"
                                                            onChange={ (event) => this.setState({radioSaleType: event.target.value}) }
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <FormControlLabel
                                                            value="para llevar"
                                                            control={<Radio color="primary" />}
                                                            label="Para llevar"
                                                            labelPlacement="end"
                                                            onChange={ (event) => this.setState({radioSaleType: event.target.value}) }
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {/* <FormControlLabel
                                                    value="domicilio"
                                                    control={<Radio color="primary" />}
                                                    label="Domicilio"
                                                    labelPlacement="end"
                                                    onChange={ (event) => this.setState({radioSaleType: event.target.value}) }
                                                /> */}
                                            </RadioGroup>
                                        </Grid>

                                        {/* Amounts */}
                                        <Grid item md={12}>
                                            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                                                <Grid item md={6} style={{textAlign: 'right', padding: 10}}>
                                                    <TextField
                                                        id="input-amount" 
                                                        label="Monto recibido"
                                                        inputProps={{ type: 'number', min: '0', step: '0.5' }}
                                                        onClick={ e => e.target.select() }
                                                        value={ this.state.amountReceived }
                                                        onChange={ e => this.setState({amountReceived: e.target.value}) }
                                                    />
                                                </Grid>
                                                <Grid item md={6} style={{textAlign: 'right', padding: 10}}>
                                                    <Typography variant='h4'>{ this.state.inputSaleAmount.toFixed(2) } <small style={{ fontSize: 15, padding: 0 }}>Bs.</small> </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* Alert refund amount */}
                                        <Grid item md={12} style={{paddingTop: 0, paddingBottom: 10}}>
                                            {
                                                this.state.amountReceived == '' &&
                                                <Alert severity="info">Ingresa el monto recibido por el cliente</Alert>
                                            }
                                            {
                                                this.state.amountReceived != '' && this.state.amountReceived == this.state.inputSaleAmount &&
                                                <Alert severity="success">Monto recibido exacto!</Alert>
                                            }
                                            {
                                                this.state.amountReceived != '' && this.state.amountReceived != this.state.inputSaleAmount &&
                                                <Alert severity={this.state.amountReceived > this.state.inputSaleAmount ? 'info' : 'error'}>
                                                    {
                                                        (this.state.amountReceived > this.state.inputSaleAmount) ?
                                                        <>Debes dar un cambio de <b>{this.state.amountReceived - this.state.inputSaleAmount}</b> Bs.</> :
                                                        'Monto inferior al importe de la venta'
                                                    }
                                                </Alert>
                                            }
                                        </Grid>

                                        {/* Switches */}
                                        {/* <Grid item md={12}>
                                            <FormControlLabel
                                                control={<Switch checked={ this.state.checkType } onChange={ e => this.setState({checkType: e.target.checked})} name="switch-checkType" color="primary" />}
                                                label="Factura"
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <FormControlLabel
                                                control={<Switch checked={ this.state.paymentType } onChange={ e => this.setState({ paymentType: e.target.checked, amountReceived: e.target.checked ? this.state.inputSaleAmount : '' })} name="switch-paymentType" color="primary" />}
                                                label="Pagado con tarjeta"
                                            />
                                        </Grid> */}

                                        <Grid item md={12} style={{paddingBottom: 10}}>
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: color.primary, color: 'white'}}
                                                fullWidth
                                                size="large"
                                                disabled={this.state.cashier === null ? true : false}
                                                endIcon={<IoIosCart>Vender</IoIosCart>}
                                                onClick={ (e) => this.handleConfirm() }
                                            >
                                                Vender
                                            </Button>

                                        </Grid>
                                        <Grid item md={12} style={{ textAlign: 'center', paddingBottom: 10 }}>
                                            <Link to='/dashboard/sales' style={{ textDecoration: 'underline' }}>Ver lista de ventas</Link>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Table details products */}
                        { this.state.saleDetails.length > 0 &&
                            <Paper style={{marginTop: 30, marginBottom: 50}} elevation={2}>
                                
                                {/* Table details */}
                                <TableContainer>
                                    <Table size="small" aria-label="a dense table">
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell align="right">Cantidad</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {this.state.saleDetails.map((row) => (
                                            <TableRow key={row.code}>
                                                <TableCell component="th" scope="row">{
                                                    <Card elevation={0} style={{display: 'flex'}}>
                                                        <CardMedia
                                                            component="img"
                                                            alt={ row.name }
                                                            height="50"
                                                            image={row.image ? `${API}/storage/${row.image.replace('.', '-small.')}` : defaultImg}
                                                            title={ row.name }
                                                            style={{ width: 80 }}
                                                        />
                                                        <div>
                                                            <CardContent style={{ paddingTop: 0, paddingBottom: 10, }}>
                                                                <Typography noWrap={true} component="h6" variant="h6">{ row.name }</Typography>
                                                                <Typography noWrap={true} variant="subtitle2" color="textSecondary">{ row.type ? row.type : row.short_description }</Typography>
                                                            </CardContent>
                                                        </div>
                                                    </Card>
                                                    }
                                                </TableCell>
                                                <TableCell align="right">{ row.price }</TableCell>
                                                <TableCell align="right">
                                                    <TextField
                                                        id={`input-quantity-${row.code}`} 
                                                        value={ row.quantity }
                                                        inputProps={{ type: 'number', min: '1', step: '1', style: {fontSize: 20, textAlign: 'center'} }}
                                                        style={{ width: 80 }}
                                                        onChange={ (e) => this.handleChangeQuantity(row.code, e.target.value) }
                                                        onClick={ e => e.target.select() }
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{ row.subtotal }</TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Borrar" placement="top">
                                                        <IconButton aria-label="Borrar" component="span" onClick={ e => this.handleDeleteSaleDetail(row.code) }>
                                                            <IoIosTrash color='#CD272A' size={20} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Observations */}
                                <Grid style={{margin: 10, marginTop: 20}}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="input-observations"
                                        label="Observaciones"
                                        placeholder='Describa las solicitudes extras del cliente'
                                        name="observations"
                                        helperText="Ej: Sin ensalada, sin aceitunas, etc."
                                        value={ this.state.inputObservations }
                                        onChange={ event => this.setState({inputObservations: event.target.value}) }
                                        style={{ marginBottom: 15 }}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>

                            </Paper>
                        }

                        {/* Empty sale detail */}
                        {
                            !this.state.saleDetails.length &&
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"
                                style={{marginTop: 50, marginBottom: 50}}
                            >
                                <div style={{marginBottom: 10}}>
                                    <img src="/img/dashboard/cart-empty.png" style={{width: 200}}/>
                                </div>
                                <Typography variant='h5'>Cesta de productos vacía</Typography>
                            </Grid>
                        }

                        {/* Sale confirmation */}
                        <div>
                            <Dialog
                                open={ this.state.showDialogSaleConfirm }
                                // open={ true }
                                TransitionComponent={ transition }
                                keepMounted
                                onClose={() => this.setState({showDialogSaleConfirm: false}) }
                                fullWidth
                                maxWidth='md'
                            >
                                <DialogContent>
                                    <Paper style={{marginTop: 20, marginBottom: 30}} elevation={2}>
                                        <Grid container>

                                            {/* List sale details */}
                                            <Grid item md={6} xs={12} style={{ maxHeight: 330, overflowY: 'auto' }}>
                                                <TableContainer>
                                                    <Table size="small" aria-label="Detalles de venta">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Producto</TableCell>
                                                                <TableCell align="right">Monto</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                        {this.state.saleDetails.map((row) => (
                                                            <TableRow key={`preview-${row.code}`}>
                                                                <TableCell component="th" scope="row" style={{paddingTop: 3, paddingBottom: 3}}>
                                                                    <Card elevation={0} style={{display: 'flex'}}>
                                                                        <CardMedia
                                                                            component="img"
                                                                            alt={ row.name }
                                                                            height={40}
                                                                            image={row.image ? `${API}/storage/${row.image.replace('.', '-small.')}` : defaultImg}
                                                                            title={ row.name }
                                                                            style={{ width: 60 }}
                                                                        />
                                                                        <div>
                                                                            <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                                                                                <Typography noWrap={true} variant="body1">{ row.quantity } { row.name }</Typography>
                                                                                <Typography noWrap={true} variant="subtitle2" color="textSecondary">{ row.type ? row.type : row.short_description }</Typography>
                                                                            </CardContent>
                                                                        </div>
                                                                    </Card>
                                                                </TableCell>
                                                                <TableCell align="right"><Typography noWrap={true} variant="body1">{ row.subtotal } <small>Bs.</small></Typography></TableCell>
                                                            </TableRow>
                                                        ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>

                                            {/* Sale info */}
                                            <Grid item md={6} xs={12} style={{ backgroundColor: color.secondary }}>
                                                <Grid item md={12} style={{ textAlign: 'center', marginTop: 20}}>
                                                    <Typography variant='h4' style={{ color: 'white' }} >{ this.state.checkType ? 'Factura' : 'Recibo de venta' }</Typography>
                                                </Grid>
                                                <Grid container style={{ padding: 30, marginTop: 20 }}>
                                                    <Grid item md={12}>
                                                        <Typography variant='body2' style={{ color: 'white' }} >Cliente</Typography>
                                                        <Typography variant='h6' noWrap={false} style={{ color: 'white' }} >{ this.state.selectCustomerSelected.id == 1 ? 'Sin nombre' : `${this.state.selectCustomerSelected.person.first_name} ${this.state.selectCustomerSelected.person.last_name}` }</Typography>
                                                    </Grid>
                                                    <Grid item md={12} style={{marginTop: 10}}>
                                                        <Typography variant='body2' style={{ color: 'white' }} >NIT</Typography>
                                                        <Typography variant='h6' noWrap={false} style={{ color: 'white' }} >{ this.state.selectCustomerSelected.id == 1 ? '00000' : `${this.state.selectCustomerSelected.person.ci_nit}` }</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container direction="column" justify="flex-end" alignItems="flex-end" style={{paddingRight: 10 }}>
                                                    <Grid item md={12} style={{textAlign: 'right', paddingBottom: 10}}>
                                                        <Typography variant='body2' style={{ color: 'white' }}>Monto total</Typography>
                                                        <Typography variant='h3' style={{ color: 'white' }}>{ this.state.inputSaleAmount.toFixed(2) } <small style={{ fontSize: 15, padding: 0, color: 'white' }}>Bs.</small> </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {
                                            this.state.loadingAlt && <LinearProgress />
                                        }
                                    </Paper>
                                </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => this.setState({showDialogSaleConfirm: false}) } >
                                            Cancelar
                                        </Button>
                                        <Button disabled={this.state.formSaleSending} onClick={() => this.handleSubmitSale() } style={{ color: color.primary }} disabled={ this.state.cashier === null ? true : false }>
                                            Aceptar
                                        </Button>
                                    </DialogActions>
                            </Dialog>
                        </div>

                        {/* Form customer */}
                        <div>
                            <Dialog
                                open={ this.state.showDialogCustomer }
                                TransitionComponent={ transition }
                                keepMounted
                                onClose={() => this.setState({showDialogCustomer: false, selectCustomerText: ''}) }
                                aria-labelledby="alert-dialog-customer-title"
                                fullWidth
                            >
                                <DialogTitle id="alert-dialog-customer-title">{ this.state.selectCustomerSelected.id > 1 ? 'Editar' : 'Registrar nuevo' } cliente</DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                name="firstName"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="input-firstName"
                                                label="Nombre completo o razón social"
                                                error={ this.state.inputFirstNameError }
                                                value={ this.state.inputFirstName }
                                                onChange={ event => this.setState({inputFirstName: event.target.value, inputFirstNameError: false}) }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="input-ci_nit"
                                                label="NIT"
                                                name="ci_nit"
                                                error={ this.state.inputCIError }
                                                value={ this.state.inputCI }
                                                onChange={ event => this.setState({inputCI: event.target.value, inputCIError: false}) }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="input-phone"
                                                label="Celular"
                                                name="phone"
                                                value={ this.state.inputPhones }
                                                onChange={ event => this.setState({inputPhones: event.target.value}) }
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                id="input-address"
                                                label="Dirección"
                                                name="address"
                                                multiline
                                                rows={2}
                                                value={ this.state.inputAddress }
                                                onChange={ event => this.setState({inputAddress: event.target.value}) }
                                            />
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => this.setState({ showDialogCustomer: false, selectCustomerText: '' }) } color="secondary">
                                        Cancelar
                                    </Button>
                                    {/* Submit actions */}
                                    {   this.state.selectCustomerSelected.id == 1 &&
                                        <Button onClick={ (e) => this.handleSubmitCreateCustomer() } color="primary" >
                                            Guardar
                                        </Button>
                                    }
                                    {   this.state.selectCustomerSelected.id > 1 &&
                                        <Button onClick={ (e) => this.handleSubmitEditCustomer() } color="primary" >
                                            Guardar cambios
                                        </Button>
                                    }
                                    
                                </DialogActions>
                            </Dialog>
                        </div>

                        {/* Form cashier */}
                        <div>
                            <Dialog
                                open={ this.state.showDialogCashier }
                                TransitionComponent={ transition }
                                keepMounted
                                onClose={() => this.setState({showDialogCashier: false}) }
                                aria-labelledby="alert-dialog-customer-title"
                                fullWidth
                                maxWidth='sm'
                            >
                                <DialogTitle id="alert-dialog-customer-title">Aperturar caja</DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <Grid item md={12}>
                                            <TextField
                                                name="name"
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="input-name"
                                                label="Título de la caja"
                                                helperText="título de la caja o nombre del cajero para diferenciarla del resto. Ej: Turno tarde"
                                                error={ this.state.inputNameCashierError }
                                                value={ this.state.inputNameCashier }
                                                onChange={ event => this.setState({inputNameCashier: event.target.value, inputNameCashierError: false}) }
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                id="input-amount"
                                                label="Monto de apertura"
                                                name="amount"
                                                helperText="Monto de apertura de la caja."
                                                inputProps={{ type: 'number', min: '0', step: '0.5' }}
                                                onClick={ e => e.target.select() }
                                                error={ this.state.inputAmountCashierError }
                                                value={ this.state.inputAmountCashier }
                                                onChange={ event => this.setState({inputAmountCashier: event.target.value, inputAmountCashierError: false}) }
                                            />
                                        </Grid>
                                        <Grid item md={12}>
                                            <Alert severity="info">
                                                <AlertTitle>Información</AlertTitle>
                                                Todas la ventas que realices, serán registradas en ésta caja.
                                            </Alert>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => this.setState({ showDialogCashier: false }) } >
                                        Cancelar
                                    </Button>
                                    <Button onClick={ this.handleSubmitCashier } style={{color: color.primary}} >
                                        Aperturar caja
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}

const CardProduct = props => {
    let { product } = props;
    return(
        <Grid item xs={12} sm={3} onClick={ props.onClick }>
            <Tooltip title={ product.short_description }  >
                <Card >
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt={ product.name }
                            height="100"
                            image={ product.image ? `${API}/storage/${product.image.replace('.', '-small.')}` : defaultImg }
                        />
                        <CardContent>
                            <Grid container spacing={2} style={{marginTop: -20}}>
                                <Grid item sm={12}>
                                    <Typography noWrap={true}><b>{ product.name }</b></Typography>
                                    <Typography noWrap={true} variant='subtitle2'>{ product.type ? product.type : product.short_description }</Typography>
                                </Grid>
                                <Grid container style={{marginTop: -10}} justify="flex-end">
                                    <small style={{ color: '#1D6CC6' }}>{ product.price }<small style={{marginLeft: 2}}>Bs.</small></small>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Tooltip>
        </Grid>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
        globalConfig: state.globalConfig,
        productsTPV: state.productsTPV
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthSession : (authSession) => dispatch({
            type: 'SET_AUTH_SESSION',
            payload: authSession
        }),
        setProductsTPV : (productsTPV) => dispatch({
            type: 'SET_PRODUCTS_TPV',
            payload: productsTPV
        }),
        setGlobalConfig : (globalConfig) => dispatch({
            type: 'SET_GLOBAL_CONFIG',
            payload: globalConfig
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(SalesCreate));