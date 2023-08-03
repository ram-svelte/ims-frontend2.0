import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { MyContext } from "../context";

const SearchBar = () => {
  const history = useHistory();
  const context = useContext(MyContext);

  const inputRef = useRef(null);
  const inputValue = (e) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      if (!inputRef.current.value.trim()) {
        return;
      } else {
        context.searchTitle = inputRef.current.value.trim();
        context.page = 1;
        history.push(`/s`);
      }
    }
  };

  return (
    <div className="search">
      <form onSubmit={inputValue}>
        <input
          ref={inputRef}
          className="form-control mr-sm-2"
          type="search"
          placeholder="Search here for products"
          aria-label="Search"
        />
      </form>
      <button onClick={inputValue} type="submit" className="searchButton">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default SearchBar;
