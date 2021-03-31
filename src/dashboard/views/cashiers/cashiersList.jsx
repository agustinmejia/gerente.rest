import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Box,
  Button,
  IconButton,
  Tooltip,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Chip,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Backdrop,
  CircularProgress,
  // From
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import {
    Alert,
    AlertTitle
} from '@material-ui/lab';

import { IoIosMenu, IoIosTrash, IoMdKey, IoIosArrowDropdownCircle, IoIosArrowDropupCircle, IoIosLock, IoIosJournal } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import axios from "axios";

// Components
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { env } from '../../../config/env';

const { API } = env;

const transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tableColumns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Caja' },
  { id: 'iconStatus', label: 'Estado' },
  { id: 'actions', label: 'Opciones' },
];

// Tab panels config
function tabProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

class CashiersList extends Component {
    constructor(props){
        super(props)
        this.state = {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${this.props.authSession.token}`
          },
          loading: false,
          showDialogDelete: false,
          showDialogDetails: false,
          tabActive: 0,
          cashiers: [],
          tableRows: [],
          cashierDetails: [],
          sidebarToggled: false,
          page: 0,
          rowsPerPage: 10,
          deleteId: 0,
          // form
          cashierId: null,
          inputAmount: 0,
          inputDescription: '',
          inputType: 1
        }
    }

    createData(id, name, user, status, opening_amount, closing_amount, missing_amount, details) {
      let tableOptions = (
        <>
          { status == 1 &&
            <Tooltip title="Movimiento de caja" placement="top" style={{marginRight: 10}}>
              <Fab aria-label="Movimiento de caja" size='small' onClick={ () => this.setState({ showDialogDetails: true, cashierDetails: details, cashierId: id }) }>
                <IoIosJournal size={25} color="#0D9CCE" />
              </Fab>
            </Tooltip>
          }

          { status == 1 && details.length > 0 &&
            <Link to={`/dashboard/cashiers/${id}/close`}>
              <Tooltip title="Cerrar caja" placement="top">
                <Fab aria-label="Cerrar caja" size='small'>
                  <IoIosLock size={25} color="#138D75" />
                </Fab>
              </Tooltip>
            </Link>
          }
          { status == 1 && details.length == 0 &&
            <Tooltip title="Eliminar caja" placement="top">
              <Fab aria-label="Eliminar caja" size='small' onClick={ () => this.setState({ showDialogDelete: true, deleteId: id }) }>
                <IoIosTrash size={25} color="#F33417" />
              </Fab>
            </Tooltip>
          }
        </>
      )
      let title = <>
                    <b>{name}</b><br/>
                    <small>Abierta por <b>{user}</b></small>
                  </>
      let iconStatus = status == 1 ? <Chip label="Abierta" color='primary' icon={<IoMdKey size={15} />} /> : <Chip label="Cerrada" icon={<IoIosLock size={18} />} />
      return { id, name: title, iconStatus, status, opening_amount, closing_amount, missing_amount, details, actions: tableOptions };
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
      let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/cashier/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
          this.renderRowsTable(res.cashiers);
        })
        .catch(error => ({'error': error}));
    }

    renderRowsTable(cashiers){
      if(cashiers){
        let rows = [];
        cashiers.map(cashier => {
          rows.push(this.createData(cashier.id, cashier.name, cashier.user.name, cashier.status, cashier.opening_amount, cashier.closing_amount, cashier.missing_amount, cashier.details));
        });
        this.setState({tableRows: rows, cashiers});
      }
    }

    hanldeDelete = () => {
      let options = {
        headers: this.state.headers
      }
      axios.get(`${API}/api/cashier/${this.state.deleteId}/delete`, options)
      .then(response => {
        if(response.data.cashier_id){
          let { cashier_id } = response.data;

          // Update cashier list
          let { cashiers } = this.state;
          let indexDelete = null;
          let rows = []
          cashiers.map((item) => {
            if(item.id != cashier_id){
              rows.push(item);
            }
          });

          this.renderRowsTable(rows);

          this.props.enqueueSnackbar('Caja eliminada correctamente!', { variant: 'success' });
        }else{
          this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
        }
      })
      .catch(error => ({'error': error}))
      .finally( () => {
        this.setState({showDialogDelete: false});
      });

      this.setState({showDialogDelete: false});
    }

    handleSubmit = (event) => {
      event.preventDefault();

      this.setState({loading: true, showDialogDetails: false});
      let { cashierId, inputAmount, inputDescription, inputType } = this.state;
      let { user } = this.props.authSession;
      let params = {
          amount: inputAmount,
          description: inputDescription,
          type: inputType,
          user_id: user.id
      }

      axios({
          method: 'post',
          url: `${API}/api/cashier/${cashierId}/detail/store`,
          data: params,
          headers: this.state.headers
      })
      .then(res => {
        if(res.data.cashier){
          let { cashier } = res.data;
          // Update cashier info
          let { cashiers } = this.state;
          cashiers.map((item, index) => {
            if(cashier.id == item.id){
              cashiers[index] = cashier;
            }
          });
          this.renderRowsTable(cashiers);

          this.props.enqueueSnackbar('Movimiento de caja registrado correctamente!', { variant: 'success' });
        }else{
          this.props.enqueueSnackbar(res.data.error, { variant: 'error' })
        }
      })
      .catch((err) => this.props.enqueueSnackbar('Ocurrió un error en nuestro servidor!', { variant: 'error' }))
      .then(() => this.setState({loading: false, inputAmount: '', inputDescription: '', inputType: 1}));
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

                    <Navbar title={<h1 style={{marginLeft: 20}}> Cajas</h1>} />

                    <Grid style={{marginTop: 20}}>
                        <div style={{ marginTop: 30, marginBottom: 50 }}>
                            <Paper >
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
                            </Paper>
                        </div>
                    </Grid>
                </main>

                {/* Details dialog */}
                <Dialog
                  open={ this.state.showDialogDetails }
                  TransitionComponent={ transition }
                  onClose={ () => this.setState({ showDialogDetails: false }) }
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  fullWidth
                  maxWidth='md'
                >
                  <form onSubmit={ this.handleSubmit } >
                    <DialogTitle id="alert-dialog-title">{"Movimientos de caja"}</DialogTitle>
                    <DialogContent id="alert-dialog-description">
                      <div style={{marginTop: -10}}>
                        <AppBar position="static">
                          <Tabs value={ this.state.tabActive } onChange={(event, newValue) => { this.setState({tabActive: newValue})}} aria-label="Movimientos de caja">
                            <Tab label="Registros de caja" {...tabProps(0)} />
                            <Tab label="Crear nuevo" {...tabProps(1)} />
                          </Tabs>
                        </AppBar>
                        <TabPanel value={ this.state.tabActive } index={0}>
                          <TableDetails details={ this.state.cashierDetails } />
                        </TabPanel>
                        <TabPanel value={ this.state.tabActive } index={1}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} style={{ marginBottom: 20 }}>
                              <Alert severity="info">
                                <AlertTitle>Información</AlertTitle>
                                Puedes registrar los ingresos y egresos adicionales a la caja, luego ésta información se reflejará al momento de realizar el arqueo de caja.
                              </Alert>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                  name="amount"
                                  variant="outlined"
                                  required
                                  fullWidth
                                  id="input-amount"
                                  label="Monto"
                                  placeholder='100'
                                  autoFocus
                                  helperText="Monto de dinero"
                                  value={ this.state.inputAmount }
                                  inputProps={{ type: 'number', min: '0.5', step: '0.5' }}
                                  onChange={ event => this.setState({inputAmount: event.target.value}) }
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Tipo de registro</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        variant="outlined"
                                        label="Tipo de registro"
                                        inputProps={{ 'aria-label': 'Tipo de registro' }}
                                        required
                                        fullWidth
                                        value={ this.state.inputType }
                                        onChange={ event => this.setState({inputType: event.target.value}) }
                                        >
                                          <MenuItem key={1} value="1">Ingreso</MenuItem>
                                          <MenuItem key={2} value="2">Egreso</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="input-description"
                                    label="Descripción del registro"
                                    placeholder='Gasto para pago de servicios báasicos'
                                    name="description"
                                    helperText="Debes escribir el motivo por el cual realizaste el ingreso o egreso."
                                    multiline
                                    rows={2}
                                    value={ this.state.inputDescription }
                                    onChange={ event => this.setState({inputDescription: event.target.value}) }
                                />
                            </Grid>
                          </Grid>
                        </TabPanel>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={ () => this.setState({ showDialogDetails: false }) } color="primary">
                        Cerrar
                      </Button>
                      { this.state.tabActive == 1 &&
                        <Button type="submit" color="secondary">
                          Guardar registro
                        </Button>
                      }
                    </DialogActions>
                  </form>
                </Dialog>

                {/* Delete dialog */}
                <Dialog
                  open={ this.state.showDialogDelete }
                  TransitionComponent={ transition }
                  onClose={ () => this.setState({ showDialogDelete: false }) }
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Ésta acción eliminará de forma permanente el registro y no podrás usarlo en el futuro.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={ () => this.setState({ showDialogDelete: false }) } color="primary">
                      Cancelar
                    </Button>
                    <Button onClick={ this.hanldeDelete } color="secondary">
                      Eliminar
                    </Button>
                  </DialogActions>
                </Dialog>
            </div>
          </>
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
  row.details.map(detail => {
    if(detail.type == 1){
      income += parseFloat(detail.amount);
    }else if(detail.type == 2){
      expenses += parseFloat(detail.amount);
    }
  });

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
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de caja
              </Typography>
              <Table size="small" aria-label="purchases" style={{marginBottom: 30}}>
                <TableHead>
                  <TableRow>
                    <TableCell>Monto de apertura</TableCell>
                    <TableCell>Ingresos</TableCell>
                    <TableCell>Egresos</TableCell>
                    <TableCell>Monto de cierre</TableCell>
                    <TableCell>Faltante</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{ opening_amount }</TableCell>
                    <TableCell component="th" scope="row">{ income.toFixed(2) }</TableCell>
                    <TableCell component="th" scope="row">{ expenses.toFixed(2) }</TableCell>
                    <TableCell component="th" scope="row"><b>{ (income - expenses + opening_amount).toFixed(2) }</b></TableCell>
                    <TableCell component="th" scope="row">{ row.status == 2 ? <b style={{color: row.missing_amount == 0 ? 'black' :'red'}}>{row.missing_amount}</b> : 'no definido' }</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
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

const TableDetails = props => {

  function createData(id, description, type, amount) {
    let labelType = type == 1 ? <Chip size="small" label="Ingreso" color="primary" /> : <Chip size="small" label="Egreso" color="secondary" />;
    return {id, description, type: labelType, amount };
  }

  var rows = [];
  var total = 0;
  props.details.map(row => {
    rows.push(createData(row.id, row.description, row.type, row.amount));
    if(row.type == 1){
      total += parseFloat(row.amount);
    }else{
      total -= parseFloat(row.amount);
    }
  });


  return (
    <TableContainer component={Paper} style={{ maxHeight: 400 }}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell><b>Detalle</b></TableCell>
            <TableCell align="right"><b>Tipo</b></TableCell>
            <TableCell align="right"><b>Monto</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.description}
              </TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
          <TableRow key='0'>
            <TableCell component="th" scope="row"><b>TOTAL</b></TableCell>
            <TableCell />
            <TableCell align="right"><b>Bs. {total.toFixed(2)}</b></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(CashiersList));