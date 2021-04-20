import React, { Component } from 'react';

import {
    Typography,
    Divider,
    Backdrop,
    CircularProgress
} from "@material-ui/core";
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';

import { env } from '../../../../env';
const { API } = env;

class Receipt extends Component {
    constructor(props){
        super(props)
        this.state = {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': `Bearer ${this.props.authSession.token}`
            },
            id: this.props.match.params.id,
            company: this.props.authSession.company,
            sale: null
        }
    }

    componentDidMount(){
        document.addEventListener("keyup", this.capturekeyPress, false);
        // let { user } = this.props.authSession;
        fetch(`${API}/api/sales/${this.state.id}`, {headers: this.state.headers})
        .then(res => res.json())
        .then(res => {
            this.setState({sale: res.sale});
        })
        .catch(error => ({'error': error}));
    }

    componentWillUnmount(){
        document.removeEventListener("keyup", this.capturekeyPress, false);
    }

    // Capture keyPress
    capturekeyPress = (e) => {
        switch (e.keyCode) {
            case 13:
                window.close();
                break;
            case 27:
                window.close();
                break;
            default:
                break;
        }
    }

    componentWillMount(){
        setTimeout(() => {
            window.print();
        }, 1000);
    }


    render() {
        if(this.state.sale === null){
            return(
                <Backdrop open={true} style={{ zIndex: 20 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ); 
        }
        const { sale } = this.state;
        const { branch } = sale;
        const { company } = this.state;
        return (
            <div style={{width: 300}}>
                
                {/* Header */}
                <div style={{textAlign: 'center'}}>
                    <div>
                        { company.logos !== null && <img src={ `${API}/storage/${company.logos.replace('.', '-cropped.')}` } style={{ width: 70 }} alt={ company.name } /> }
                    </div>
                    <div>
                        <Typography>{ company.name }</Typography>
                        {/* <small>{ company.slogan }</small><br/> */}
                        { branch.phones != null && <><small style={{fontSize: 10}}>{ branch.phones }</small><br/></> }
                        { branch.address != null && <><small style={{fontSize: 10}}>{ branch.address }</small><br/></> }
                        <small style={{fontSize: 10}}>{ branch.city.name }</small>
                    </div>
                    <div style={{marginTop: 10}}>
                        <Typography>Ticket { sale.sale_number }</Typography>
                        {/* <span style={{ padding: "1px 10px", borderRadius: 3, color: 'white', backgroundColor: '#4C4E50' }}>{ sale.sale_type }</span> */}
                        <span>{ sale.sale_type }</span>
                    </div>
                </div>
                
                {/* Customer details */}
                <div style={{marginTop: 10}}>
                    <table width="100%">
                        <tbody>
                            <tr>
                                <td><Typography variant="body2">Nombre</Typography></td>
                                <td style={{textAlign: 'right'}}><Typography variant="body2">{ `${sale.customer.person.first_name} ${sale.customer.person.last_name ? sale.customer.person.last_name : ''}` }</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant="body2">Fecha</Typography></td>
                                <td style={{textAlign: 'right'}}><Typography variant="body2">{ moment(sale.created_at).format('dddd[,] DD [de] MMMM [de] YYYY') }</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                {/* Sale details */}
                <div style={{marginTop: 10}}>
                    <ul><Divider component="li" /></ul>
                    <table width="100%">
                        <thead>
                            <tr>
                                <th><Typography variant="body2">Detalle</Typography></th>
                                <th style={{textAlign: 'right'}}><Typography variant="body2">Monto</Typography></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sale.details.map(item =>
                                    <tr key={item.id} >
                                        <td><Typography variant="body2">{ item.quantity } { item.product.name } { item.product.type }</Typography></td>
                                        <td style={{textAlign: 'right'}}><Typography variant="body2">{ (item.quantity * item.price).toFixed(2) }</Typography></td>
                                    </tr>
                                )
                            }
                            <tr>
                                <td colSpan="2">
                                    <ul><Divider component="li" /></ul>
                                </td>
                            </tr>
                            <tr>
                                <td><Typography variant="body2">DESCUENTO</Typography></td>
                                <td style={{textAlign: 'right'}}><Typography variant="body2">{ sale.discount }</Typography></td>
                            </tr>
                            <tr>
                                <td><Typography variant="body2">TOTAL</Typography></td>
                                <td style={{textAlign: 'right'}}><Typography variant="body2">{ (sale.total - sale.discount).toFixed(2) }</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div style={{textAlign: 'center', marginTop: 15}}>
                    <ul><Divider component="li" /></ul>
                    <Typography variant="body1">Gracias por su preferencia</Typography>
                </div>
                <div style={{ marginTop: 5, marginBottom: 10 }}>
                    <table width="100%">
                        <tbody>
                            <tr>
                                <td><Typography variant="body2">Atendido por { sale.employe.name }</Typography></td>
                                <td style={{textAlign: 'right'}}><Typography variant="body2">{ moment(sale.created_at).format('h:mm:ss a') }</Typography></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(Receipt);