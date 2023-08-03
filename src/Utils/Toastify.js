import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({ autoClose: 2500 });

export const Toast = (message, type) => {
  switch (type) {
    case "success":
      return toast.success(
        <div>
          <p>{message}</p>
        </div>
      );
    case "error":
      return toast.error(
        <div>
          <p>{message}</p>
        </div>
      );
    case "warning":
      return toast.warning(
        <div>
          <p>{message}</p>
        </div>
      );
    default:
      return toast.warning(
        <div>
          <p>Toast not defined...</p>
        </div>
      );
  }
};
