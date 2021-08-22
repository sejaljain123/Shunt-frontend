import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import socket from '../../api/socket';
import './Navbar.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

const Navbar = ({ branch }) => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnreadcount] = useState(0);
  const [accOpen, setAccOpen] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (branch) {
      getNotifications();
      console.log(`branch-${branch._id}`);
      socket.on(`branch-${branch._id}`, () => {
        getNotifications();
        // console.log('Your branch was searched on', new Date().toLocaleTimeString());
      });
    }
  }, [branch]);

  const getNotifications = async () => {
    const data = await fetch('https://sp-hunt.herokuapp.com/notifications', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    const res = await data.json();
    console.log(res);
    setNotifications(res);
    let count = 0;
    // eslint-disable-next-line
    res.map((i) => {
      if (i.read === false) {
        count++;
        toast.dark(i.message, {
          position: 'top-center',
        });
      }
    });
    setUnreadcount(count);
  };

  const signOut = () => {
    Cookies.remove('token');
    history.push('/');
  };
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            SuperProcure
          </Typography>

          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={unread} color="secondary">
                <NotificationsIcon onClick={() => setOpen(true)} />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle
                onClick={() => {
                  setAccOpen(true);
                }}
              />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {open ? (
        <div className="notifications">
          <CloseIcon className="cross" onClick={() => setOpen(false)} />

          {notifications.map((i) => (
            <div className={`not-msgs ${i.read ? ' ' : 'unread'}`} key={i.message}>
              {i.message} for pincode-{i.pincode}
              <br />
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
      <ToastContainer position="top-center" />

      {accOpen ? (
        <div className="acc">
          <CloseIcon className="cross" onClick={() => setAccOpen(false)} />
          <p onClick={signOut}>SIGN OUT</p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
export default Navbar;
