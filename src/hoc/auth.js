import { useEffect } from "react";

const Auth = (props) => {
  useEffect(() => {
    return () => {
      window.addEventListener(
        "beforeunload",
        function (e) {
        
          localStorage.clear();
          // clean localStorage here
        },
        false
      );
    };
  }, []);
  return <>{props.children}</>;
};

export default Auth;
