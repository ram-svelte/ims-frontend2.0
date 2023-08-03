import {
  FETCH_ALL_BRANCH_REQUEST,
  FETCH_ALL_BRANCH_SUCCESS,
  FETCH_ALL_BRANCH_FAILURE,
} from "../types";

const initialState = {
  loading: false,
  branch: [],
  error: "",
};

const handleAllBranch = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_BRANCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_ALL_BRANCH_SUCCESS:
      return {
        loading: false,
        branch: action.payload,
        error: "",
      };
    case FETCH_ALL_BRANCH_FAILURE:
      return {
        loading: false,
        branch: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default handleAllBranch;
