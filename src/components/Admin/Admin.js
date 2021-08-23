import React, { useEffect, useState } from 'react';
import './Admin.css';
import Cookies from 'js-cookie';
import Nav from './Nav';

const Admin = () => {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    listBranch();
  }, []);

  const listBranch = async () => {
    const data = await fetch('https://sp-hunt.herokuapp.com/listallbranches', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
    const res = await data.json();
    setBranches(res);
    console.log(res);
  };
  return (
    <>
      <Nav branch={branches} />
      <div className="listAllBranches">
        {branches.map((i) => (
          <div key={i} className="branch_container">
            <h2>
              Branch:&nbsp;{i.branchName},{i.city}
            </h2>
            <div className="branch_content">
              <p>Incharge: {i.incharge}</p>
              <p>Address : {i.address}</p>
              <p>Pincode: {i.pincode.join(', ')}</p>
              <p>Contact Number: {i.contact.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Admin;
