import handleCart from "./handlecart";
import { combineReducers } from "redux";
import handleAllBranch from "./handleAllBranch";
import handleAllCompProds from "./handleAllCompProds";
import urlReducer from "./urlReducer";

const rootReducers = combineReducers({
  handleCart,
  handleAllBranch,
  handleAllCompProds,
  urlReducer,
});

export default rootReducers;
