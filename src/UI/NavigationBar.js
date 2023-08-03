import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
// import menu from "../../public/img/menu.png"
import { useContext } from "react";
import {
  faShoppingCart,
  faSignOutAlt,
  faUser,
  FaTh,
  // faGrid,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../context/auth-context";
import "../css/NavigationBar.css";
import { USER_LOGIN_URL, SWITCH_TO_MBX_URL, REACT_APP_MBX_URL } from "../Urls";
import SearchBar from "./SearchBar";
import LoadingSpinner from "./LoadingSpinner"

import { currentPath } from "../redux/action";

function NavigationBar() {
  const state = useSelector((state) => state.handleCart.cart);
  // const userProfile = useSelector((state) => state.handleUsers.users);
  const BRANCH = sessionStorage.getItem("userBranch");
  const DESIGNATION = sessionStorage.getItem("userDesignation");
  const user_name = sessionStorage.getItem("loggedUserName");
  const ctx = useContext(AuthContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const switchAppType = sessionStorage.getItem("app_type");
  let total = state.length;
  const access_token = sessionStorage.getItem("jwtToken");
  let loggedUserName = "";
  const currentUrl = useSelector((state) => state.urlReducer.url);
  let url = "";

  try {
    loggedUserName = sessionStorage.getItem("loggedUserName")[0].toUpperCase();
  } catch (error) {
    loggedUserName = "X";
  }

  const logOut = async () => {
    // console.log(currentUrl, "url on logout");

    if (!currentUrl) {

      url = "home";
      sessionStorage.setItem("currentUrl", url);
      // dispatch(currentPath(url))
      console.log(url, "url on logout");
    } else {
      url = currentUrl;
      sessionStorage.setItem("currentUrl", url);
      // dispatch(currentPath(url))
      console.log(url, "url on logout");

    }
    // return;
    try {
      const res = await axios.request({
        method: "POST",
        url: `${USER_LOGIN_URL}/api/users/sign_out`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: { currentUrl: url },
      });
      if (res.status == 200) {
        ctx.onLogout();
      }
    } catch (err) {}
  };

  const switchToMailBox = async () => {
    setLoading(true);
    try {
      const res = await axios.request({
        method: "POST",
        url: `${SWITCH_TO_MBX_URL}`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          token: access_token,
          from_app: "IMS",
          to_app: "MBX",
        },
      });
      //console.log("response is ", res.data.optional.switch_APP_GET);
      if (res.data.status == 1) {
        setLoading(false);
        const appType = res.data.optional.app_type;
        const token = res.data.data;
        //sessionStorage.setItem("MBXtoken", token);
        const url = `${REACT_APP_MBX_URL}?token=${token}&app_type=${appType}`; //For going to IMS from MailBOX
        // const url = res.optional.switch_APP_GET;
        console.log("url is ", url);
        window.open(url, "_blank", "noopener,noreferrer");
        setLoading(false);
      }
    } catch (err) {}
  };
  return (
    <>
      <div className="d-flex flex-row navbar justify-content-between navbar-expand-lg  main_navbar">
        <div className="logo_container d-flex align-self-start">
          <NavLink to="/">
            <span className="icon">
              <img src="../../img/logo.png" alt="logo" />
            </span>
            <div className="icon_text">E-Store</div>
          </NavLink>
        </div>

        <div className="search_container">
          <div>
            <SearchBar />
          </div>
          <div className="d-flex flex-row justify-content-center navigation_links">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <NavLink
                  to="/Categories"
                  activeClassName="link_selected"
                  className="nav-link"
                >
                  Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/Orders"
                  activeClassName="link_selected"
                  className="nav-link"
                >
                  Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/myassets"
                  activeClassName="link_selected"
                  className="nav-link"
                >
                  My Assets
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/handoverassets"
                  activeClassName="link_selected"
                  className="nav-link"
                >
                  Handing Over Assets
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/takingoverassets"
                  activeClassName="link_selected"
                  className="nav-link"
                >
                  Taking Over Assets
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/surrenderedassets"
                  activeClassName="link_selected"
                  className="nav-link"
                >
                  Surrendered Assets
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="switch_dropdown"
          style={{ marginBottom: 30 }}
        >
          <Dropdown>
            <Dropdown.Toggle
              // className="profile_icon"
              variant="success"
              id="dropdown-basic"
            >
              <img src="img/menu.png" alt="menu" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {!loading ? (
                <div className="d-flex justify-content-center">
                  {switchAppType !== null ? (
                    <Button
                      className="signout_button"
                      onClick={switchToMailBox}
                    >
                      To MailBox
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div style={{textAlign:"center", color:"#337ed7"}}>
               <LoadingSpinner/>
                </div>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="d-flex flex-row align-self-start user_profile_container">
          <div className="cart-icon">
            <NavLink as={Link} to="/cart" className="me-2" href="#">
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{ fontSize: "20px", color: "#337ED7", marginTop: "4px" }}
              />
            </NavLink>
            <p> {total} </p>
          </div>

          <div className="custom_dropdown">
            <Dropdown>
              <Dropdown.Toggle
                className="profile_icon"
                variant="success"
                id="dropdown-basic"
              >
                <FontAwesomeIcon
                  className=""
                  icon={faUser}
                  style={{ fontSize: "20px", color: "#fff", marginTop: "4px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item style={{ zIndex: "2", pointerEvents: "none" }}>
                  <p className="user_designation">
                    {user_name} {`${DESIGNATION}(${BRANCH})`}
                  </p>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Divider />
                <div className="d-flex justify-content-center">
                  <Button className="signout_button" onClick={logOut}>
                    <FontAwesomeIcon
                      className="signout_icon"
                      icon={faSignOutAlt}
                    />
                    Sign out
                  </Button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
