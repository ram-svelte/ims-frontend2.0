import { Accordion, Table } from "react-bootstrap";
import StatusText from "../UI/StatusText";
import OrderList from "./OrderList";
import { forwardRef } from "react";
import "../css/ComponentToPrint.css";
const ComponentToPrint = forwardRef((props, ref) => {
  const item = props.item;
  return (
    <>
      <div>
        <Accordion  className="order_accordian" key={item.id}>
          <Accordion.Item  className="order_accordian_item" eventKey={item.id}>
            <Accordion.Header  className="order_accordian_button shadow-none">
              <span className="order_length"> {item.products.length} </span>
              <span className="order_number">Order No: {item.id}</span>
              {/* <span className="status">{item.status}</span> */}
              <StatusText status={item.status} />
            </Accordion.Header>
            <Accordion.Body
              className="order_accordian_body"
              ref={(el) => (ref.current[props.idx] = el)}
            >
              <div className="order_heading">
                <p>
                  OrderId: <span>{item.id}</span>{" "}
                </p>
                <p>
                  status: <span>{item.status}</span>{" "}
                </p>
              </div>

              <Table className="table-borderless">
                <thead>
                  <tr>
                    <th className="text-center">No.</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Quantity Requested</th>
                    <th className="text-center">Quantity Issued</th>
                    <th className="text-center">Remarks</th>
                  </tr>
                </thead>
                <OrderList orderedProducts={item.products} />
              </Table>
              <div>
                <hr />
                <p className="time_slot" >
                  Order Pickup Time : {item.timeAlloted}
                </p>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
});

export default ComponentToPrint;
