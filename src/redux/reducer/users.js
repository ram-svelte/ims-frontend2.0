import {
  FETCH_USERS_PROFILE_SUCCESS,
  FETCH_USERS_PROFILE_REQUEST,
  FETCH_USERS_CART_FAILURE,
} from "../types";

const initialState = {
  loading: false,
  users: [],
  error: "",
};

const handleUsers = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_PROFILE_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_CART_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default handleUsers;