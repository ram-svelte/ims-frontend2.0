//For Add Item to Cart
import {
  ADDITEM,
  DECITEM,
  REMITEM,
  INCITEM,
  RESET,
  FETCH_ALL_BRANCH_REQUEST,
  FETCH_ALL_BRANCH_SUCCESS,
  FETCH_ALL_BRANCH_FAILURE,
  FETCH_USERS_CART_FAILURE,
  FETCH_USERS_CART_SUCCESS,
  FETCH_USERS_CART_REQUEST,
  FETCH_USERS_PROFILE_FAILURE,
  FETCH_USERS_PROFILE_SUCCESS,
  FETCH_USERS_PROFILE_REQUEST,
  FETCH_ALL_COMP_PRODS_FAILURE,
  FETCH_ALL_COMP_PRODS_REQUEST,
  FETCH_ALL_COMP_PRODS_SUCCESS,
  SET_URL
} from "../types";
import axios from "axios";
import { BASE_URL, USER_LOGIN_URL } from "../../Urls";
import history from "../../Utils/history";
//import { useHistory } from "react-router-dom";

//const history = useHistory();

export const fetchUsersCart = () => {
  const access_token = sessionStorage.getItem("jwtToken");
  return (dispatch) => {
    dispatch(fetchUsersCartRequest());
    axios
      .get(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        const cartItems = response.data.data;
        console.log("cartItems are", cartItems);

        const laodedItems = [];
        for (const cartKey in cartItems[0].products) {
          laodedItems.push({
            id: cartItems[0].products[cartKey].prod_id._id,
            qty: cartItems[0].products[cartKey].quantityReq,
            title: cartItems[0].products[cartKey].prod_id.title,
            description: cartItems[0].products[cartKey].prod_id.description,
            imageSrc: cartItems[0].products[cartKey].prod_id.productImage[0],
            catId: cartItems[0].products[cartKey].prod_id.categoryId,
            catTitle: cartItems[0].products[cartKey].cat_id.title,
            prodType:cartItems[0].products[cartKey].prod_id.productType,
          });
        }
        console.log("laodedItems", laodedItems);

        dispatch(fetchUsersCartSuccess(laodedItems));
      })
      .catch((error) => {
        dispatch(fetchUsersCartFailure(error.message));
      });
  };
};

export const fetchUsersCartRequest = () => {
  return {
    type: FETCH_USERS_CART_REQUEST,
  };
};

export const fetchUsersCartSuccess = (cart) => {
  return {
    type: FETCH_USERS_CART_SUCCESS,
    payload: cart,
  };
};

export const fetchUsersCartFailure = (error) => {
  return {
    type: FETCH_USERS_CART_FAILURE,
    payload: error,
  };
};

//fetch all branch api on user portal

export const fetchAllBranch = () => {
  const access_token = sessionStorage.getItem("jwtToken");
  return (dispatch) => {
    dispatch(fetchAllBranchRequest());
    axios
      .get(`${USER_LOGIN_URL}/api/designation/getbranchlist`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        const allBranch = response.data.data;
        const loadedItems = [];
        loadedItems.push({
          allBranch: allBranch,
        });
        console.log("allBranch",allBranch)
        dispatch(fetchAllBranchSuccess(loadedItems));
      })
      .catch((error) => {
        dispatch(fetchAllBranchFailure(error.message));
      });
  };
};

export const fetchAllBranchRequest = () => {
  return {
    type: FETCH_ALL_BRANCH_REQUEST,
  };
};

export const fetchAllBranchSuccess = (branch) => {
  return {
    type: FETCH_ALL_BRANCH_SUCCESS,
    payload : branch
  };
};

export const fetchAllBranchFailure = (error) => {
  return {
    type: FETCH_ALL_BRANCH_FAILURE,
    payload : error
  };
};

//fetch all branch api on user portal ----- ends

//fetch all Computers & Peripherals Products ------Start

