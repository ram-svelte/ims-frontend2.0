import {
    FETCH_ALL_COMP_PRODS_REQUEST,
    FETCH_ALL_COMP_PRODS_SUCCESS,
    FETCH_ALL_COMP_PRODS_FAILURE,
  } from "../types";
  
  const initialState = {
    loading: false,
    compProd: [],
    error: "",
  };
  
  const handleAllCompProds = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ALL_COMP_PRODS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_ALL_COMP_PRODS_SUCCESS:
        return {
          loading: false,
          compProd: action.payload,
          error: "",
        };
      case FETCH_ALL_COMP_PRODS_FAILURE:
        return {
          loading: false,
          compProd: [],
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default handleAllCompProds;
  