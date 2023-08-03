import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import AllProductItems from "./pages/AllProductItems";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NavigationBar from "./UI/NavigationBar";
import SearchResults from "./pages/SearchResults";
import MyAssets from "./pages/MyAssets";
import HandOverAssets from "./pages/HandOverAssets";
import TakingOverAssets from "./pages/TakingOverAssets";
import SurrenderedAssets from "./pages/SurrenderedAssets";

function Routes(props) {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Redirect to = "categories" />
          <Categories />
        </Route>
        <Route path="/categories" exact>
          <Categories />
        </Route>
        <Route path="/categories/:categoryId/:categoryTitle" exact>
          <AllProductItems />
        </Route>
        <Route path="/s" exact>
          <SearchResults />
        </Route>
        <Route path="/product/:categoryId/:productId" exact>
          <ProductDetails />
        </Route>
        <Route path="/cart">
          <Cart />
        </Route>
        <Route path="/orders">
          <Orders />
        </Route>
        <Route path="/myassets">
          <MyAssets />
        </Route>
        <Route path="/handoverassets">
          <HandOverAssets />
        </Route>
        <Route path="/takingoverassets">
          <TakingOverAssets />
        </Route>
        <Route path="/surrenderedassets">
          <SurrenderedAssets />
        </Route>
      </Switch>
    </>
  );
}

export default Routes;
