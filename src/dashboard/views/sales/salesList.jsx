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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Slide,
  Chip,
  Typography
} from '@material-ui/core';

import { IoIosMenu, IoIosAddCircle, IoIosTrash, IoIosSearch, IoIosHome, IoMdThumbsUp } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import { withSnackbar } from 'notistack';
import moment from 'moment';
import 'moment/locale/es';
import { io } from "socket.io-client";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { EmptyList, LoadingList } from "../../components/forms";
import { env } from '../../../config/env';

const { API, SOCKET_IO, color } = env;
const socket = io(SOCKET_IO);

const transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tableColumns = [
    { id: 'number', label: 'Nro' },
    { id: 'customer', label: 'Cliente' },
    { id: 'total', label: 'Total' },
    { id: 'status', label: 'Estado' },
    { id: 'actions', label: 'Opciones', align: 'right', align: 'right' },
];

class salesList extends Component {
  constructor(props){
    super(props)
    this.state = {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${this.props.authSession.token}`
      },
      loadingList: false,
      branchId: this.props.authSession.branch.id,
      defaultImg: `${API}/images/default-image.png`,
      showDialog: false,
      tableRows: [],
      sidebarToggled: false,
      page: 0,
      inputFilter: '',
      salesLis: [],
      rowsPerPage: 10,
      deleteId: 0,
    }
  }

  componentDidMount(){
    if(this.state.branchId){
      this.getSales();
    }

    socket.on(`sales branch ${this.state.branchId}`, data => {
      this.getSales();
    });
  }

  createData(id, number, customer, type, status, total, hour) {
    let detail = (
      <>
        <Typography>{customer}</Typography>
        <small>{moment(hour).fromNow()}</small>
      </>
    );
    let tableOptions = (
        <>
        { status.id == 3 &&
          <Tooltip title="Pedido entregada" placement="top">
            <Fab aria-label="Pedido entregada" size='small' onClick={ () => this.handleStatus(id, 5) } style={{marginRight: 10}}>
              <IoMdThumbsUp size={25} color="#3C85E7" />
            </Fab>
          </Tooltip>
        }
          <Tooltip title="Eliminar venta" placement="top">
              <Fab aria-label="Eliminar venta" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
                  <IoIosTrash size={25} color="#F33417" />
              </Fab>
          </Tooltip>
        </>
    );

    return { number, customer: detail, total, status: <Chip size="small" label={status.name} style={{ backgroundColor: status.color , color: 'white' }} />, actions: tableOptions };
  }

  // filter = e => {
  //   let {value} = e.target
  //   this.setState({inputFilter: value});
  //   let rows = [];
  //   if(value){
  //     this.state.salesLis.map(sale => {
  //       let customer = `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}`;
  //       let sale_number = sale.sale_number.toString();
  //       if(customer.toLowerCase().search(value.toLowerCase()) >= 0 || sale_number.search(value) >= 0){
  //         rows.push(this.createData(sale.sale_number, customer, sale.sale_type, sale.total));
  //       }
  //     });
  //   }else{
  //     this.state.salesLis.map(sale => {
  //       let customer = `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}`
  //       rows.push(this.createData(sale.sale_number, customer, sale.sale_type, sale.total));
  //     });
  //   }
  //   this.setState({tableRows: rows});
  // }

  getSales(){
    this.setState({loadingList: true});
    let { branch, user } = this.props.authSession;
    fetch(`${API}/api/branch/${branch.id}/sales/${user.id}`, {headers: this.state.headers})
    .then(res => res.json())
    .then(res => {
      this.renderRowTable(res.sales);
    })
    .catch(error => ({'error': error}))
    .finally(() => this.setState({loadingList: false}));
  }

  renderRowTable(sales){
    let rows = [];
    if(sales){
      this.setState({salesLis: sales});
      sales.map(sale => {
          let customer = `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}`
          rows.push(this.createData(sale.id, sale.sale_number, customer, sale.sale_type, sale.status, sale.total, sale.created_at));
      });
    }
    this.setState({tableRows: rows});
  }

  handleStatus(id, sales_status_id){
    this.setState({loading: true});

    axios({
        method: 'post',
        url: `${API}/api/sales/${id}/update/status`,
        data: JSON.stringify({sales_status_id}),
        headers: this.state.headers
    })
    .then(res => {
      if(res.data.sale){
        this.getSales();
        this.props.enqueueSnackbar(`Pedido ${sales_status_id == 4 ? 'asignado a delivery' : 'Entregado' } !`, { variant: 'success' });

        // Emitir para actualizar vista del cajero
        socket.emit(`change status`, {status: sales_status_id, branchId: this.state.branchId});
      }else{
        this.props.enqueueSnackbar('Ocurrió un error, intente nuevamente.', { variant: 'error' });
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
        this.setState({loading: false});
    });
  }

  hanldeDelete = () => {
    // let options = {
    //     headers: this.state.headers
    // }
    // axios.get(`${API}/api/product/${this.state.deleteId}/delete`, options)
    // .then(response => {
    //     if(response.data.product){
    //         this.getSales();
    //         this.props.enqueueSnackbar('Sucursal eliminada correctamente!', { variant: 'success' });
    //     }else{
    //         this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
    //     }
    // })
    // .catch(error => ({'error': error}))
    // .finally( () => {
    //     this.setState({showDialog: false});
    // });
    this.setState({showDialog: false});
  }

  render() {
      return (
          <div className='app'>
              <Sidebar toggled={this.state.sidebarToggled} onToggle={ () => this.setState({ sidebarToggled: !this.state.sidebarToggled }) }/>
              <main style={{paddingTop: 10}}>
                  <div className="btn-toggle" onClick={() => this.setState({ sidebarToggled: !this.state.sidebarToggled })}>
                      <IoIosMenu size={40} />
                  </div>

                  <Navbar title={<h1 style={{marginLeft: 20, color: 'rgba(0,0,0,0.6)'}}> Mis ventas del día</h1>} />

                  <Grid style={{marginTop: 20}}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Link to='/dashboard/sales/create'>
                              <Button variant="contained" style={{backgroundColor: color.primary, color: 'white'}} endIcon={<IoIosAddCircle/>} > Nueva</Button>
                          </Link>
                      </div>

                      <div style={{ marginTop: 30, marginBottom: 50 }}>
                        {/* Filtro */}
                        {/* <Grid container style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                          <Grid item>
                            <Paper component="form" style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: 30, maxWidth: 400 }}>
                              <Tooltip title="Buscar" placement="bottom" style={{ marginRight: 10 }}>
                                <IconButton color="primary" aria-label="Buscar">
                                  <IoIosSearch size={25} />
                                </IconButton>
                              </Tooltip>
                              <InputBase
                                placeholder="Nro o cliente"
                                inputProps={{ 'aria-label': 'Nro o cliente' }}
                                // onChange={ this.filter }
                                value={ this.state.inputFilter }
                              />
                              <Divider orientation="vertical" style={{ height: 30, margin: 10, marginRight: 20 }} />
                              <Tooltip title="Cambiar sucursal actual" placement="top" style={{ marginLeft: 10 }}>
                                <IconButton color="primary" aria-label="Cambiar sucursal actual" onClick={ (e) =>  this.props.enqueueSnackbar('Ésta opción no está disponible para tu tipo de suscripción.', { variant: 'warning' }) }>
                                  <IoIosHome size={25} />
                                </IconButton>
                              </Tooltip>
                            </Paper>
                          </Grid>
                        </Grid> */}

                        <Paper >
                          { this.state.loadingList && <LoadingList /> }
                          { this.state.tableRows.length === 0 && !this.state.loadingList && <EmptyList /> }
                          { this.state.tableRows.length > 0 &&
                            <>
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.number}>
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
                            </>
                          }
                        </Paper>
                      </div>
                  </Grid>
              </main>

              {/* Delete dialog */}
              <Dialog
                open={ this.state.showDialog }
                TransitionComponent={ transition }
                onClose={ () => this.setState({ showDialog: false }) }
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                  <DialogTitle id="alert-dialog-title">Anular venta</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                          Ésta acción eliminará de forma permanente el registro y no podrás usarlo en el futuro.
                      </DialogContentText>
                    </DialogContent>
                  <DialogActions>
                    <Button onClick={ () => this.setState({ showDialog: false }) } color="primary">
                      Cancelar
                    </Button>
                    <Button onClick={ this.hanldeDelete } color="secondary">
                      Eliminar
                    </Button>
                  </DialogActions>
              </Dialog>
          </div>
      );
  }
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(salesList));