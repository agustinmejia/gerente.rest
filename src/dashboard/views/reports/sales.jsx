import React, { Component } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Backdrop,
    CircularProgress,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography
}from '@material-ui/core';
import {
    Alert,
    AlertTitle,
    ToggleButtonGroup,
    ToggleButton
} from '@material-ui/lab';

import { IoIosMenu, IoMdCalendar, IoIosCalendar, IoMdCrop, IoIosCog, IoMdPrint } from "react-icons/io";
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios from "axios";
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import moment from 'moment';
import 'moment/locale/es';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../env';

const { API, services, location, color } = env;

const containerStyle = {
    height: 350, width: '100%', marginTop: 50
};

class SalesReports extends Component {
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
            reportType: 'day',
            // Form
            inputDate: '',
            inputStart: '',
            inputEnd: '',
            selectMonth: 'none',
            inputYear: 2021,
            radioType: 'sales',
            report: [],
            groupReport: null,
            discountReport: 0,
            reportDate: {}
        }
    }

    componentDidMount(){
        let date = new Date();
        this.setState({selectMonth: date.getMonth() +1})
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        let { reportType, inputDate, selectMonth, inputYear, inputStart, inputEnd, radioType } = this.state;
        let params = {};

        // Validación dependiendo del tipo de rango de fecha
        if(reportType == 'day'){
            if(inputDate == ''){
                this.props.enqueueSnackbar('Debes ingresar la fecha del reporte!', { variant: 'warning' });
                return false;
            }
            params = {type: reportType, date: inputDate, group: radioType}
        }
        if(reportType == 'month'){
            if(selectMonth == 'none' || inputYear == ''){
                this.props.enqueueSnackbar('Debes ingresar el mes y el año del reporte!', { variant: 'warning' });
                return false;
            }
            params = { type: reportType, month: selectMonth, year: inputYear, group: radioType }
        }
        if(reportType == 'range'){
            if(inputStart == '' || inputEnd == ''){
                this.props.enqueueSnackbar('Debes ingresar la fecha de inicio y de fin del reporte!', { variant: 'warning' });
                return false;
            }
            params = { type: reportType, start: inputStart, finish: inputEnd, group: radioType }
        }
        // ============================================

        let { company } = this.props.authSession;

        this.setState({loading: true});
        axios({
            method: 'post',
            url: `${API}/api/company/${company.id}/report/sales`,
            data: params,
            headers: this.state.headers
        })
        .then(res => {
            let report = [];
            // Si el reporte está agrupado por productos verificar que los productos tengan ventas
            // sino, vaciar el arreglo
            if(res.data.group == 'products'){
                let countSales = 0;
                res.data.report.map(item => {
                    countSales += item.sales.length;
                });
                report = countSales > 0 ? res.data.report : []
            }else{
                report = res.data.report
            }

            this.setState({
                report,
                groupReport: res.data.group,
                discountReport: res.data.discount,
                reportDate: res.data.date
            });

            
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

                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Reporte de ventas</h1>} />
                        
                        {/* Form */}
                        <Paper style={{ backgroundColor: 'white', padding: 30, marginTop: 50}}>
                            <form onSubmit={ this.handleSubmit }>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Grid container direction="row" justify="flex-end" alignItems="flex-start">
                                            <ToggleButtonGroup
                                                value={ this.state.reportType }
                                                exclusive
                                                onChange={ (event, newReportType) => { if(newReportType) this.setState({reportType: newReportType, report: [] }) } }
                                                aria-label="Tipo de aporte"
                                            >
                                                <ToggleButton value="day" aria-label="Diario">
                                                    <IoMdCalendar size={20} />
                                                </ToggleButton>
                                                <ToggleButton value="month" aria-label="Mensual">
                                                    <IoIosCalendar size={20} />
                                                </ToggleButton>
                                                <ToggleButton value="range" aria-label="Rango de fecha">
                                                    <IoMdCrop size={20} />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Grid>
                                    </Grid>
                                    {/* Form day */}
                                    {
                                        this.state.reportType == 'day' &&
                                        <>
                                            <Grid item lg={3} sm={6} xs={6}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    id="inputDate"
                                                    label="Fecha"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={event => this.setState({inputDate: event.target.value})}
                                                />
                                            </Grid>
                                        </>
                                    }
                                    {/* Form month */}
                                    {
                                        this.state.reportType == 'month' &&
                                        <>
                                            <Grid item lg={3} sm={4} xs={4}>
                                                <FormControl variant="outlined" fullWidth>
                                                    <InputLabel htmlFor="outlined-age-native-simple">Mes</InputLabel>
                                                    <Select
                                                        native
                                                        value={ this.state.selectMonth }
                                                        onChange={ event => this.setState({selectMonth: event.target.value}) }
                                                        label="Mes"
                                                        inputProps={{
                                                            name: 'month',
                                                            id: 'outlined-age-native-simple',
                                                        }}
                                                    >
                                                        <option aria-label="none" value=""></option>
                                                        <option value={1}>Enero</option>
                                                        <option value={2}>Febrero</option>
                                                        <option value={3}>Marzo</option>
                                                        <option value={4}>Abril</option>
                                                        <option value={5}>Mayo</option>
                                                        <option value={6}>Junio</option>
                                                        <option value={7}>Julio</option>
                                                        <option value={8}>Agosto</option>
                                                        <option value={9}>Septiembre</option>
                                                        <option value={3}>Octubre</option>
                                                        <option value={3}>Noviembre</option>
                                                        <option value={3}>Diciembre</option>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item lg={2} sm={4} xs={4}>
                                                <TextField
                                                    fullWidth
                                                    id="input-year"
                                                    label="Año"
                                                    variant="outlined"
                                                    value={ this.state.inputYear }
                                                    onChange={ event => this.setState({inputYear: event.target.value}) }
                                                />
                                            </Grid>
                                        </>
                                    }

                                    {/* Form range */}
                                    {
                                        this.state.reportType == 'range' &&
                                        <>
                                            <Grid item lg={3} sm={4} xs={4}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    id="inputStart"
                                                    label="Fecha de inicio"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={event => this.setState({inputStart: event.target.value})}
                                                />
                                            </Grid>
                                            <Grid item lg={3} sm={4} xs={4}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    id="inputEnd"
                                                    label="Fin"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={event => this.setState({inputEnd: event.target.value})}
                                                />
                                            </Grid>
                                        </>
                                    }
                                    <Grid item lg={6} sm={6} xs={6}>
                                        <Button
                                            variant="contained"
                                            style={{backgroundColor: color.primary, color: 'white', height: 55}}
                                            endIcon={<IoIosCog />}
                                            type="submit"
                                        >
                                            Generar
                                        </Button>
                                        { this.state.report.length > 0 &&
                                            <ReactToPrint content={() => this.componentRef} documentTitle="Reporte de ventas" pageStyle="margin: 10px;">
                                                <PrintContextConsumer>
                                                    {({ handlePrint }) => (
                                                        <Button
                                                            variant="contained"
                                                            style={{backgroundColor: color.red, color: 'white', height: 55, marginLeft: 5}}
                                                            endIcon={<IoMdPrint />}
                                                            onClick={ handlePrint }
                                                        >
                                                            Imprimir
                                                        </Button>
                                                    )}
                                                </PrintContextConsumer>
                                            </ReactToPrint>
                                        }
                                    </Grid>
                                    <Grid item sm={12} style={{marginTop: 10}}>
                                        <RadioGroup row aria-label="position" name="position" defaultValue="sales" >
                                            <Grid container direction="row" alignItems="flex-start">
                                                <Grid item>
                                                    <FormControlLabel
                                                        value="sales"
                                                        control={<Radio color="primary" />}
                                                        label="Por Ventas"
                                                        labelPlacement="end"
                                                        onChange={ (event) => this.setState({radioType: event.target.value}) }
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <FormControlLabel
                                                        value="products"
                                                        control={<Radio color="primary" />}
                                                        label="Por Productos"
                                                        labelPlacement="end"
                                                        onChange={ (event) => this.setState({radioType: event.target.value}) }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>

                        {/* Table */}
                        <Paper style={{ backgroundColor: 'white', padding: 30, marginTop: 20}}>
                            { this.state.report.length == 0 && this.state.groupReport == null &&
                                <div>
                                    <Alert severity="info">
                                        <AlertTitle>Información</AlertTitle>
                                        Puedes elegir el tipo de reporte que deseas según el tiempo o la forma en que lo desees visualizar y presionar el botón <strong>Generar!</strong>
                                    </Alert>    
                                </div>
                            }                            
                            
                            {/* Reporte agrupado por ventas */}
                            { 
                                this.state.groupReport == 'sales' && 
                                <>
                                    <ReportGroupSales data={ this.state.report } ref={el => (this.componentRef = el)} />
                                    <div style={{ display: "none" }}>
                                        <PrintReport
                                            type="sales"
                                            company={this.props.authSession.company}
                                            data={ this.state.report }
                                            ref={el => (this.componentRef = el)}
                                            reportType={ this.state.reportType }
                                            reportDate={ this.state.reportDate }
                                        />
                                    </div>
                                </>
                            }

                            {/* Reporte agrupado por productos */}
                            {
                                this.state.groupReport == 'products' &&
                                <>
                                    <ReportGroupProducts data={ this.state.report } discount={ this.state.discountReport } ref={el => (this.componentRef = el)} />
                                    <div style={{ display: "none" }}>
                                        <PrintReport
                                            type="products"
                                            company={this.props.authSession.company}
                                            data={ this.state.report }
                                            discount={ this.state.discountReport }
                                            ref={el => (this.componentRef = el)}
                                            reportType={ this.state.reportType }
                                            reportDate={ this.state.reportDate }
                                        />
                                    </div>
                                </>
                            }
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

const ReportGroupSales = props => {
    const { data } = props;
    var totalSale = 0;
    var totalDiscount = 0;

    if(data.length == 0){
        return(
            <div>
                <Typography variant="h6" color="textSecondary">No hay datos para mostrar!</Typography>
            </div>
        );
    }

    return(
        <div className="table-responsive">
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>N&deg;</th>
                        <th>Cliente</th>
                        <th>Atendido por</th>
                        <th>Detalle</th>
                        <th>Monto</th>
                        <th>Descuento</th>
                        <th style={{textAlign: 'right'}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) => {
                            let total = 0;
                            let details = '';
                            item.details.map(detail => {
                                total += parseFloat(detail.price) * detail.quantity;
                                details += `${detail.quantity} ${detail.product.name}, `
                            });
                            totalSale += total;
                            totalDiscount += parseFloat(item.discount);
                            return(
                                <tr key={item.id}>
                                    <td>{ index +1 }</td>
                                    <td>{ item.customer.person.first_name }</td>
                                    <td>{ item.employe.name }</td>
                                    <td><small>{ `${details.substring(0, details.length -2)}.` }</small></td>
                                    <td>{ total.toFixed(2) } Bs.</td>
                                    <td>{ item.discount } Bs.</td>
                                    <td style={{textAlign: 'right'}}>{ (total - parseFloat(item.discount)).toFixed(2) }  Bs.</td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td colSpan="6"><b>TOTAL</b></td>
                        <td style={{textAlign: 'right'}}><b>{ (totalSale - totalDiscount).toFixed(2) } Bs.</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const ReportGroupProducts = props => {
    const { data, discount } = props;
    var totalSale = 0;

    if(data.length == 0){
        return(
            <div>
                <Typography variant="h6" color="textSecondary">No hay datos para mostrar!</Typography>
            </div>
        );
    }

    return(
        <div className="table-responsive">
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>N&deg;</th>
                        <th>Producto</th>
                        <th>Precio actual</th>
                        <th>Cantidad</th>
                        <th>Precio de venta (~)</th>
                        <th style={{textAlign: 'right'}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item, index) => {
                            let quantity = 0;
                            let total_price = 0;
                            let avg_price = 0;
                            
                            item.sales.map(sale => {
                                quantity += sale.quantity;
                                total_price += parseFloat(sale.price);
                            });

                            avg_price = item.sales.length > 0 ? total_price/item.sales.length : 0;
                            totalSale += quantity * avg_price;

                            if(quantity > 0){
                                return(
                                    <tr key={item.id}>
                                        <td>{ index +1 }</td>
                                        <td>{ item.name } { item.type }</td>
                                        <td>{ item.price }</td>
                                        <td>{ quantity }</td>
                                        <td>{ avg_price.toFixed(2) } Bs.</td>
                                        <td style={{textAlign: 'right'}}>{ (quantity * avg_price).toFixed(2) }  Bs.</td>
                                    </tr>
                                )
                            }
                        })
                    }
                    <tr>
                        <td colSpan="5"><b>DESCUENTO</b></td>
                        <td style={{textAlign: 'right'}}><b>{ discount.toFixed(2) } Bs.</b></td>
                    </tr>
                    <tr>
                        <td colSpan="5"><b>TOTAL</b></td>
                        <td style={{textAlign: 'right'}}><b>{ (totalSale - discount).toFixed(2) } Bs.</b></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const PrintReport = React.forwardRef((props, ref) => {
    const { type, company, reportType, reportDate } = props;
    return(
        <div ref={ref}>
            <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{marginTop: 10, marginBottom: 40}}>
                {/* Información del restaurante */}
                {
                    company != undefined &&
                    <Grid item>
                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                            <Grid item>
                                <img src={ company.logos ? `${API}/storage/${company.logos.replace('.', '-cropped.')}` : `${API}/images/logo.png`} alt='logo' style={{width: 80}} />
                            </Grid>
                            <Grid item style={{marginLeft: 10}}>
                                <b style={{fontSize: 20}}>{ company.name }</b><br/>
                                <small>{ company.phones ? company.phones : '' }</small><br/>
                                <small>{ company.address ? company.address : '' }</small><br/>
                                <small>{ company.city.name } - { company.city.state } - { company.city.country }</small>
                            </Grid>
                        </Grid>
                    </Grid>
                }

                {/* Descripción del reporte */}
                <Grid item style={{textAlign: 'right'}}>
                    <b style={{fontSize: 30}}>Reporte de ventas</b><br/>
                    {/* Diaria */}
                    { reportType == 'day' && <span>{ moment(reportDate.date).format('dddd, DD [de] MMMM [de] YYYY') }</span> }
                    
                    {/* Mensual */}
                    { reportType == 'month' && <span>{ moment(reportDate.date).format('MMMM [de] YYYY') }</span> }
                    
                    {/* Por rango de fecha */}
                    {
                        reportType == 'range' &&
                        <>
                            <span>Del { moment(reportDate.start).format('DD [de] MMMM [de] YYYY') }</span><br/>
                            <span>Al { moment(reportDate.finish).format('DD [de] MMMM [de] YYYY') }</span>
                        </>
                    }
                </Grid>
            </Grid>
            {/* Renderizar reporte agrupado por producto */}
            {
                type == 'products' && <ReportGroupProducts {...props} />
            }
            
            {/* Renderizar reporte agrupado po venta */}
            {
                type == 'sales' && <ReportGroupSales {...props} />
            }
        </div>
    );
})

export default connect(mapStateToProps)(withSnackbar(SalesReports));