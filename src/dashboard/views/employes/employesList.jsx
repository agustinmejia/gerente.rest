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
  Typography
} from '@material-ui/core';

import { IoIosMenu, IoIosAddCircle, IoIosCreate, IoIosTrash, IoMdKey, IoIosLock, IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import axios from "axios";
import { withSnackbar } from 'notistack';

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
  { id: 'status', label: 'Estado' },
  { id: 'actions', label: 'Opciones' },
];

class EmployesList extends Component {
    constructor(props){
        super(props)
        this.state = {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${this.props.authSession.token}`
          },
          showDialog: false,
          tableRows: [],
          sidebarToggled: false,
          page: 0,
          rowsPerPage: 10,
          deleteId: 0,
        }
    }

    createData(id, name, user, status, opening_amount, closing_amount) {
      let tableOptions = (
        <>
          {/* <Link to={`/dashboard/branches/${id}/edit`} style={{marginRight: 10}}>
            <Tooltip title="Editar sucursal" placement="top">
              <Fab aria-label="Editar sucursal" size='small'>
                <IoIosCreate size={25} color="#0D9CCE" />
              </Fab>
            </Tooltip>
          </Link> */}
          { status == 1 &&
            <Tooltip title="Eliminar sucursal" placement="top">
              <Fab aria-label="Eliminar sucursal" size='small' onClick={ () => this.setState({ showDialog: true, deleteId: id }) }>
                <IoIosTrash size={25} color="#F33417" />
              </Fab>
            </Tooltip>
          }
        </>
      )
      let title = <>
                    <b>{name}</b><br/>
                    <span>Cajero: {user}</span>
                  </>
      let iconStatus = status == 1 ? <Chip label="Abierta" color='primary' icon={<IoMdKey size={15} />} /> : <Chip label="Cerrada" icon={<IoIosLock size={18} />} />
      return { id, name: title, status: iconStatus, opening_amount, closing_amount, actions: tableOptions };
    }

    componentDidMount(){
        this.getData()
    }

    getData(){
      let { company } = this.props.authSession;
        fetch(`${API}/api/company/${company.id}/cashier/list`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
          let rows = [];
          if(res.cashiers){
            res.cashiers.map(cashier => {
              rows.push(this.createData(cashier.id, cashier.name, cashier.user.name, cashier.status, cashier.opening_amount, cashier.closing_amount));
            });
          }
          this.setState({tableRows: rows});
        })
        .catch(error => ({'error': error}));
    }

    hanldeDelete = () => {
    //   let options = {
    //     headers: this.state.headers
    //   }
    //   axios.get(`${API}/api/branch/${this.state.deleteId}/delete`, options)
    //   .then(response => {
    //     if(response.data.branch){
    //       this.getData();
    //       this.props.enqueueSnackbar('Sucursal eliminada correctamente!', { variant: 'success' });
    //     }else{
    //       this.props.enqueueSnackbar(response.data.error, { variant: 'error' });
    //     }
    //   })
    //   .catch(error => ({'error': error}))
    //   .finally( () => {
    //     this.setState({showDialog: false});
    //   });

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

                    <Navbar title='Empleados' />

                    <Grid style={{marginTop: 20}}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to='/dashboard/employes/create'>
                                <Button variant="contained" color="primary" endIcon={<IoIosAddCircle/>} > Nuevo</Button>
                            </Link>
                        </div>
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

                {/* Delete dialog */}
                <Dialog
                  open={ this.state.showDialog }
                  TransitionComponent={ transition }
                  onClose={ () => this.setState({ showDialog: false }) }
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
                    <Button onClick={ () => this.setState({ showDialog: false }) } color="primary">
                      Cancelar
                    </Button>
                    <Button onClick={ this.hanldeDelete } color="secondary" autoFocus>
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
  // const classes = useRowStyles();

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
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">{row.opening_amount}</TableCell>
                    <TableCell component="th" scope="row">{row.closing_amount}</TableCell>
                    <TableCell component="th" scope="row">0.00</TableCell>
                    <TableCell component="th" scope="row">0.00</TableCell>
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

// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired,
//       }),
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//   }).isRequired,
// };



const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(withSnackbar(EmployesList));