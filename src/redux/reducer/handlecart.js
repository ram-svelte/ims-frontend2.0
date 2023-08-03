import {
  ADDITEM,
  DECITEM,
  REMITEM,
  INCITEM,
  RESET,
  FETCH_USERS_CART_FAILURE,
  FETCH_USERS_CART_SUCCESS,
  FETCH_USERS_CART_REQUEST,
} from "../types";

const initialState = {
  loading: false,
  cart: [],
  error: "",
};

const handleCart = (state = initialState, action) => {
  const product = action.payload;
  switch (action.type) {
    case FETCH_USERS_CART_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_CART_SUCCESS:
      return {
        loading: false,
        cart: action.payload,
        error: "",
      };
    case FETCH_USERS_CART_FAILURE:
      return {
        loading: false,
        cart: [],
        error: action.payload,
      };

    case ADDITEM:
      //chech if product already exists
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        //increast the Quantity
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: product.qty } : x
        );
      } else {
        const product = action.payload;
        return [...state, { ...product }];
      }

    case DECITEM:
      const exist1 = state.find((x) => x.id === product.id);

      return state.map((x) =>
        x.id === product.id ? { ...x, qty: product.qty } : x
      );

    case REMITEM:
      const exist2 = state.find((x) => x.id === product.id);
      return state.filter((x) => x.id !== exist2.id);

    case INCITEM:
      return state.map((x) =>
        x.id === product.id ? { ...x, qty: product.qty } : x
      );
    case RESET:
      return (state = []);

    default:
      return state;
  }
};

export default handleCart;

// import {
//   ADDITEM,
//   DECITEM,
//   REMITEM,
//   INCITEM,
//   RESET,
//   FETCH_USERS_CART_FAILURE,
//   FETCH_USERS_CART_SUCCESS,
//   FETCH_USERS_CART_REQUEST,
// } from "../types";

// const initialState = {
//   loading: false,
//   cart: [],
//   error: "",
// };

// if (sessionStorage.getItem("cartItemArray")) {
//   initialState.cart = JSON.parse(sessionStorage.getItem("cartItemArray"));
// } else {
//   initialState.cart = [];
// }

// const handleCart = (state = initialState, action) => {
//   const product = action.payload;
//   switch (action.type) {
//     case FETCH_USERS_CART_REQUEST:
//       return {
//         ...state,
//         loading: true,
//       };
//     case FETCH_USERS_CART_SUCCESS:
//       return {
//         loading: false,
//         cart: action.payload,
//         error: "",
//       };
//     case FETCH_USERS_CART_FAILURE:
//       return {
//         loading: false,
//         cart: [],
//         error: action.payload,
//       };
//     case ADDITEM:
//       //chech if product already exists
//       console.log("in ADDitem", product);
//       const exist = state.cart.find((x) => x.id === product.id);
//       console.log("exist is ", exist);
//       if (exist) {
//         //increast the Quantity
//         console.log(
//           "state.cart.map",
//           state.cart.map((x) =>
//             x.id === product.id ? { ...x, qty: product.qty } : x
//           )
//         );
//         const data = state.cart.map((x) =>
//           x.id === product.id ? { ...x, qty: product.qty } : x
//         );
//         return {
//           loading: false,
//           cart: data,
//           error: "",
//         };
//       } else {
//         const product = action.payload;
//         const data = [...state.cart, { ...product }];
//         return {
//           loading: false,
//           cart: data,
//           error: "",
//         };
//       }

//     case DECITEM:
//       const exist1 = state.cart.find((x) => x.id === product.id);

//       const data = state.cart.map((x) =>
//         x.id === product.id ? { ...x, qty: product.qty } : x
//       );
//       return {
//         loading: false,
//         cart: data,
//         error: "",
//       };

//     case REMITEM:
//       const exist2 = state.find((x) => x.id === product.id);
//       return state.filter((x) => x.id !== exist2.id);

//     case INCITEM:
//       return state.map((x) =>
//         x.id === product.id ? { ...x, qty: product.qty } : x
//       );
//     case RESET:
//       return (state = []);

//     default:
//       return state;
//   }
// };

// export default handleCart;
