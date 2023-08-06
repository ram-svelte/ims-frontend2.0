import { Route, Switch, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Routes from "./Routes";
import AuthContext from "./context/auth-context";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {
  fetchUsersCart,
  fetchUsersProfile,
  fetchAllBranch,
  fetchAllCompProds,
} from "./redux/action/index";
import LogoutModal from "./UI/LogoutModal";
import Auth from "../src/hoc/auth";
import "./css/scrollbar.css";
import { MyContext } from "./context/index";
import jwt_decode from "jwt-decode";
const BUTTON_WRAPPER_STYLES = {
  position: "relative",
  zIndex: 1,
};

const OTHER_CONTENT_STYLES = {
  position: "relative",
  zIndex: 2,
  // backgroundColor: "red",
  // padding: "10px",
};

function App() {
  const cart = useSelector((state) => state.handleCart.cart);
  const context = useContext(MyContext);
  const [decodedToken, setDecodedToken] = useState();
  console.log("cart is ", cart);
  let decoded = "";
  const access_token = localStorage.getItem("jwtToken");
  const dispatch = useDispatch();
  const history = useHistory();
  if (access_token) {
    decoded = jwt_decode(access_token);
  }
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") || false
  );
  const [isOpen, setIsOpen] = useState(false);

  // if (access_token && isLoggedIn) {
  //   let eventSource = new EventSource("http://14.140.15.95:8802/stream");
  //   eventSource.addEventListener(
  //     "open",
  //     function (e) {
  //       console.log("successfull connection");
  //     },
  //     false
  //   );
  //   eventSource.addEventListener(
  //     "error",
  //     function (e) {
  //       console.log("error");
  //     },
  //     false
  //   );

  //   eventSource.addEventListener("logout", (e) => {
  //     console.log(e.data, "----------");
  //     const newData = JSON.parse(e.data);
  //     console.log(newData, "newDaTA");
  //     console.log("decoded.id", decoded.id);
  //     console.log(localStorage.getItem("currentUrl"), "url");
  //     if (
  //       newData.user_id === decoded.id &&
  //       localStorage.getItem("currentUrl") !== newData.currentUrl
  //     ) {
  //       if (localStorage.getItem("isLoggedIn") == "1") {
  //         localStorage.setItem("isLoggedIn", "0");
  //         console.log("in alert loop", localStorage.getItem("isLoggedIn"));
  //         if (localStorage.getItem("isLoggedIn") === "0") {
  //           console.log("idgytdgdldcyfgdknb");
  //           setIsOpen(true);
  //         }
  //       } else {
  //       }
  //     } else {
  //       localStorage.clear();
  //       localStorage.clear();
  //       history.push("/");
  //       window.location.reload(true);
  //     }
  //   });
  // }
  const loginHandler = () => {
    localStorage.setItem("isLoggedIn", "1");
    setIsLoggedIn(true);
  };
  const logoutOnClose = () => {
    localStorage.clear();
    setIsOpen(false);
    history.push("/");
    window.location.reload();
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchUsersCart());
    dispatch(fetchUsersProfile());
    dispatch(fetchAllCompProds());
    dispatch(fetchAllBranch());
    const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");
    if (storedUserLoggedInInformation === "1") {
      setIsLoggedIn(true);
    } else if (storedUserLoggedInInformation === "0") {
      setIsOpen(true);
    }
  }, [access_token]);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedUserName");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userBranch");
    localStorage.removeItem("userDesignation");
    localStorage.removeItem("app_type");
    history.push("/");
    setIsLoggedIn(false);
  };

  if (cart[0]) {
    context.categoryId = cart[0].catId;
    console.log("catId in app", context.categoryId);
  } else {
    context.categoryId = "";
  }

  return (
    <div className="App">
      {/* <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1> */}
      <div style={BUTTON_WRAPPER_STYLES}>
        <LogoutModal open={isOpen} onClose={logoutOnClose} />
      </div>
      <div style={OTHER_CONTENT_STYLES}>
        <Auth>
          <AuthContext.Provider
            value={{
              isLoggedIn: isLoggedIn,
              onLogout: logoutHandler,
            }}
          >
            <Switch>
              {!isLoggedIn ? (
                <Route path="/" exact>
                  <Login onLogin={loginHandler} />
                </Route>
              ) : (
                <Route path="/">
                  <Routes />
                </Route>
              )}
              <Route path="*">
                <Login onLogin={loginHandler} />
              </Route>
            </Switch>
          </AuthContext.Provider>
        </Auth>
      </div>
    </div>
  );
}

export default App;
