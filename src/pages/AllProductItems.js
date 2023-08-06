import React from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import "../css/stationary.css";
import NavigationBar from "../UI/NavigationBar";
import ProductList from "../components/ProductList";
import { useState, useEffect } from "react";
import Pagination from "../UI/Pagination";
import { BASE_URL } from "../Urls";
import useHttp from "../hooks/use-http";
import queryString from "query-string";
import LoadingSpinner from "../UI/LoadingSpinner";
import { currentPath } from "../redux/action";
import { useDispatch } from "react-redux";

function AllProductItems() {
  const { search } = useLocation();
  console.log("search ----", search);
  let pageNumber = queryString.parse(search).page;
  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }
  const [items, setItems] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLoading, error, sendRequest: fetchProducts } = useHttp();
  const params = useParams();
  let limit = 16;
  const access_token = localStorage.getItem('jwtToken');

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
    const transformProductItems = (productItems) => {
      const loadedItems = [];
      const total = productItems.count;
      productItems = productItems.data;

      setpageCount(Math.ceil(total / limit));
      for (const key in productItems) {
        loadedItems.push({
          categoryId: productItems[key].categoryId._id,
          categoryTitle: productItems[key].categoryId.title,
          id: productItems[key]._id,
          title: productItems[key].title,
          imageSrc: productItems[key].productImage,
          description: productItems[key].description,
          qty: productItems[key].quantity,
        });
      }

      setItems(loadedItems);
    };
    fetchProducts(
      {
        url: `${BASE_URL}/api/products/productsByCategory?catId=${params.categoryId}&page=${currentPage}&limit=${limit}`,
        headers: { Authorization: `Bearer ${access_token}` },
      },
      transformProductItems
    );
    if (!error) {
      history.replace({
        pathname: location?.pathname,
        search: `?catId=${params.categoryId}&page=${currentPage}&limit=${limit}`,
      });
    }
  }, [fetchProducts, currentPage]);

  console.log("productList", items);

  const productList = items.map((item) => (
    <ProductList
      catId={item.categoryId}
      catTitle={item.categoryTitle}
      item={item}
      key={item.id}
      id={item.id}
      description={item.description}
      imageSrc={item.imageSrc[0]}
      title={item.title}
      qty={item.qty}
    />
  ));

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {error ? (
        <p>Error message</p>
      ) : (
        <>
          <NavigationBar />
          <div className="stat">
            <div className="stationr container-fluid">
              <div className="cat-head text-center">{params.categoryTitle}</div>
              {isLoading ? (
                <>
                  <div className=" d-flex justify-content-center loading_spinner ">
                    <LoadingSpinner />
                  </div>
                </>
              ) : (
                <>
                  <div className="main_content">{productList}</div>
                  <div className="d-flex justify-content-center">
                    <Pagination
                      OnhandlePageClick={handlePageClick}
                      pageCount={pageCount}
                      pageNumber={currentPage - 1}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AllProductItems;
