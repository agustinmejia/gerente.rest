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
  Typography,
  Collapse,
  Box,
  Avatar
} from '@material-ui/core';

import { IoIosMenu, IoIosAddCircle, IoIosTrash, IoIosSearch, IoIosHome, IoMdThumbsUp, IoIosArrowDropupCircle, IoIosArrowDropdownCircle, IoIosBasket, IoIosRestaurant, IoMdRestaurant, IoMdCloseCircle, IoMdTime } from "react-icons/io";
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
const defaultImg = `${API}/images/default-image.png`;
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

  createData(id, number, customer, type, status, total, hour, details, observations) {
    let detail = (
      <>
        <Typography>{customer}</Typography>
        <small>{moment(hour).fromNow()}</small>
      </>
    );
    let tableOptions = (
        <>
        { status.id == 2 &&
          <Tooltip title="Pedido listo" placement="top">
            <Fab aria-label="Pedido listo" size='small' onClick={ () => this.handleStatus(id, 3) } style={{marginRight: 10}}>
              <IoMdTime size={25} style={{color: color.green}} />
            </Fab>
          </Tooltip>
        }
        { status.id == 3 &&
          <Tooltip title="Pedido entregada" placement="top">
            <Fab aria-label="Pedido entregada" size='small' onClick={ () => this.handleStatus(id, 5) } style={{marginRight: 10}}>
              <IoMdThumbsUp size={25} style={{color: color.blue}} />
            </Fab>
          </Tooltip>
        }
          <Tooltip title="Eliminar venta" placement="top">
              <Fab aria-label="Eliminar venta" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
                  <IoIosTrash size={25} style={{color: color.red}} />
              </Fab>
          </Tooltip>
        </>
    );

    let labelType = ''
    let iconType = null
    switch (type) {
      case 'table':
        labelType = 'Para la mesa';
        iconType = <IoIosRestaurant color='white' />
        break;
      case 'para llevar':
        labelType = 'Para llevar';
        iconType = <IoIosBasket color='white' />
        break;
      default:
        labelType = 'Desconocido';
        iconType = <IoMdCloseCircle color='white' />
        break;
    }

    let statusLabel = (
      <Tooltip title={ labelType } placement="top">
        <Chip
          icon={ iconType }
          size="small"
          style={{ backgroundColor: status.color , color: 'white' }}
          label={ status.name }
        />
      </Tooltip>
    )


    return { number, customer: detail, total, status: statusLabel, details, observations, actions: tableOptions };
  }

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
          rows.push(this.createData(sale.id, sale.sale_number, customer, sale.sale_type, sale.status, sale.total, sale.created_at, sale.details, sale.observations));
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
    let options = {
        headers: this.state.headers
    }
    axios.get(`${API}/api/sales/${this.state.deleteId}/delete`, options)
    .then(response => {
        if(response.data.sale_id){
          this.getSales();
          this.props.enqueueSnackbar('Venta anulada correctamente!', { variant: 'success' });
        }else{
          this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
        }
    })
    .catch(error => ({'error': error}))
    .finally( () => {
        this.setState({showDialog: false});
    });
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
                                      <TableCell />
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
                                        <Row key={row.id} row={row} />
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
                    <Button onClick={ () => this.setState({ showDialog: false }) }>
                      Cancelar
                    </Button>
                    <Button onClick={ this.hanldeDelete } style={{color: color.red}}>
                      Eliminar
                    </Button>
                  </DialogActions>
              </Dialog>
          </div>
      );
  }
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  // Calcular ingresos y gastos
  var opening_amount = parseFloat(row.opening_amount);
  var income = 0;
  var expenses = 0;

  return (
    <React.Fragment>
      <TableRow hover role="checkbox" tabIndex={-1}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}
          </IconButton>
        </TableCell>
        {tableColumns.map((column) => {
          const value = row[column.id];
          return (
            <TableCell key={column.id} align={column.align}>
              {column.format && typeof value === 'number' ? column.format(value) : value}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} style={{marginBottom: 30}}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de la venta
              </Typography>
              <Table size="small" aria-label="purchases" style={{marginBottom: 10}}>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    row.details.map(item => {
                      let { image, name, type } = item.product;
                      return(
                        <TableRow>
                          <TableCell scope="row">
                            <Grid container spacing={2}>
                              <Grid item>
                                <Avatar src={ image ? `${API}/storage/${image.replace('.', '-cropped.')}` : defaultImg} style={{width: 50, height: 50}} />
                              </Grid>
                              <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={1}>
                                  <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                      { name }
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      { type }
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell scope="row">{ item.quantity }</TableCell>
                          <TableCell scope="row">{ item.price }</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
              <div>
                <b>Observaciones</b> : <span>{ row.observations ? row.observations : 'Ninguna' }</span>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(salesList));