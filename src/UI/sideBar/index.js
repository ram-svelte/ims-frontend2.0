/** @format */

import React from 'react';
import './index.css';

function SideBar() {
  let role=localStorage.getItem('role')
  let name=sessionStorage.getItem('loggedUserName')
  let designation=sessionStorage.getItem('userDesignation')
  let user_type=localStorage.getItem('user_type')
	return (
		<div className='main'>
			<div className='profile-image'>
				<img
					style={{ borderRadius: '100%' }}
					width={200}
					height={200}
					src='/img/profile.png'
				/>
			</div>
          <div className='divider'/> 
			<div className='text-content'>
				<span>
					<b>Name : {name}</b>
				</span>
				<br />
				<span>
					<b>Designatiom : {designation}</b>
				</span>
				<br />
				<span>
					<b>Role :  {user_type}</b>
				</span>
			</div>
          {role!=1&&  <div className='btn-container'>
                <button className='btn'>Approve</button>
                <br/>
                <button className='btn'>Allocation</button>
            </div>}
		</div>
	);
}

export default SideBar;