export const fetchAllCompProds = () => {
  const access_token = sessionStorage.getItem("jwtToken");
  return (dispatch) => {
    dispatch(fetchAllCompProdsRequest());
    axios
      .get(`${BASE_URL}/api/products/getAllProduct/byCategory`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        const allCompProds = response.data.data;
        const loadedItems = [];
        loadedItems.push({
          allCompProds: allCompProds,
        });
        console.log("allCompProds",allCompProds)
        dispatch(fetchAllCompProdsSuccess(allCompProds));
      })
      .catch((error) => {
        dispatch(fetchAllCompProdsFailure(error.message));
      });
  };
};

export const fetchAllCompProdsRequest = () => {
  return {
    type: FETCH_ALL_COMP_PRODS_REQUEST,
  };
};

export const fetchAllCompProdsSuccess = (compProd) => {
  return {
    type: FETCH_ALL_COMP_PRODS_SUCCESS,
    payload : compProd
  };
};

export const fetchAllCompProdsFailure = (error) => {
  return {
    type: FETCH_ALL_COMP_PRODS_FAILURE,
    payload : error
  };
};


//fetch all Computers & Peripherals Products ------Ends

export const fetchUsersProfile = () => {
  const access_token = sessionStorage.getItem("jwtToken");
  return (dispatch) => {
    dispatch(fetchUsersProfileRequest());
    axios
      .get(`${USER_LOGIN_URL}/api/users/userProfile`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        const userItems = response.data.data;
        const laodedItems = [];
        laodedItems.push({
          designation: userItems.designation,
          branch: userItems.designations[0].branch,
        });
        sessionStorage.setItem("userBranch", laodedItems[0].branch);
        sessionStorage.setItem("userDesignation", laodedItems[0].designation);

        dispatch(fetchUsersProfileSuccess(laodedItems));
      })
      .catch((error) => {
        console.log("in error block of userprofile");
        // sessionStorage.removeItem("isLoggedIn");
        // sessionStorage.removeItem("loggedUserName");
        // sessionStorage.removeItem("jwtToken");
        // sessionStorage.removeItem("userBranch");
        // sessionStorage.removeItem("userDesignation");

        dispatch(fetchUsersProfileFailure(error.message));
        // history.push("/");
      });
  };
};

export const fetchUsersProfileRequest = () => {
  return {
    type: FETCH_USERS_PROFILE_REQUEST,
  };
};

export const fetchUsersProfileSuccess = (user) => {
  return {
    type: FETCH_USERS_PROFILE_SUCCESS,
    payload: user,
  };
};

export const fetchUsersProfileFailure = (error) => {
  return {
    type: FETCH_USERS_PROFILE_FAILURE,
    payload: error,
  };
};

// action for storing currentURl to sessionStorage

export const currentPath = (url) => {
  return {
    type: SET_URL,
    payload: url,
  };
};

export const addCart = (product) => {
  const cart = sessionStorage.getItem("cart")
    ? JSON.parse(sessionStorage.getItem("cart"))
    : [];

  //For Duplicates

  const duplicates = cart.filter((cartItems) => cartItems._id === product._id);
  if (duplicates.length === 0) {
    const prodToAdd = {
      ...product,
      count: 1,
    };
    cart.push(prodToAdd);
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }

  return {
    type: ADDITEM,
    payload: product,
  };
};
// For Delete Item from Cart
export const decrementCartItem = (product) => {
  return {
    type: DECITEM,
    payload: product,
  };
};

//For removing the whole item

export const removeCart = (product) => {
  return {
    type: REMITEM,
    payload: product,
  };
};

export const fetchCartApi = () => {
  return {
    type: fetchCartApi,
    payload: [],
  };
};

export const incrementCartItem = (product) => {
  return {
    type: INCITEM,
    payload: product,
  };
};

export const resetCartItem = () => {
  return {
    type: RESET,
  };
};
