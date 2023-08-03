import { useState, useCallback } from "react";
import axios from "axios";
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    const method = requestConfig.method || "get";
    let response = null;
    try {
      if (method === "get") {
        // response = await axios.get(requestConfig.url);
        response = await axios.get(requestConfig.url, {
          headers: requestConfig.headers,
        });
      } else {
        //post request
        // response = await axios.request({
        //   method: "POST",
        //   url: requestConfig.url,
        //   headers: requestConfig.headers
        //     ? requestConfig.headers
        //     : "application/json",
        //   data: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        // });
      }

      
      const data = response.data;
  
      applyData(data);
    } catch (err) {
      //console.log("i m in error block");
      setError(err.message || "Something went wrong!");
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
