import React from "react";
import "../css/home.css";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import BackLoginForm from "../components/BackLoginForm";
import { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import jwt_decode from "jwt-decode";
import { BASE_URL, USER_LOGIN_URL } from "../Urls";
import { Toast } from "../Utils/Toastify";
import LoadingSpinner from "../UI/LoadingSpinner";

function Login(props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { search } = useLocation();
  let token = queryString.parse(search).token;
  let appType = queryString.parse(search).app_type;
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const login = async () => {
    try {
      const request = {
        token: token,
        app_type: appType,
      };
      const response = await axios.post(
        `${USER_LOGIN_URL}/api/users/login`,
        request
      );
      if (response.status === 200) {
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
                // setLoading(true);
                // setAuthErrorMsg(false);
                history.push("/");
              } else {
                // setLoading(true);
                // setAuthErrorMsg(true);
              }
            } else {
              // setLoading(true);
              // setAuthErrorMsg(true);
            }
          } else {
            // setLoading(true);
            // setAuthErrorMsg(true);
          }
        } catch (error) {
          setLoading(true);
        }

        //props.onFlip();
        //comment this 2 lines and uncomment above line for mail box integration
      } else if (response.status == 400) {
        console.log("in 400 ");

        Toast("User is already logout", "error");
        return;
      }
    } catch (error) {
      setLoading(true);
      // setErrorMsg(true);
    }
    // setLoading(false)
  };
  // const getRole = async (token) => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/api/role`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (response.status === 200) {
  //       if (response.data.data.length !== 0) {
  //         const role = response.data.data[0].role;
  //         if (role === 1 || role === 3 || role === 4) {
  //           props.onLogin();
  //           history.push("/");
  //         } else {
  //           console.log("role api not working");
  //         }
  //       } else {
  //         console.log("error in role api");
  //       }
  //     } else {
  //       console.log("error in else role api");
  //     }
  //   } catch (error) {
  //     console.log("catch block");
  //   }
  // };

  useEffect(() => {
    console.log("working fine", token);
    console.log("app type", appType);
    if (token) {
      // let decoded = jwt_decode(token);
      // sessionStorage.setItem("loggedUserName", decoded.uname);
      // sessionStorage.setItem("jwtToken", token);
      // sessionStorage.setItem("app_type", appType);
      console.log("login ins called");
      // getRole(token);
      login();
    }
  }, [token]);

  return !token ? (
    <div className="home">
      <div className="container-fluid">
        <div className="row home-main">
          <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
            <div className="row px-3 mt-4 border-line">
              <img src="img/home-store.png" />
            </div>
          </div>

          <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
            <div className="welcome">
              <h2 className="mb-4"> Welcome To Asset Management </h2>
              <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <LoginForm onFlip={handleFlip} onLogin={props.onLogin} />
                <BackLoginForm onLogin={props.onLogin} onFlip={handleFlip} />
              </ReactCardFlip>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "25%",
      }}
    >
      <LoadingSpinner />
    </div>
  );
}

export default Login;
