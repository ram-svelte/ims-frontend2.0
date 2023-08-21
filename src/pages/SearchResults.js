import React, { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import useHttp from "../hooks/use-http";
import { BASE_URL } from "../Urls";
import "../css/stationary.css";
import LoadingSpinner from "../UI/LoadingSpinner";
import ProductList from "../components/ProductList";
import NavigationBar from "../UI/NavigationBar";
import Pagination from "../UI/Pagination";
import "../css/SearchResults.css";
import queryString from "query-string";
import { MyContext } from "../context/index";
import { currentPath } from "../redux/action";
import { useDispatch } from "react-redux";
function SearchResults() {
  const context = useContext(MyContext);
  const { search } = useLocation();
  let pageNumber = queryString.parse(search).page;
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }

  const limit = 16;
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

  let searchInput = context.searchTitle;

  //To fix the bug : after page refresh context.title is getting empty
  if (searchInput) {
    searchInput = context.searchTitle;
  } else {
    searchInput = queryString.parse(search).title;
  }

  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const { isLoading, error, sendRequest: fetchProducts } = useHttp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const transformSearchItems = (searchitems) => {
      console.log("search items are", searchitems);
      const loadedItems = [];
      const total = searchitems.count;
      searchitems = searchitems.data;
      setpageCount(Math.ceil(total / limit));
      for (const key in searchitems) {
        loadedItems.push({
          categoryId: searchitems[key].categoryId._id,
          categoryTitle: searchitems[key].categoryId.title,
          id: searchitems[key]._id,
          title: searchitems[key].title,
          imageSrc: searchitems[key].productImage,
          description: searchitems[key].description,
          qty: searchitems[key].quantity,
        });
      }

      setItems(loadedItems);
    };
    if (context.page === 1) {
      fetchProducts(
        {
          url: `${BASE_URL}/api/search/product?title=${searchInput}&page=${1}&limit=${limit}`,
          headers: { Authorization: `Bearer ${access_token}` },
        },
        transformSearchItems
      );
      setCurrentPage(1);
    } else {
      fetchProducts(
        {
          url: `${BASE_URL}/api/search/product?title=${searchInput}&page=${currentPage}&limit=${limit}`,
          headers: { Authorization: `Bearer ${access_token}` },
        },
        transformSearchItems
      );
    }

    if (!error) {
      if (context.page === 1) {
        context.page = 0;
        history.replace({
          pathname: location?.pathname,
          search: `?title=${searchInput}&page=${1}&limit=${limit}`,
        });
      } else {
        context.page = 0;
        history.replace({
          pathname: location?.pathname,
          search: `?title=${searchInput}&page=${currentPage}&limit=${limit}`,
        });
      }
    }
  }, [fetchProducts, currentPage, context.searchTitle]);

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
              <div className="results_text">
                <p>
                  Search result for <span>{`"${searchInput}"`}</span>
                </p>
              </div>
              {isLoading ? (
                <>
                  <div className=" d-flex justify-content-center loading_spinner ">
                    <LoadingSpinner />
                  </div>
                </>
              ) : (
                <>
                  {items.length ? (
                    <div className="main_content">{productList}</div>
                  ) : (
                    <div className="main_content_noproduct">
                      <p>No Products Found</p>
                    </div>
                  )}
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

export default SearchResults;
