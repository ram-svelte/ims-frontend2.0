import React, { useCallback } from "react";
import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import "../css/Orders.css";
import { BASE_URL } from "../Urls";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import NavigationBar from "../UI/NavigationBar";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import Pagination from "../UI/Pagination";
import ComponentToPrint from "../components/ComponentToPrint";
import { useRef } from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { Toast } from "../Utils/Toastify";
import axios from "axios";
import MapSerialNumber from "../UI/mapSerialNumberModal";
import {
  COMPUTERS,
  DESKTOP,
  ELECTRICALS,
  OTHERCOMP,
  CPU,
  MONITOR,
  TYPE,
} from "../Constant";
import { useDispatch } from "react-redux";
import { currentPath } from "../redux/action";

function Orders() {
  const ref = useRef([]);
  const dispatch = useDispatch();
  const { search } = useLocation();
  let pageNumber = queryString.parse(search).currentPage;
  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [finalOrder, setFinalORder] = useState([]);
  const limit = 10;

  //storing currentUrl to sessionStorage
  const currentUrl = window.location.href;
  const splitUrl = currentUrl.split("/");
  if (currentUrl.includes("?")) {
    const newUrl = splitUrl[3].split("?");
    sessionStorage.setItem("currentUrl", newUrl[0]);
    dispatch(currentPath(newUrl[0]));
  } else {
    sessionStorage.setItem("currentUrl", splitUrl[3]);
    dispatch(currentPath(splitUrl[3]));
  }

  const [items, setItems] = useState([]);

  const { isLoading, error, sendRequest: fetchOrders } = useHttp();
  const access_token = sessionStorage.getItem("jwtToken");

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const deleteOrder = useCallback(async (id) => {
    console.log("order id is ", typeof id);
    //return;

    try {
      const res = await axios.request({
        method: "DELETE",
        url: `${BASE_URL}/api/orders/${id}`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (res.status === 200) {
        // handleClose();
        // dispatch(fetchUsersCart());
        Toast("Orders deleted Successfully", "success");
        // history.push("/orders");
        window.location.reload(false);
      }
    } catch (err) {}
  }, []);
  // const deleteOrder = async (id) => {
  //   console.log("order id is ", typeof id);
  //   //return;

  //   try {
  //     const res = await axios.request({
  //       method: "DELETE",
  //       url: `${BASE_URL}/api/orders/${id}`,
  //       headers: {
  //         "Content-type": "application/json",
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     if (res.status == 200) {
  //       // handleClose();
  //       // dispatch(fetchUsersCart());
  //       Toast("Orders deleted Successfully", "success");
  //       history.push("/orders");

  //     }
  //   } catch (err) {}
  // };
  // let finalOrder = [];
  const allocateOrder = (id) => {
    console.log("order ID is ", id);
    const order = items.filter((item) => item.orderId === id);
    setFinalORder(order);
    console.log("final order is ", finalOrder);
    handleShow();
  };
  const mapProducts = async (x, data) => {
    if (x === 1) {
      handleClose();
    } else {
      handleShow();
      return;
    }
    console.log("data of formfields is ", data);

    const sentOrderObject = {
      employeeData: data,
    };
    console.log("sent order object", sentOrderObject);
    //return;
    console.log("orderId is ", finalOrder[0].orderId);

    console.log("sentOrderobject is ", sentOrderObject);
    try {
      const res = await axios.request({
        method: "POST",
        url: `${BASE_URL}/api/employee/employeeDetails/${finalOrder[0].orderId}`,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        data: sentOrderObject,
      });
      if (res.status === 201) {
        // history.push("/orders");

        // dispatch(fetchUsersCart());
        Toast("Allocation was successfull", "success");
        handleClose();
        window.location.reload(false);
      }
    } catch (err) {}
  };

  let newDataArray = [];

  useEffect(() => {
    const transformOrderItems = (orderItems) => {
      const total = orderItems.count;
      console.log("orderItems are", orderItems);

      setpageCount(Math.ceil(total / limit));
      orderItems = orderItems.data;
      console.log("order items bfr push", orderItems);

      orderItems.forEach((obj, index) => {
        if (obj.orderType === TYPE) {
          console.log("in desktop loop");
          // newDataArray = [];
          const products = obj.products.filter(
            (item) =>
              item?.prod_id?.title !== CPU && item?.prod_id?.title !== MONITOR
          );
          console.log("products filtered", products);

          newDataArray.push({ ...obj, products });

          // setItems(newDataArray);
        } else {
          newDataArray.push(obj);
        }
      });
      console.log("newDataArray", newDataArray);

      const loadedItems = [];

      for (const orderKey in newDataArray) {
        loadedItems.push({
          id: newDataArray[orderKey].order_id,
          status: newDataArray[orderKey].status,
          catName: newDataArray[orderKey].cat_id.title,
          products: newDataArray[orderKey].products,
          productsDetails: newDataArray[orderKey].productDetails,
          timeAlloted: newDataArray[orderKey].timeAlloted,
          orderId: newDataArray[orderKey]._id,
          allocated: newDataArray[orderKey].allocated,
          employeeId: newDataArray[orderKey].employee_id,
          Empid: newDataArray[orderKey].Empid,
        });
      }
      console.log("loadedITems are in order", loadedItems);
      setItems(loadedItems);
    };
    fetchOrders(
      {
        url: `${BASE_URL}/api/orders?page=${currentPage}&limit=${limit}`,
        headers: { Authorization: `Bearer ${access_token}` },
      },
      transformOrderItems
    );
    if (!error) {
      history.replace({
        pathname: location.pathname,
        search: `?page=${currentPage}&limit=${limit}`,
      });
    }
  }, [fetchOrders, currentPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
    window.scrollTo(0, 0);
  };

  let orderItems = null;
  if (items) {
    orderItems = items.map((item, i) => {
      return (
        <>
          <div key={i}>
            <ReactToPrint
              content={() => {
                return ref.current[i];
              }}
              documentTitle={`orderId : ${item.id}`}
            >
              <ComponentToPrint item={item} idx={i} ref={ref} />
              <PrintContextConsumer>
                {({ handlePrint }) => (
                  <Button className="print_button" onClick={handlePrint}>
                    Print
                  </Button>
                )}
              </PrintContextConsumer>
            </ReactToPrint>
            {item.status === "Pending" ? (
              <div>
                <Button
                  className="cancel_order_button"
                  onClick={() => deleteOrder(item.orderId)}
                >
                  Cancel
                </Button>
              </div>
            ) : null}
            {console.log("item status", item.status)}
            {console.log("item category", item.catName)}
            {console.log("item allocated", item.allocated)}
            {/* {item.status === "Delivered" &&
            (item.catName === COMPUTERS ||
              item.catName === ELECTRICALS ||
              item.catName === OTHERCOMP) &&
            item.allocated === false ? (
              <div>
                <Button
                  className="cancel_order_button"
                  onClick={() => allocateOrder(item.orderId)}
                >
                  Allocate
                </Button>
              </div>
            ) : null} */}
          </div>
        </>
      );
    });
  }

  return (
    <>
      {error ? (
        <p>Error Message</p>
      ) : (
        <>
          <NavigationBar />
          <Container>
            <div className="container-fluid">
              <div className="cat-head text-center">Orders</div>
              {isLoading ? (
                <>
                  <div className=" d-flex justify-content-center loading_spinner ">
                    <LoadingSpinner />
                  </div>
                </>
              ) : (
                <>
                  <div className="order_container">{orderItems}</div>
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
            <MapSerialNumber
              show={show}
              mapProducts={mapProducts}
              // addProduct={addProduct}
              handleClose={handleClose}
              finalOrder={finalOrder}
            />
          </Container>
        </>
      )}
    </>
  );
}

export default Orders;

// import React, { useCallback } from "react";
// import { useState, useEffect } from "react";
// import { Container, Button } from "react-bootstrap";
// import "../css/Orders.css";
// import { BASE_URL } from "../Urls";
// import useHttp from "../hooks/use-http";
// import LoadingSpinner from "../UI/LoadingSpinner";
// import NavigationBar from "../UI/NavigationBar";
// import queryString from "query-string";
// import { useLocation, useHistory } from "react-router-dom";
// import Pagination from "../UI/Pagination";
// import ComponentToPrint from "../components/ComponentToPrint";
// import { useRef } from "react";
// import ReactToPrint, { PrintContextConsumer } from "react-to-print";
// import { Toast } from "../Utils/Toastify";
// import axios from "axios";
// import MapSerialNumber from "../UI/mapSerialNumberModal";
// import { COMPUTERS, ELECTRICALS, OTHERCOMP } from "../Constant";

// function Orders() {
//   const ref = useRef([]);
//   const { search } = useLocation();
//   let pageNumber = queryString.parse(search).currentPage;
//   if (isNaN(pageNumber)) {
//     pageNumber = 1;
//   }
//   const [pageCount, setpageCount] = useState(0);
//   const [currentPage, setCurrentPage] = useState(pageNumber);
//   const history = useHistory();
//   const location = useLocation();
//   const [show, setShow] = useState(false);
//   const [finalOrder, setFinalORder] = useState([]);
//   const limit = 10;

//   const [items, setItems] = useState([]);

//   const { isLoading, error, sendRequest: fetchOrders } = useHttp();
//   const access_token = sessionStorage.getItem("jwtToken");

//   const handleClose = () => {
//     setShow(false);
//   };
//   const handleShow = () => setShow(true);

//   const deleteOrder = useCallback(async (id) => {
//     console.log("order id is ", typeof id);
//     //return;

//     try {
//       const res = await axios.request({
//         method: "DELETE",
//         url: `${BASE_URL}/api/orders/${id}`,
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${access_token}`,
//         },
//       });
//       if (res.status === 200) {
//         // handleClose();
//         // dispatch(fetchUsersCart());
//         Toast("Orders deleted Successfully", "success");
//         // history.push("/orders");
//         window.location.reload(false);
//       }
//     } catch (err) {}
//   }, []);
//   // const deleteOrder = async (id) => {
//   //   console.log("order id is ", typeof id);
//   //   //return;

//   //   try {
//   //     const res = await axios.request({
//   //       method: "DELETE",
//   //       url: `${BASE_URL}/api/orders/${id}`,
//   //       headers: {
//   //         "Content-type": "application/json",
//   //         Authorization: `Bearer ${access_token}`,
//   //       },
//   //     });
//   //     if (res.status == 200) {
//   //       // handleClose();
//   //       // dispatch(fetchUsersCart());
//   //       Toast("Orders deleted Successfully", "success");
//   //       history.push("/orders");

//   //     }
//   //   } catch (err) {}
//   // };
//   // let finalOrder = [];
//   const allocateOrder = (id) => {
//     console.log("order ID is ", id);
//     const order = items.filter((item) => item.orderId === id);
//     setFinalORder(order);
//     console.log("final order is ", finalOrder);
//     handleShow();
//   };
//   const mapProducts = async (x, data) => {
//     if (x === 1) {
//       handleClose();
//     } else {
//       handleShow();
//       return;
//     }
//     console.log("data of formfields is ", data);

//     const sentOrderObject = {
//       employeeData: data,
//     };
//     console.log("sent order object", sentOrderObject);
//     //return;
//     console.log("orderId is ", finalOrder[0].orderId);
//     // return;

//     console.log("sentOrderobject is ", sentOrderObject);
//     try {
//       const res = await axios.request({
//         method: "POST",
//         url: `${BASE_URL}/api/employee/employeeDetails/${finalOrder[0].orderId}`,
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${access_token}`,
//         },
//         data: sentOrderObject,
//       });
//       if (res.status === 201) {
//         // history.push("/orders");

//         // dispatch(fetchUsersCart());
//         Toast("Allocation was successfull", "success");
//         handleClose();
//         window.location.reload(false);
//       }
//     } catch (err) {}
//   };

//   useEffect(() => {
//     const transformOrderItems = (orderItems) => {
//       const total = orderItems.count;
//       console.log("orderItems are", orderItems);

//       setpageCount(Math.ceil(total / limit));
//       orderItems = orderItems.data;
//       console.log("order items bfr push", orderItems);
//       const loadedItems = [];

//       for (const orderKey in orderItems) {
//         loadedItems.push({
//           id: orderItems[orderKey].order_id,
//           status: orderItems[orderKey].status,
//           catName: orderItems[orderKey].cat_id.title,
//           products: orderItems[orderKey].products,
//           productsDetails: orderItems[orderKey].productDetails,
//           timeAlloted: orderItems[orderKey].timeAlloted,
//           orderId: orderItems[orderKey]._id,
//           allocated: orderItems[orderKey].allocated,
//           employeeId: orderItems[orderKey].employee_id,
//         });
//       }
//       console.log("loadedITems are in order", loadedItems);
//       setItems(loadedItems);
//     };
//     fetchOrders(
//       {
//         url: `${BASE_URL}/api/orders?page=${currentPage}&limit=${limit}`,
//         headers: { Authorization: `Bearer ${access_token}` },
//       },
//       transformOrderItems
//     );
//     // if (error) {
//     //   console.log("in error block of orders");
//     //   sessionStorage.removeItem("isLoggedIn");
//     //   sessionStorage.removeItem("loggedUserName");
//     //   sessionStorage.removeItem("jwtToken");
//     //   sessionStorage.removeItem("userBranch");
//     //   sessionStorage.removeItem("userDesignation");
//     //   history.push("/");
//     // }
//     if (!error) {
//       history.replace({
//         pathname: location.pathname,
//         search: `?page=${currentPage}&limit=${limit}`,
//       });
//     }
//   }, [fetchOrders, currentPage]);

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected + 1);
//     window.scrollTo(0, 0);
//   };

//   let orderItems = null;
//   if (items) {
//     console.log("items in orderlIst", items);
//     orderItems = items.map((item, i) => {
//       return (
//         <>
//           <div key={i}>
//             <ReactToPrint
//               content={() => {
//                 return ref.current[i];
//               }}
//               documentTitle={`orderId : ${item.id}`}
//             >
//               <ComponentToPrint item={item} idx={i} ref={ref} />
//               <PrintContextConsumer>
//                 {({ handlePrint }) => (
//                   <Button className="print_button" onClick={handlePrint}>
//                     Print
//                   </Button>
//                 )}
//               </PrintContextConsumer>
//             </ReactToPrint>
//             {item.status === "Pending" ? (
//               <div>
//                 <Button
//                   className="cancel_order_button"
//                   onClick={() => deleteOrder(item.orderId)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             ) : null}
//             {item.status === "Delivered" &&
//             (item.catName === COMPUTERS ||
//               item.catName === ELECTRICALS ||
//               item.catName === OTHERCOMP) &&
//             item.allocated === false ? (
//               <div>
//                 <Button
//                   className="cancel_order_button"
//                   onClick={() => allocateOrder(item.orderId)}
//                 >
//                   Allocate
//                 </Button>
//               </div>
//             ) : null}
//           </div>
//         </>
//       );
//     });
//   }

//   return (
//     <>
//       {error ? (
//         <p>Error Message</p>
//       ) : (
//         <>
//           <NavigationBar />
//           <Container>
//             <div className="container-fluid">
//               <div className="cat-head text-center">Orders</div>
//               {isLoading ? (
//                 <>
//                   <div className=" d-flex justify-content-center loading_spinner ">
//                     <LoadingSpinner />
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="order_container">{orderItems}</div>
//                   <div className="d-flex justify-content-center">
//                     <Pagination
//                       OnhandlePageClick={handlePageClick}
//                       pageCount={pageCount}
//                       pageNumber={currentPage - 1}
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//             <MapSerialNumber
//               show={show}
//               mapProducts={mapProducts}
//               // addProduct={addProduct}
//               handleClose={handleClose}
//               finalOrder={finalOrder}
//             />
//           </Container>
//         </>
//       )}
//     </>
//   );
// }

// export default Orders;
