import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
    Grid,
    Typography,
    Avatar,
    Card,
    CardContent,
    List,
    ListItem,
    Button,
    ListItemAvatar,
    ListItemText,
    Tooltip
} from "@material-ui/core";
import { IoIosMenu, IoMdHome, IoMdBus, IoMdInformationCircle, IoMdArrowDropright, IoMdGitBranch, IoIosRestaurant, IoLogoBuffer, IoIosContacts, IoMdCart, IoMdCash } from "react-icons/io";

import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import moment from 'moment';
import CountUp from 'react-countup';
import 'moment/locale/es';

import { Bar, Doughnut } from 'react-chartjs-2';

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";

import { Link } from "react-router-dom";
import Tour from 'reactour'
import { YoutubeEmbed } from "../../components/forms";
import { env } from '../../../config/env';

const { API, color } = env;

const steps = [
    {
        selector: '.config-step',
        content: 'Menú desplegable en el cual puedes acceder a las diferentes opciones de configuración de la plataforma.',
    },
    {
        selector: '.sidebar-step',
        content: 'Menú donde se encuantran todas las opciones con las que cuenta la plataforma.',
    },
    {
        selector: '.sidebarToggle-step',
        content: 'Botón para abrir o cerrar el menú.',
    }
];


const Salesoptions = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
            barThickness: 12,
            maxBarThickness: 10,
            barPercentage: 0.5,
            categoryPercentage: 0.5,
            ticks: {
                fontColor: color.black
            },
            gridLines: {
                display: false,
                drawBorder: false
            }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: color.black,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: color.gray,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: color.gray
          }
        }
      ]
    },
    tooltips: {
        backgroundColor: color.white,
        bodyFontColor: color.black,
        borderColor: color.gray,
        borderWidth: 1,
        enabled: true,
        footerFontColor: color.black,
        intersect: false,
        mode: 'index',
        titleFontColor: color.black
    }
};

