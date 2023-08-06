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
        localStorage.setItem("loggedUserName", decoded.uname);
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("app_type", response.data.show_app.app_switch);
        const access_token = localStorage.getItem("jwtToken");
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
    if (token) {
      login();
      let decoded = jwt_decode(token);
      localStorage.setItem("loggedUserName", decoded.uname);
      localStorage.setItem("jwtToken", token);
      // localStorage.setItem("app_type", response.data.show_app.app_switch);
      const access_token = localStorage.getItem("jwtToken");
      console.log(access_token, "dlhdgdhbhdb ");
      const apiCall = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/role`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            if (response.data.data.length !== 0) {
              console.log("response.data", response.data);
              const role = response.data.data[0].role;
              localStorage.setItem("role", role);
              localStorage.setItem(
                "user_type",
                response.data.data[0].user_type
              );
              if (role === 2 || role === 3) {
                props.onLogin();
                history.push("/pendingorders");
              } else if (role === 4) {
                props.onLogin();
                history.push("/approvedorders");
              } else {
                props.onLogout();

                // Toaster("", "Access Denied");
                // setAuthenticated(true)
              }
            } else {
              props.onLogout();

              // Toaster("", "Access Denied");
              // setAuthErrorMsg(true);
            }
          }
        } catch (error) {}
      };
      apiCall();
    }
  }, [token]);

  return !token ? (
    <div style={{ overflow: "hidden" }}>
      <div style={{ background: "white", height: "100vh" }} className="home">
        <div style={{ background: "black", height: "80px", width: "100%" }}>
          <img
            style={{ margin: "25px", marginLeft: "80px" }}
            src="/img/logo.png"
          />
        </div>
        <div className="container-fluid">
          <div className=" home-main">
            <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
              {/* <div className="d-absolute  mt-4 border-line"> */}
              <img
                style={{
                  bottom: "150",
                  position: "absolute",
                  width: "950px",
                  height: "400",
                  marginLeft: "-10px",
                  bottom: "0",
                }}
                src="img/bg.png"
              />
              {/* </div> */}
            </div>

            <div
              style={{
                background: "#0083B7",
                height: "100vh",
                margin: "auto",
                paddingTop: "15%",
                marginRight: "-20px",
              }}
              className="col-lg-6 col-md-6 col-sm-6 "
            >
              {/* <div> */}
              {/* <h2 className="mb-4"> Welcome To Asset Management </h2> */}
              {/* <ReactCardFlip sty isFlipped={isFlipped} flipDirection="horizontal"> */}
              {/* <div > */}
              <LoginForm onFlip={handleFlip} onLogin={props.onLogin} />

              {/* </div> */}
              {/* </div> */}
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
