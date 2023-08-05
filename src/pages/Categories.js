import React from "react";
import CardItems from "../components/CategoriesCardItems";
import "../css/categories.css";
import NavigationBar from "../UI/NavigationBar";
import { useState, useEffect } from "react";
import useHttp from "../hooks/use-http";
import { BASE_URL } from "../Urls";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useDispatch } from "react-redux";
import { currentPath } from "../redux/action";
import './index.css'

function Categories() {
  const [items, setItems] = useState([]);
  const { isLoading, error, sendRequest: fetchCategories } = useHttp();
  const dispatch = useDispatch();
  const access_token = sessionStorage.getItem("jwtToken");
  //storing currentUrl to sessionStorage
  const currentUrl = window.location.href;
  const splitUrl = currentUrl.split("/");
  if (currentUrl.includes("?")) {
    const newUrl = splitUrl[3].split("?");
    sessionStorage.setItem("currentUrl", newUrl[0]);
    dispatch(currentPath(newUrl[0]))
  } else {
    sessionStorage.setItem("currentUrl", splitUrl[3]);
    dispatch(currentPath(splitUrl[3]))
  }

  useEffect(() => {
    const transformCategoryItems = (catItems) => {
      const loadedItems = [];
      catItems = catItems.data;

      for (const catKey in catItems) {
        loadedItems.push({
          id: catItems[catKey]._id,
          title: catItems[catKey].title,
          imagePath: catItems[catKey].categoryImage,
        });
      }
      setItems(loadedItems);
    };
    fetchCategories(
      { url: `${BASE_URL}/api/categories`,
      headers: { Authorization: `Bearer ${access_token}` },

     },
      transformCategoryItems
    );
  }, [fetchCategories]);

  const categoryItems = items.map((item, i) => (
    <CardItems
      index={i}
      key={item.id}
      title={item.title}
      image={item.imagePath}
      id={item.id}
    />
  ));
  return (
    <>
      {error ? (
        <p>Error message</p>
      ) : (
        <>
          <NavigationBar />
          <div style={{background:"#0083B7",height:'100vh'}} className="container-fluid categor">
            {isLoading ? (
              <>
                <div className=" d-flex justify-content-center loading_spinner ">
                  <LoadingSpinner />
                </div>
              </>
            ) : (
              <>

              <div>
                <div></div>
              </div>

            <div className="heading-cate"> Categories </div>
                <div className="main_content">{categoryItems}</div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Categories;
