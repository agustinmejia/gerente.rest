import React, { Component } from 'react';
import {
    Grid,
    Button,
    Paper,
    Typography,
    TextField,
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide
} from '@material-ui/core';

import {
    Alert,
    AlertTitle
} from '@material-ui/lab';


import { IoIosMenu, IoIosLock } from "react-icons/io";
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import { withSnackbar } from 'notistack';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../env';

const { API, color } = env;
const transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class CashiersClose extends Component {
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
            showDialog: false,
            redirect: false,
            bills: [
                {name: 'cincuenta_centavos', value: 0.5, count: 0},
                {name: 'uno', value: 1, count: 0},
                {name: 'dos', value: 2, count: 0},
                {name: 'cinco', value: 5, count: 0},
                {name: 'diez', value: 10, count: 0},
                {name: 'veinte', value: 20, count: 0},
                {name: 'cincuenta', value: 50, count: 0},
                {name: 'cien', value: 100, count: 0},
                {name: 'doscientos', value: 200, count: 0}
            ],
            cashier: {},
            incomeAmount: 0,
            expensesAmount: 0,
            totalAmount: 0,
            realAmount: 0,
            missingAmount: 0,
            inputObservations: ''
        }
    }

    async componentDidMount(){
        this.setState({loading: true});
        // Get cashier info
        let res = await fetch(`${API}/api/cashier/${this.props.match.params.id}`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => res)
        .catch(error => ({'error': error}))
        .finally(() => this.setState({loading: false}));

        if(res.cashier){
            let { cashier } = res;

            if(cashier.status != 1){
                this.setState({redirect: true});
                return 0;
            }

            var openingAmount = parseFloat(cashier.opening_amount);
            var incomeAmount = 0;
            var expensesAmount = 0;
            cashier.details.map(detail => {
                if(detail.deleted_at == null){
                    if(detail.type == 1){
                        incomeAmount += parseFloat(detail.amount);
                    }else if(detail.type == 2){
                        expensesAmount += parseFloat(detail.amount);
                    }
                }
            });
            this.setState({cashier, incomeAmount, expensesAmount, totalAmount: (incomeAmount - expensesAmount + openingAmount)});
        }
    }

    calculateTotal(value, index){
        let { bills } = this.state;
        bills[index].count = value;
        this.setState({bills});

        let total = 0;
        bills.map(bill =>{
            total += bill.value * bill.count;
        });

        let openingAmount = parseFloat(this.state.cashier.opening_amount);
        let missingAmount = this.state.incomeAmount - this.state.expensesAmount - total + openingAmount;

        this.setState({realAmount: total, missingAmount: missingAmount > 0 ? missingAmount : 0});
    }

    handleSubmit = async () => {
        this.setState({loading: true, showDialog: false});

        let { cashier, inputObservations, realAmount, totalAmount, missingAmount } = this.state;
        let params = {
            observations: inputObservations,
            closing_amount: totalAmount,
            real_amount: realAmount,
            missing_amount: missingAmount,
        };

        let res = await axios({
            method: 'post',
            url: `${API}/api/cashier/${cashier.id}/close`,
            data: JSON.stringify(params),
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.cashier){
                return {cashier: res.data.cashier};
            }
            return {error: true};
        })
        .catch(error => ({error}))
        .finally(() => this.setState({loading: false}));

        if(res.cashier){
            this.props.enqueueSnackbar('Caja cerrada correctamente!', { variant: 'success' });
            this.setState({redirect: true});
        }else{
            this.props.enqueueSnackbar('Ocurrió un error al cerrar la caja!', { variant: 'error' })
        }
    }

    render() {
        if (this.state.redirect) {
           return <Redirect to='/dashboard/cashiers'/>;
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

                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Cierre de Caja</h1>} />

                        <Grid style={{marginTop: 20}}>
                            <div style={{ marginTop: 30, marginBottom: 50 }}>
                                <Paper style={{ marginTop: 10 }} elevation={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} >
                                            <div style={{margin: 20}}>
                                                {
                                                    this.state.bills.map((bill, index) => 
                                                        <Bill
                                                            key={ bill.name }
                                                            name={ bill.name }
                                                            count={ bill.count }
                                                            BillValue={ bill.value }
                                                            onChange={ event => this.calculateTotal(event.target.value, index) }
                                                        />
                                                    )
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6} style={{marginTop: 20}}>
                                            <Grid container direction="row" justify="center" alignItems="center">
                                                <Typography variant='h4'>Detalle de caja</Typography>
                                            </Grid>
                                            <Grid container style={{ marginTop: 20 }}>
                                                <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #CDCDCD', paddingBottom: 10, }}>
                                                    <Typography variant='caption' color="textSecondary">Monto de apertura:</Typography>
                                                    <Grid container direction="row" justify="flex-end" alignItems="center">
                                                        <Typography variant='h5' style={{paddingRight: 20}}>{ this.state.cashier.opening_amount }  <small style={{fontSize: 12}}>Bs.</small></Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #CDCDCD', paddingBottom: 10, }}>
                                                    <Typography variant='caption' color="textSecondary">Monto total de ingresos:</Typography>
                                                    <Grid container direction="row" justify="flex-end" alignItems="center">
                                                        <Typography variant='h5' style={{paddingRight: 20}}>{ this.state.incomeAmount.toFixed(2) } <small style={{fontSize: 12}}>Bs.</small> </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #CDCDCD', paddingBottom: 10, }}>
                                                    <Typography variant='caption' color="textSecondary">Monto total de egresos:</Typography>
                                                    <Grid container direction="row" justify="flex-end" alignItems="center">
                                                        <Typography variant='h5' style={{paddingRight: 20}}>{ this.state.expensesAmount.toFixed(2) }  <small style={{fontSize: 12}}>Bs.</small></Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #CDCDCD', paddingBottom: 10, }}>
                                                    <Typography variant='caption' color="textSecondary">Monto en caja:</Typography>
                                                    <Grid container direction="row" justify="flex-end" alignItems="center">
                                                        <Typography variant='h5' style={{paddingRight: 20}}>{ (this.state.totalAmount).toFixed(2) }  <small style={{fontSize: 12}}>Bs.</small></Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} style={{ borderBottom: '1px solid #CDCDCD', paddingBottom: 10, }}>
                                                    <Typography variant='caption' color="textSecondary">Monto faltante:</Typography>
                                                    <Grid container direction="row" justify="flex-end" alignItems="center">
                                                        <Typography variant='h5' style={{paddingRight: 20}}>{ this.state.missingAmount.toFixed(2) }  <small style={{fontSize: 12}}>Bs.</small></Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} style={{paddingTop: 30, paddingBottom: 20}}>
                                                    { this.state.realAmount == 0 &&
                                                        <Alert severity="info">
                                                            <AlertTitle>Información!</AlertTitle>
                                                                Ingresa la cantidad de los diferentes cortes de billetes y/o monedas en su correspondiente casilla para realizar el arqueo de caja.
                                                            </Alert>
                                                    }
                                                    { this.state.realAmount > 0 && this.state.missingAmount > 0 &&
                                                        <Alert severity="warning">
                                                            <AlertTitle>Advertencia!</AlertTitle>
                                                                Tienes un monto faltante, revisa que la cantidad de cada corte de billetes y/o monedas sea la correcta e ingresalas nuevamente.
                                                            </Alert>
                                                    }

                                                    { this.state.realAmount > 0 && this.state.missingAmount == 0 &&
                                                        <Alert severity="success">
                                                            <AlertTitle>Bien hecho!</AlertTitle>
                                                                El monto ingresado es correcto!
                                                            </Alert>
                                                    }
                                                </Grid>
                                                <Grid item md={12} style={{paddingBottom: 10}}>
                                                    <Button
                                                        variant="contained"
                                                        style={{backgroundColor: color.green, color: 'white'}}
                                                        fullWidth
                                                        size="large"
                                                        disabled={this.state.cashierId == 0 ? true : false}
                                                        endIcon={<IoIosLock>Vender</IoIosLock>}
                                                        onClick={(e) => {
                                                            if(this.state.realAmount > 0){
                                                                this.setState({ showDialog: true })
                                                            }else{
                                                                this.props.enqueueSnackbar('Debes ingresar la cantidad de cortes de billetes y/o monedas!', { variant: 'error' })
                                                            }
                                                        }}
                                                    >
                                                        Cerrar caja
                                                    </Button>
                                                </Grid>
                                                <Grid item md={12} style={{ textAlign: 'center' }}>
                                                    <Link to='/dashboard/cashiers' style={{ textDecoration: 'underline' }}>Volver</Link>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Delete dialog */}
                                <Dialog
                                    open={ this.state.showDialog }
                                    TransitionComponent={ transition }
                                    onClose={ () => this.setState({ showDialog: false }) }
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    fullWidth
                                    maxWidth='sm'
                                >
                                <DialogTitle id="alert-dialog-title">{"Confirmar cierre de caja"}</DialogTitle>
                                <DialogContent>
                                    <Grid>
                                        <TextField
                                            id="input-small-description"
                                            label="Observaciones"
                                            placeholder="Observaciones antes del cierre de caja"
                                            helperText="Puedes ingresar alguna observación que tengas Ej: Describir el motivo del algún monto faltante."
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            style={{ marginTop: 0}}
                                            multiline
                                            rows={3}
                                            value={ this.state.inputObservations }
                                            onChange={ event => this.setState({inputObservations: event.target.value}) }
                                        />
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={ () => this.setState({ showDialog: false }) } >
                                        Cancelar
                                    </Button>
                                    <Button onClick={ this.handleSubmit } style={{color: color.primary}}>
                                        Si, cerrar caja!
                                    </Button>
                                </DialogActions>
                                </Dialog>
                            </div>
                        </Grid>
                    </main>
                </div>
            </>
        );
    }
}

const Bill = (props) => {
    return(
        <Grid container spacing={2} style={{flexDirection: 'row'}}>
            <Grid item style={{ width: '30%'}}>
                <img src={`/img/bills/${ props.name }.png`} alt={ props.name } style={{width: 100}}/>
            </Grid>
            <Grid item style={{ width: '30%' }}>
                <TextField
                    id="outlined-basic"
                    label="Cantidad"
                    variant="outlined"
                    value={ props.count }
                    onChange={ props.onChange }
                    inputProps={{ type: 'number', min: '0', step: '1' }}
                    onClick={ e => e.target.select() }
                />
            </Grid>
            <Grid item style={{ width: '30%', textAlign: 'right' }}>
                <Typography variant="h5" style={{ marginLeft: 20, marginTop: 10 }}>{ (props.BillValue * props.count).toFixed(2) }</Typography>
            </Grid>
        </Grid>
    );
}


const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(CashiersClose));