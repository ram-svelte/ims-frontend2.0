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
import { Button } from "react-bootstrap";

function Categories() {
  const [items, setItems] = useState([]);
  const { isLoading, error, sendRequest: fetchCategories } = useHttp();
  const dispatch = useDispatch();
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
      {
        url: `${BASE_URL}/api/categories`,
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
  const switchToAdmin = async () => {
    console.log("first")
    // const appType = res.data.optional.app_type;
    //     const token = res.data.data;
        //localStorage.setItem("MBXtoken", token);
        const url = `http://localhost:9001?token=${access_token}`; //For going to IMS from MailBOX
        // const url = res.optional.switch_APP_GET;
        console.log("url is ", url);
        window.open(url, "_blank", "noopener,noreferrer");

    // setLoading(true);
    try {
      // const res = await axios.request({
      //   method: "POST",
      //   url: `${SWITCH_TO_MBX_URL}`,
      //   headers: {
      //     "Content-type": "application/json",
      //     Authorization: `Bearer ${access_token}`,
      //   },
      //   data: {
      //     token: access_token,
      //     from_app: "IMS",
      //     to_app: "MBX",
      //   },
      // });
      //console.log("response is ", res.data.optional.switch_APP_GET);
      // if (res.data.status == 1) {
        // setLoading(false);
        // const appType = res.data.optional.app_type;
        // const token = res.data.data;
        // //localStorage.setItem("MBXtoken", token);
        // const url = `http://localhost:9001?token=${token}`; //For going to IMS from MailBOX
        // // const url = res.optional.switch_APP_GET;
        // console.log("url is ", url);
        // window.open(url, "_blank", "noopener,noreferrer");
        // setLoading(false);
      // }
    } catch (err) {}
  };
  return (
    <>
      {error ? (
        <p>Error message</p>
      ) : (
        <>
          <NavigationBar />
          <div className="container-fluid categor">
            <div className="cat-head text-center"> Categories </div>
            <h6 style={{ color: "red", textAlign: "center" }}>
              Note : You can place order of a particular category maximum twice
              a month
            </h6>
            <Button onClick={switchToAdmin}>hello</Button>
            {/* <PageTitle title="Categories" /> */}
            {isLoading ? (
              <>
                <div className=" d-flex justify-content-center loading_spinner ">
                  <LoadingSpinner />
                </div>
              </>
            ) : (
              <>
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
