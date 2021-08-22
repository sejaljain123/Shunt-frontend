import React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import socket from '../../api/socket';
import Navbar from '../Navbar/Navbar';
import './User.css';

const User = () => {
  const [branch, setBranch] = useState(null);

  useEffect(() => {
    userBranch();
    // getNotifications();
    socket.emit('test', 'string hellooo', (err) => {
      console.log(err);
    });
  }, []);

  const userBranch = async () => {
    const data = await fetch('http://localhost:5000/branch', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    const res = await data.json();
    console.log(res);
    setBranch(res[0]);
  };

  return (
    <div>
      <Navbar branch={branch} />
      <div className="branch-container">
        {branch && (
          <div className="branchCard">
            <h1>
              {branch.branchName} Branch,{branch.city}
            </h1>
            <div className="branch-content">
              <p>Incharge: {branch.incharge}</p>
              <p>Address : {branch.address}</p>
              <p>Pincode: {branch.pincode.join(', ')}</p>
              <p>Contact Number: {branch.contact.join(', ')}</p>
            </div>
          </div>
        )}
        <img src={'./branch.svg'} alt="" />
      </div>
    </div>
  );
};

export default User;
