import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import './Form.css';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const Form = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = await fetch('http://localhost:5000/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result = await data.json();
    Cookies.set('token', result.token);
    console.log(result);

    if (result.success === true) {
      history.push(username === 'admin' ? '/admin' : '/user');
    } else {
      alert('Invalid Credentials');
      history.push('/login');
    }
  };

  const home = () => {
    history.push('/');
  };
  return (
    <>
      <Button onClick={home} className="pincodebutton" variant="contained" color="secondary">
        Search For Pincode
      </Button>
      <div className="container">
        <h1>Enter The Credentials</h1>
        <form noValidate autoComplete="off">
          <TextField
            className="textfield"
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            className="textfield"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={handleSignIn}
            className="sub-button"
            variant="contained"
            color="secondary"
          >
            LOGIN
          </Button>
        </form>
      </div>
    </>
  );
};

export default Form;
