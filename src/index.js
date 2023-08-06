import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import rootReducers from "./redux/reducer";
import { MyProvider } from "./context";
import history from "./Utils/history";
import App from "./App";
import './index.css'

ReactDOM.render(
  <Router history={history}>
    <MyProvider>
      <Provider store={store(rootReducers)}>
        <App />
      </Provider>
    </MyProvider>
  </Router>,
  document.getElementById("root")
);
