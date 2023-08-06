import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useHttp from "../hooks/use-http";
import { BASE_URL } from "../Urls";
import ProductDetailsList from "../components/ProductDetailsList";
import NavigationBar from "../UI/NavigationBar";
import { currentPath } from "../redux/action";
import { useDispatch } from "react-redux";

function ProductDetails() {
  const [items, setItems] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest: fetchProductDetail } = useHttp();
  const access_token = localStorage.getItem("jwtToken");
  //storing currentUrl to localStorage
  const currentUrl = window.location.href;
  const splitUrl = currentUrl.split("/");
  if (currentUrl.includes("?")) {
    const newUrl = splitUrl[3].split("?");
    localStorage.setItem("currentUrl", newUrl[0]);
    dispatch(currentPath(newUrl[0]));
  } else {
    localStorage.setItem("currentUrl", splitUrl[3]);
    dispatch(currentPath(splitUrl[3]));
  }

  useEffect(() => {
    const transformProductItemDetail = (prodItems) => {
      const loadedItems = [];
      console.log("prodItems details is ", prodItems);
      const product = prodItems.data;

      loadedItems.push({
        categoryId: product.categoryId,
        id: product._id,
        description: product.description,
        title: product.title,
        productImage: product.productImage,
        qty: product.quantity,
      });

      setItems(loadedItems);
    };
    fetchProductDetail(
      {
        url: `${BASE_URL}/api/products/${params.productId}`,
        headers: { Authorization: `Bearer ${access_token}` },
      },
      transformProductItemDetail
    );
  }, [fetchProductDetail]);

  console.log("items are ", items);
  const productItems = items.map((item) => (
    <ProductDetailsList
      catId={item.categoryId}
      item={item}
      key={item.id}
      id={item.id}
      description={item.description}
      image={item.productImage}
      title={item.title}
      qty={item.qty}
    />
  ));

  return (
    <>
      <NavigationBar />
      <div>
        <div>{productItems}</div>
      </div>
    </>
  );
}

export default ProductDetails;
