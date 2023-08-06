/** @format */

import React from 'react';
import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/auth-context';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../css/LoginForm.css';
import { USER_LOGIN_URL, BASE_URL } from '../Urls';
import LoadingSpinner from '../UI/LoadingSpinner';
import LoginLoadingSpinner from '../UI/LoginLoadingSpinner';

function LoginForm(props) {
	const history = useHistory();
	const [errorMsg, setErrorMsg] = useState(false);
	const [authErrorMsg, setAuthErrorMsg] = useState(false);
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordType, setPasswordType] = useState('password');
	const [passwordError, setPasswordError] = useState('');
	const [loading, setLoading] = useState(true);

	const ctx = useContext(AuthContext);
	const [values, setValues] = useState({
		password: '',
		showPassword: false,
	});

	const formSubmitHandler = (e) => {
		setLoading(true);
		e.preventDefault();
		login();
		setLoading(false);
	};
	const data = {
		user_name: userName,
		password: password,
		app_type: 'IMS',
	};

	const userNameHandler = (e) => {
		setUserName(e.target.value);
		setAuthErrorMsg(false);
		setErrorMsg(false);
	};
	const userPasswordHandler = (e) => {
		setPassword(e.target.value);
		setAuthErrorMsg(false);
		setErrorMsg(false);
	};

	const togglePassword = () => {
		if (passwordType === 'password') {
			setPasswordType('text');
			return;
		}
		setPasswordType('password');
	};
	const login = async () => {
		try {
			const request = data;
			const response = await axios.post(
				`${USER_LOGIN_URL}/api/users/login`,
				request
			);
			if (
				(response.status === 200 && response.data.status === 2) ||
				response.data.status === 3
			) {
				setLoading(false);
				setPasswordError(response.data.message);
				setLoading(true);
			} else if (response.status === 200) {
				const token = response.data.data;
				let decoded = jwt_decode(token);
				sessionStorage.setItem('loggedUserName', decoded.uname);
				sessionStorage.setItem('jwtToken', token);
				sessionStorage.setItem('app_type', response.data.show_app.app_switch);
				const access_token = sessionStorage.getItem('jwtToken');
				try {
					const response = await axios.get(`${BASE_URL}/api/role`, {
						headers: { Authorization: `Bearer ${access_token}` },
					});
					if (response.status === 200) {
						if (response.data.data.length !== 0) {
							const role = response.data.data[0].role;
              localStorage.setItem('user_type',response?.data?.data[0]?.user_type)
              localStorage.setItem('role',role)
							if (role === 1 || role === 3 || role === 4) {
								props.onLogin();
								setLoading(true);
								setAuthErrorMsg(false);
								history.push('/');
							} else {
								setLoading(true);
								setAuthErrorMsg(true);
							}
						} else {
							setLoading(true);

							setAuthErrorMsg(true);
						}
					} else {
						setLoading(true);
						setAuthErrorMsg(true);
					}
				} catch (error) {
					setLoading(true);
				}

				//props.onFlip();
				//comment this 2 lines and uncomment above line for mail box integration
			}
		} catch (error) {
			setLoading(true);
			setErrorMsg(true);
		}
	};

	return (
		<div className='welcome'>
			<div
				style={{
					background: 'black',
					width: 'full',
					borderRadius: '8px 8px 0px 0px',
				}}
			>
				<h1 style={{ color: 'white', padding: '5px 0px 0px 20px' }}>Welcome</h1>
				<p style={{ color: '#0083B7', width: '80%',padding: '5px 0px 5px 20px',paddingBottom:"20px" ,fontSize:"14px" }}>
					Lorem ipsum dolor sit amet consectetur. Elit congue pretium sapien
					cursus id odio ornare.
				</p>
			</div>
			<div style={{ padding: '20px' }}>
				<div className='form-group'>
					<input
						type='text'
						value={userName}
						onChange={userNameHandler}
						className='form-control mb-4'
						placeholder='Username'
					/>
				</div>

				<div className='form-group'>
					<div>
						<input
							type={passwordType}
							value={password}
							name='password'
							onChange={userPasswordHandler}
							className='form-control mb-4'
							id='exampleInputPassword1'
							placeholder='Password'
						/>
					</div>

					<span
						className='btn'
						onClick={togglePassword}
						style={{
							height: '38px',
							width: '38px',
							border: '0px',
							float: 'right',
							padding: '0px',
							marginTop: '-55px',
						}}
					>
						{passwordType === 'password' ? (
							<FontAwesomeIcon icon={faEye} />
						) : (
							<FontAwesomeIcon icon={faEyeSlash} />
						)}
					</span>
				</div>

				{loading ? (
					<form style={{display:"flex",justifyContent:"center"}} onSubmit={formSubmitHandler}>
						<button
							type='submit'
							className='btn btn-primary'
              style={{width:"50%"}}
						>
							Login
						</button>
					</form>
				) : (
					<div className='btn btn-primary'>
						<LoginLoadingSpinner />
					</div>
				)}

				{errorMsg && (
					<p className='error_msg'> *Username/Password Is Incorrect</p>
				)}
				{authErrorMsg && <p className='error_msg'> *Access Denied</p>}
				{passwordError && <p className='error_msg'>{passwordError} </p>}
			</div>
		</div>
	);
}

export default LoginForm;
