import React from "react";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../context/auth-context";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import "../css/LoginForm.css";
import { USER_LOGIN_URL, BASE_URL } from "../Urls";
import LoadingSpinner from "../UI/LoadingSpinner";
import LoginLoadingSpinner from "../UI/LoginLoadingSpinner";

function LoginForm(props) {
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true);

  const ctx = useContext(AuthContext);
  const [values, setValues] = useState({
    password: "",
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
    app_type: "IMS",
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
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
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
        setLoading(true)
      } else if (response.status === 200) {
        const token = response.data.data;
        let decoded = jwt_decode(token);
        sessionStorage.setItem("loggedUserName", decoded.uname);
        sessionStorage.setItem("jwtToken", token);
        sessionStorage.setItem("app_type", response.data.show_app.app_switch);
        const access_token = sessionStorage.getItem("jwtToken");
        try {
          const response = await axios.get(`${BASE_URL}/api/role`, {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          if (response.status === 200) {
            if (response.data.data.length !== 0) {
              const role = response.data.data[0].role;
              if (role === 1 || role === 3 || role === 4) {
                props.onLogin();
                setLoading(true);
                setAuthErrorMsg(false);
                history.push("/");
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
    <>
      <div className="form-group">
        <input
          type="text"
          value={userName}
          onChange={userNameHandler}
          className="form-control mb-4"
          placeholder="Username"
        />
      </div>

      <div className="form-group">
        <div>
          <input
            type={passwordType}
            value={password}
            name="password"
            onChange={userPasswordHandler}
            className="form-control mb-4"
            id="exampleInputPassword1"
            placeholder="Password"
          />
        </div>

        <span
          className="btn"
          onClick={togglePassword}
          style={{
            height: "38px",
            width: "38px",
            border: "0px",
            float: "right",
            padding: "0px",
            marginTop: "-55px",
          }}
        >
          {passwordType === "password" ? (
            <FontAwesomeIcon icon={faEye} />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} />
          )}
        </span>
      </div>
      {loading ? (
        <form onSubmit={formSubmitHandler}>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      ) : (
        <div className="btn btn-primary">
          <LoginLoadingSpinner />
        </div>
      )}

      {errorMsg && (
        <p className="error_msg"> *Username/Password Is Incorrect</p>
      )}
      {authErrorMsg && <p className="error_msg"> *Access Denied</p>}
      {passwordError && <p className="error_msg">{passwordError} </p>}
    </>
  );
}

export default LoginForm;
