/** @format */

import { Link } from 'react-router-dom';

const CardItems = ({title,image}) => {
	// console.log(props,'props');
	return(
	<div style={{borderRadius:"5px",cursor:"pointer"}} className='card-head'>
	<div style={{borderRadius:"5px"}}>
		<img width={200} height={200} src={false?image:"lap.jpg"}/>
	</div>
	<div style={{background: "#212121",color:"white",textAlign:"center",padding:"3px"}} className='card-title'>{title}</div>
	</div>
	);
};

export default CardItems;
