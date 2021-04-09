import React, { Component } from 'react';
import {
    Grid,
    Button,
    IconButton,
    Tooltip,
    Divider,
    InputBase,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Fab,
    Avatar,
    Chip,
    Backdrop,
    CircularProgress
} from '@material-ui/core';

import { IoIosMenu, IoMdThumbsUp } from "react-icons/io";

import { connect } from 'react-redux';
import axios from "axios";
import { withSnackbar } from 'notistack';
import moment from 'moment';
import 'moment/locale/es';
import { io } from "socket.io-client";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../config/env';

const { API, SOCKET_IO } = env;
const defaultImg = `${API}/images/default-image.png`;
const socket = io(SOCKET_IO);

const tableColumns = [
    { id: 'number', label: 'Ticket' },
    { id: 'details', label: 'Detalle' },
    { id: 'hour', label: 'Hora de pedido' },
    { id: 'observations', label: 'Observaciones' },
    { id: 'actions', label: 'Opciones', align: 'right' },
];

class SalesKitchenList extends Component {
    constructor(props){
        super(props)
        this.state = {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${this.props.authSession.token}`
        },
        branchId: this.props.authSession.branch.id,
        tableRows: [],
        sidebarToggled: false,
        page: 0,
        salesLis: [],
        rowsPerPage: 10,
        loading: false
        }
    }

    componentDidMount(){
        if(this.state.branchId){
            this.getSales();
        }

        socket.on(`kitchen branch ${this.state.branchId}`, data => {
            this.getSales();
        });
    }

    createData(id, number, details, observations, hour) {
        let tableDetails = (
            <>
                {
                    details.map(item => {
                        let image= item.product.image ? `${API}/storage/${item.product.image.replace('.', '-small.')}` : defaultImg;
                        return(
                            <div key={ item.id }>
                                <Chip avatar={<Avatar src={image} />} label={ `${item.quantity} ${item.product.name} - ${item.product.type}` } style={{ margin: 5 }} />   
                            </div>
                        )
                    })
                }
            </>
        );
        let tableOptions = (
            <>
                <Tooltip title="Pedido listo" placement="bottom">
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<IoMdThumbsUp />}
                        onClick={ event => this.handleStatus(id) }
                    >
                        Listo
                    </Button>
                </Tooltip>
            </>
        );
        return { number: `Nro ${number}`, details: tableDetails, hour: moment(hour).fromNow(), observations: observations ? observations : 'Ninguna', actions: tableOptions };
    }

    getSales(){
        fetch(`${API}/api/branch/${this.state.branchId}/sales/kitchen`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            this.renderRowTable(res.sales);
        })
        .catch(error => ({'error': error}));
    }

    renderRowTable(sales){
        let rows = [];
        if(sales){
        this.setState({salesLis: sales});
        sales.map(sale => {
            rows.push(this.createData(sale.id, sale.sale_number, sale.details, sale.observations, sale.created_at));
        });
        }
        this.setState({tableRows: rows});
    }

    handleStatus(id){
        this.setState({loading: true});

        let params = {
            sales_status_id: 3
        };

        axios({
            method: 'post',
            url: `${API}/api/sales/${id}/update/status`,
            data: JSON.stringify(params),
            headers: this.state.headers
        })
        .then(res => {
            if(res.data.sale){
                let salesLis = [];
                this.state.salesLis.map(sale => {
                    if(sale.id != res.data.sale){
                        salesLis.push(sale);
                    }
                });

                this.renderRowTable(salesLis);
                this.props.enqueueSnackbar('Pedido listo!', { variant: 'success' });

                // Emitir para actualizar vista del cajero
                socket.emit(`change status`, {status: 3, branchId: this.state.branchId});
            }else{
                this.props.enqueueSnackbar('Ocurrió un error, intente nuevamente.', { variant: 'error' });
            }
        })
        .catch(error => console.log(error))
        .finally(() => {
            this.setState({loading: false});
        });
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

                        <Navbar title={<h1 style={{marginLeft: 20}}> Pedidos pendientes</h1>} />

                        <Grid style={{marginTop: 20}}>
                            <div style={{ marginTop: 30, marginBottom: 50 }}>
                                <Paper >
                                    <TableContainer>
                                        <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                            {tableColumns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                {column.label}
                                                </TableCell>
                                            ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.tableRows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                        {tableColumns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                            </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={this.state.tableRows.length}
                                        rowsPerPage={this.state.rowsPerPage}
                                        page={this.state.page}
                                        labelRowsPerPage='Items por página'
                                        onChangePage={(event, newPage) => this.setState({page: newPage})}
                                        onChangeRowsPerPage={(event) => this.setState({rowsPerPage: +event.target.value, page: 0})}
                                    />
                                </Paper>
                            </div>
                        </Grid>
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

export default connect(mapStateToProps)(withSnackbar(SalesKitchenList));