const bestSellerOptions = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
        display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
        backgroundColor: color.white,
        bodyFontColor: color.black,
        borderColor: color.gray,
        borderWidth: 1,
        enabled: true,
        footerFontColor: color.gray,
        intersect: false,
        mode: 'index',
        titleFontColor: color.black
    }
};

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            sidebarToggled: false,
            tourActive: false,
            // Metrics
            cashAmount: 0,
            countCustomer: 0,
            countProducts: 0,
            countSales: 0,

            // Bar Chart
            historySalesData: [],
            historySpendingData: [],
            historySalesLabels: [],

            // Doughnut Chart
            bestSellerData: [],
            bestSellerLabels: []
        }
    }

    async componentDidMount(){
        let { user, company } = this.props.authSession;
        let res = await fetch(`${API}/api/comapny/${company.id}/metrcis/${user.id}`, {headers: this.state.headers})
                        .then(res => res.json())
                        .catch(error => ({'error': error}));
        if(!res.error){
            this.setState({
                cashAmount: res.cash,
                countCustomer: res.count_customer,
                countProducts: res.count_products,
                countSales: res.count_sales
            });

            // History Sales
            let historySalesData = [];
            let historySpendingData = [];
            let historySalesLabels = [];
            res.current_sales.map(sale => {
                historySalesData.push(sale.total);
                historySpendingData.push(sale.gasto);
                historySalesLabels.push(moment(sale.date).format('dddd'));
            });
            this.setState({ historySalesData, historySpendingData, historySalesLabels });

            // Set data bestSeller
            let bestSellerData = [];
            let bestSellerLabels = [];
            res.best_seller.map((detail, index) => {
                let quantity = 0;
                detail.sales.map(sale => {
                    quantity += sale.quantity;
                });

                // Set value and labels to Doughnut Chart
                bestSellerData.push(quantity);
                bestSellerLabels.push(`${detail.name} - ${detail.type}`);
            });
            
            this.setState({ bestSellerData, bestSellerLabels });
        }

    }

    render() {
        const bestSellerData = {
            datasets: [
                {
                    data: this.state.bestSellerData,
                    backgroundColor: [ color.blue, color.red, color.orange, color.green, color.gray],
                    borderWidth: 2,
                    borderColor: color.white,
                    hoverBorderColor: '#D0D3D4'
                }
            ],
            labels: this.state.bestSellerLabels
        };

        const salesData = {
            datasets: [
            {
                backgroundColor: color.green,
                data: this.state.historySalesData,
                label: 'Total ventas Bs'
            },
            {
                backgroundColor: color.red,
                data: this.state.historySpendingData,
                label: 'Total gastos Bs'
            }
            ],
            labels: this.state.historySalesLabels
        };

        return (
            <div className='app'>
                <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) } className="sidebar-step" classNameToggle="sidebarToggle-step" />
                <main style={{ marginTop: 10, padding: 0,}}>
                    <div style={{ paddingLeft: 24, paddingRight: 24 }}>
                        <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                            <IoIosMenu size={40} />
                        </div>
                        <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Bienvenido, { this.props.authSession.user ? this.props.authSession.user.name : '' }!</h1>} />
                    </div>

                    {/* Show tutorial */}
                    { this.props.globalConfig.help.tour &&
                        <>
                            <div style={{backgroundColor: 'white'}}>
                                <Grid item xs={12} style={{display: 'flex', padding: 30, paddingTop: 50, paddingBottom: 80,}}>
                                    <Grid container>
                                        <Grid item sm={6} xs={12} >
                                            <Typography variant="h6" style={{marginBottom: 20}}>Acerca de Gerente de Restaurantes</Typography>
                                            <Typography variant="body2" align="justify" color="textSecondary">
                                                Gerente de Restaurantes es una aplicación web pensada para ayudarte a administrar los procesos que se llevan a cabo en tu restaurantes,
                                                tales como registro de productos, administración de ventas y compras, apertura y cierre de caja, seguimiento de inventarios y generación de reportes y gráficos
                                                que te ayudarán a tener ordenada la información de tu restaurante.
                                            </Typography>
                                            <Grid container direction="column" justify="flex-start" alignItems="flex-start" >
                                                <Grid item>
                                                    <hr style={{width: 200, height: 3}}/>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        type="button"
                                                        size="large"
                                                        variant="contained"
                                                        style={{ backgroundColor: color.primary, color: 'white', textTransform: 'capitalize'}}
                                                        endIcon={<IoMdBus size={20} />}
                                                        onClick={ event => this.setState({tourActive: true}) }
                                                    >
                                                        Hacer un tour
                                                    </Button>

                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item sm={6} xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                                            <YoutubeEmbed embedId="fU8wT6qYw7A" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                            <div style={{backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: 50}}>
                                <Grid item xs={12} style={{display: 'flex', padding: 30}}>
                                    <Grid container>
                                        <Typography variant="h6" style={{marginBottom: 20}}>Primeros pasos</Typography>
                                        <Grid item xs={12}>
                                            <List>
                                                <TutorialStep
                                                    icon={ <IoMdHome /> }
                                                    title="Completa la información de tu restaurante"
                                                    detail="Puedes completar la información de tu restaurante como el logo, un banner, telefonos de contacto y dirección."
                                                    url="/dashboard/mycompany?tour=1"
                                                    urlHelp="Administración > Mi restaurante"
                                                />
                                                <TutorialStep
                                                    icon={ <IoMdGitBranch /> }
                                                    title="Completa la información de tu o tus sucursales"
                                                    detail="Puedes completar la información de tu sucursal o incluso puedes agregar nuevas sucursales."
                                                    url="/dashboard/branches?tour=1"
                                                    urlHelp="Administración > Sucursales"
                                                />
                                                <TutorialStep
                                                    icon={ <IoIosRestaurant /> }
                                                    title="Agregar los productos que vendes en tu restaurante"
                                                    detail="Registra los productos que tienes a la venta en tu restaurante, en el caso de los productos que revendas como las gaseosas o jugos puedes administrar su inventario."
                                                    url="/dashboard/products?tour=1"
                                                    urlHelp="Administración > Productos"
                                                />
                                            </List>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </>
                    }

                    {/* Show charts */}
                    { !this.props.globalConfig.help.tour &&
                        <>
                            <div className="row" style={{ margin: 20, marginTop: 50, marginBottom: 100 }}>
                                <Grid container spacing={3}>
                                    <Grid lg={3} sm={6} xl={3} xs={12} style={{padding: 10}} >
                                        <CardMetrics title="Dinero en caja" value={ this.state.cashAmount } color={ color.blue } icon={ <IoMdCash size={50} color={ color.blue } /> } />
                                    </Grid>
                                    <Grid lg={3} sm={6} xl={3} xs={12} style={{padding: 10}} >
                                        <CardMetrics title="Nro de ventas" value={ this.state.countSales } color={ color.green } icon={ <IoMdCart size={50} color={ color.green } /> } />
                                    </Grid>
                                    <Grid lg={3} sm={6} xl={3} xs={12} style={{padding: 10}} >
                                        <CardMetrics title="Productos" value={ this.state.countProducts } color={ color.red } icon={ <IoLogoBuffer size={50} color={ color.red } /> } />
                                    </Grid>
                                    <Grid lg={3} sm={6} xl={3} xs={12} style={{padding: 10}} >
                                        <CardMetrics title="Clientes" value={ this.state.countCustomer } color={ color.yellow } icon={ <IoIosContacts size={50} color={ color.yellow } /> } />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3} style={{ marginTop: 50 }}>
                                    <Grid lg={8} sm={6} xl={8} xs={12} style={{padding: 10}} >
                                        <Card>
                                            <CardContent>
                                                <div style={{marginBottom: 10}}>
                                                    <Typography variant="h5">Venta semanal</Typography>
                                                </div>
                                                <Grid style={{padding: 20, height: 300}}>
                                                    <Bar
                                                        data={salesData}
                                                        options={Salesoptions}
                                                    />
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid lg={4} sm={6} xl={4} xs={12} style={{padding: 10}} >
                                        <Card>
                                            <CardContent>
                                                <div style={{marginBottom: 10}}>
                                                    <Typography variant="h5">Más vendidos</Typography>
                                                </div>
                                                <Grid style={{padding: 20, height: 300}}>
                                                    <Doughnut
                                                        data={bestSellerData}
                                                        options={bestSellerOptions}
                                                    />
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        </>
                    }

                </main>
                
                <Tour
                    steps={ steps }
                    isOpen={ this.state.tourActive }
                    accentColor={ color.primary }
                    onRequestClose={() => this.setState({tourActive: false})}
                />
            </div>
        );
    }
}

