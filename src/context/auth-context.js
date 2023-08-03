import React from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  userName:'',
});

export default AuthContext;
