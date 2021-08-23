import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import './Home.css';
import socket from '../../api/socket';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Home = () => {
  const [pincode, setPincode] = useState('');
  const [branches, setBranches] = useState([]);
  const [state, setState] = useState(false);
  const [emptyRes,setEmptyRes]=useState(false);
  const history = useHistory();

  const listBranch = async (e) => {
    e.preventDefault();
    const data = await fetch('https://sp-hunt.herokuapp.com/listbranches', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pincode: pincode,
      }),
    });
    const res = await data.json();
    setBranches(res.map((i) => `${i.branchName}, ${i.city}`));
    if(res.length){
      setState(true);
      setEmptyRes(false);
    }
    else{
      setState(false);
      setEmptyRes(true);
    }
    console.log(res);
    socket.emit('branches', { data: res, pincode }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  };
  const login = () => {
    history.push('/login');
  };
  return (
    <div className="home">
      <div className="inputContainer">
        <h1>Let's Start The Hunt!</h1>
        <div className="search">
          <TextField
            className="textfield"
            id="outlined-basic"
            label="Enter The Pincode"
            variant="outlined"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
          <Button onClick={listBranch} className="sub-button" variant="contained" color="secondary">
            Search
          </Button>
        </div>
        <div className="list">
          {state &&  <h2>Following Branches are available for this Pincode</h2> }
          {emptyRes && <h2>Bad Bad luck, No Donut for you!!🙁</h2>}
          
          {branches.map((i) => (
            <div>{i}</div>
          ))}
        </div>
      </div>

      <div className="illustrationContainer">
        <Button onClick={login} className="sub-button" variant="contained" color="secondary">
          Login
        </Button>
        {/* <h2>Enter a Pincode</h2> */}
        <img src="/illustration.png" alt="home" />
      </div>
    </div>
  );
};

export default Home;
