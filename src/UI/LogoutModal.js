import React from "react";
import { Button } from "react-bootstrap";
import ReactDom from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "70px",
  zIndex: 1000,
  borderRadius: 20,
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <div style={{ marginBottom: 50, color: "red", fontWeight: "bold" }}>
          You have been logged out. Please login again
        </div>
        <Button
          onClick={onClose}
          style={{ display: "block", marginLeft: "40%" }}
        >
          OK
        </Button>

        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