const TutorialStep = props => {
    return(
        <ListItem>
            <ListItemAvatar>
            <Avatar style={{backgroundColor: color.primary}}>
                { props.icon }
            </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={ props.title }
                secondary={ 
                    <>
                        { props.detail }
                        <Tooltip
                            title={
                            <React.Fragment>
                                <Typography color="inherit" variant="subtitle1"> <IoMdInformationCircle size={12} /> Ayuda</Typography>
                                <Typography color="inherit" variant="body2"><em>{"Haz click o también puedes hacerlo en el menú lateral en la opción:"}</em> <br/> <b> <IoMdArrowDropright size={10} /> { props.urlHelp }</b></Typography>
                            </React.Fragment>
                            }
                        >
                            <Link to={ props.url }> Haz click aquí</Link>
                        </Tooltip>
                    </>
                }
            />
        </ListItem>
    );
}

const CardMetrics = (props) => (
    <Card sx={{ height: '100%' }} style={{ borderBottom: `5px solid ${props.color}` }}>
        <CardContent>
            <Grid container spacing={5} sx={{ justifyContent: 'space-between' }}>
                <Grid item xs={8}>
                    <Typography color="textSecondary" gutterBottom variant="h6" noWrap > { props.title } </Typography>
                    <Typography color="textPrimary" variant="h3" style={{color: 'rgba(0,0,0,0.8)', paddingTop: 10}} > <CountUp end={props.value} duration={2} /> </Typography>
                </Grid>
                <Grid item xs={4}>
                    { props.icon }
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

YoutubeEmbed.propTypes = {
    embedId: PropTypes.string.isRequired
};


const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
        globalConfig: state.globalConfig,
    }
}

export default connect(mapStateToProps)(withSnackbar(Home));