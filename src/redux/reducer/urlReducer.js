import { SET_URL } from "../types";

const initialState = {
  url: sessionStorage.getItem("currentUrl"),
};

const handleUrl = (state = initialState, action) => {
  switch (action.type) {
    case SET_URL:
      return {
        url: action.payload,
      };

    default:
      return state;
  }
};
export default handleUrl;
