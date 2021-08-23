import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import socket from '../../api/socket';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

const Nav = ({ branches, setBranches, listBranch }) => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnreadcount] = useState(0);
  const [accOpen, setAccOpen] = useState(false);
  const [search, setSearch] = useState('');
  const history = useHistory();
  const signOut = () => {
    Cookies.remove('token');
    history.push('/');
  };

  useEffect(() => {
    adminNotifications();

    socket.on(`admin-notifications`, () => {
      adminNotifications();
    });
  }, []);
  const adminNotifications = async () => {
    const data = await fetch('https://sp-hunt.herokuapp.com/adminnotifications', {
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
      if (i.admin_read === false) {
        count++;
        toast.info(
          `Branch named ${i.branchId.branchName} was searched on ${i.date} for pincode ${i.pincode}`,
          {
            position: 'top-center',
          }
        );
      }
    });
    setUnreadcount(count);
  };
  useEffect(
    () => {
      onSearch();
    },
    // eslint-disable-next-line
    [search]
  );

  const onSearch = async () => {
    if (search) {
      const data = await fetch(`https://sp-hunt.herokuapp.com/search?branch=${search}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      const res = await data.json();
      console.log(res);
      setBranches(res);
    } else {
      listBranch();
    }
  };
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            SuperProcure
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

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
            <div className={`not-msgs ${i.admin_read ? ' ' : 'unread'}`} key={i.branch_id}>
              Branch named {i.branchId.branchName} was searched on {i.date} for pincode:
              {i.pincode}
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

export default Nav;
