/** @format */

import React from 'react';
import './index.css';
import { BASE_URL, STAGING_SERVER_URL } from '../../Urls';

function SideBar() {

  let role=localStorage.getItem('role')
  let name=localStorage.getItem('loggedUserName')
  let designation=localStorage.getItem('userDesignation')
  let user_type=localStorage.getItem('user_type')
  let access_token=localStorage.getItem('jwtToken')
  const switchToAdmin = async () => {
    const url = `http://${"192.168.15.46"}:9001?token=${access_token}`; 
    console.log("url is ", url);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="main">
      <div className="profile-image">
        <img
          style={{ borderRadius: "100%" }}
          width={200}
          height={200}
          src="/img/profile.png"
        />
      </div>
      <div className="divider" />
      <div className="text-content">
        <span>
          <b>Name : {name}</b>
        </span>
        <br />
        <span>
          <b>Designatiom : {designation}</b>
        </span>
        <br />
        <span>
          <b>Role : {user_type}</b>
        </span>
      </div>
      {role != 1 && (
        <div className="btn-container">
          <button onClick={switchToAdmin} className="btn1">
            Approve
          </button>
          <br />
          <button className="btn1">Allocation</button>
        </div>
      )}
    </div>
  );
}

export default SideBar;
