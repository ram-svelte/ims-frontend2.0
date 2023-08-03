import React from "react";
import "../css/OrderList.css";

function OrderList(props) {
  const quantityRequested = [];
  const quantityIssued = [];
  const products = [];
  const remarks = [];
  props.orderedProducts.forEach((item) => {
    quantityRequested.push(item.quantityReq);
    quantityIssued.push(item.quantityIssued);
    remarks.push(item.remarks);
    products.push(item.prod_id);
  });

  const orderDetails = products.map((item, i) => {
    if (item != null) {
      return (
        <tbody key={item._id}>
          <tr>
            <td className="align-middle text-center">{i + 1}</td>
            <td className="align-middle text-center order_description">
              <div className="d-flex align-items-center order_title ">
                {item.title}
              </div>
              <div>
                <img
                  alt="AltText"
                  src={item.productImage[0]}
                  className="order_image"
                />
              </div>
            </td>
            <td className="align-middle text-center">{quantityRequested[i]}</td>
            <td className="align-middle text-center">{quantityIssued[i]}</td>
            <td className="align-middle text-center">{remarks[i]}</td>
          </tr>
        </tbody>
      );
    }
  });

  return <>{orderDetails}</>;
}

export default OrderList;
