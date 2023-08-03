import { React, createContext, useState, Component } from "react";

const MyContext = createContext();

class MyProvider extends Component {
  state = {
    isLoggedIn: false,
    userName: "",
    categoryId: "",
    searchTitle: "",
    page: 0,
    catTitle: "stationary",
  };
  render() {
    return (
      <MyContext.Provider
        value={{
          isLoggedIn: this.state.isLoggedIn,
          userName: this.state.userName,
          categoryId: this.state.categoryId,
          searchTitle: this.state.searchTitle,
          page: this.state.page,
          catTitle: this.catTitle,
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

// const MyProvider = (props) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   return (
//     <MyContext.Provider value={{ isLoggedIn, userName: "" }}>
//       {props.children}
//     </MyContext.Provider>
//   );
// };

export { MyContext, MyProvider };
