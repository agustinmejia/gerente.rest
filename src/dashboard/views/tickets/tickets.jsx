import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    IconButton,
    // Cards
    Card,
    CardHeader,
    Avatar,
    CardMedia,
    CardContent,
    CardActions,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { IoMdHeart, IoMdShare } from "react-icons/io";

import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';
import { io } from "socket.io-client";
import { disableBodyScroll } from 'body-scroll-lock';

import { makeStyles } from '@material-ui/core/styles';
import './tickets.css'; // Tell webpack that Button.js uses these styles

import { env } from '../../../config/env';

const { API, SOCKET_IO } = env;
const socket = io(SOCKET_IO);


const useStyles = makeStyles({
    root: {
        backgroundImage: `url(../../img/background-tickets.jpeg)`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        border: 0,
        color: 'white',
        height: '100%',
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: '100%',
    },
    ticketItem: {
        border: '5px solid white'
    },
    ticketItemText: {
        color: 'white',
        textAlign: 'center',

    }
});

const ListTickets = [
    {
        id: 3,
        number : '0003',
        time: 'Hace 9 min',
        status: 1
    },
    {
        id: 4,
        number : '0004',
        time: 'Hace 5 min',
        status: 1
    },
    {
        id: 5,
        number : '0005',
        time: 'Hace 3 min',
        status: 1
    },
    {
        id: 6,
        number : '0006',
        time: 'Hace 2 min',
        status: 1
    },
    {
        id: 7,
        number : '0007',
        time: 'Hace 1 min',
        status: 2
    },
    {
        id: 8,
        number : '0008',
        time: 'Hace 30 seg',
        status: 1
    }
];

const Tickets = (props) => {
  const { token, branch } = props.authSession;
  const headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
  const [listTickets, setListTickets] = useState([])
  const classes = useStyles();

  useEffect(() => {
    socket.on(`sales tickets ${branch.id}`, data => {
      getSales();
    });
    getSales();
    disableBodyScroll(document)
  }, []);

  function getSales(){
    fetch(`${API}/api/branch/${branch.id}/sales/tickets`, {headers})
    .then(res => res.json())
    .then(res => {
      setListTickets(res.sales);
      console.log(res)
    })
    .catch(error => ({'error': error}));
  }

  return (
    <>
      <div className={classes.root}>
          <Grid container className={classes.mask}>
              <Grid item md={5}>
                  <div style={{padding: 20 }}>
                      <RecipeReviewCard />
                  </div>
              </Grid>
              <Grid item md={7}>
                  <Grid container style={{marginTop: 20}}>
                      {
                          listTickets.map(ticket => {
                              let classTicket = [classes.ticketItem];
                              if(ticket.status.id == 3){
                                  classTicket.push('parpadea');
                              }
                              return(
                                  <Grid item md={6} className={classTicket} key={ ticket.id }>
                                      <Typography variant='h1' className={classes.ticketItemText}>T-{ ticket.sale_number }</Typography>
                                      <Typography variant='subtitle2' style={{marginLeft:10}}>{ moment(ticket.created_at).fromNow() }</Typography>
                                  </Grid>
                              );
                          })
                      }
                  </Grid>
              </Grid>
          </Grid>
      </div>
    </>
  );
}

const useStylesCard = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
    // padding: 20
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));


const RecipeReviewCard = () => {
  const classes = useStylesCard();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      <CardMedia
        className={classes.media}
        image="https://cdn.pixabay.com/photo/2015/03/26/09/42/breakfast-690128_960_720.jpg"
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <IoMdHeart />
        </IconButton>
        <IconButton aria-label="share">
          <IoMdShare />
        </IconButton>
      </CardActions>
    </Card>
  );
}

const mapStateToProps = (state) => {
    return {
        authSession: state.authSession,
    }
}

export default connect(mapStateToProps)(Tickets);