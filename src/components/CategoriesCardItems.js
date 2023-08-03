import { Link } from "react-router-dom";

const CardItems = (props) => {
  return (
    <div className="cat-prod text-center">
      <Link
        // style={
        //   props.title.toLowerCase() == "stationary" ||
        //   props.title.toLowerCase() == "misc."
        //     ? null
        //     : { pointerEvents: "none" }
        // }
        to={`/categories/${props.id}/${props.title}`}
      >
        <img alt="AltText" src={props.image} className="cat-imgsize" />
      </Link>
      <div className="cat-txt my-3">{props.title}</div>
    </div>
  );
};

export default CardItems;
