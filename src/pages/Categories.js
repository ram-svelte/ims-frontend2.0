/** @format */

import React from 'react';
import CardItems from '../components/CategoriesCardItems';
import '../css/categories.css';
import NavigationBar from '../UI/NavigationBar';
import { useState, useEffect } from 'react';
import useHttp from '../hooks/use-http';
import { BASE_URL } from '../Urls';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { currentPath } from '../redux/action';
import { Carousel } from 'react-responsive-carousel';
import './index.css';
import SideBar from '../UI/sideBar';

function Categories() {
	const [items, setItems] = useState([]);
	const { isLoading, error, sendRequest: fetchCategories } = useHttp();
	const dispatch = useDispatch();
	const access_token = localStorage.getItem('jwtToken');
	//storing currentUrl to localStorage
	const currentUrl = window.location.href;
	const splitUrl = currentUrl.split('/');
	if (currentUrl.includes('?')) {
		const newUrl = splitUrl[3].split('?');
		localStorage.setItem('currentUrl', newUrl[0]);
		dispatch(currentPath(newUrl[0]));
	} else {
		localStorage.setItem('currentUrl', splitUrl[3]);
		dispatch(currentPath(splitUrl[3]));
	}

	useEffect(() => {
		const transformCategoryItems = (catItems) => {
			const loadedItems = [];
			catItems = catItems.data;

			for (const catKey in catItems) {
				loadedItems.push({
					id: catItems[catKey]._id,
					title: catItems[catKey].title,
					imagePath: catItems[catKey].categoryImage,
				});
			}
			setItems(loadedItems);
		};
		fetchCategories(
			{
				url: `${BASE_URL}/api/categories`,
				headers: { Authorization: `Bearer ${access_token}` },
			},
			transformCategoryItems
		);
	}, [fetchCategories]);

	const categoryItems = items.map((item, i) => (
		<CardItems
			index={i}
			key={item.id}
			title={item.title}
			image={item.imagePath}
			id={item.id}
		/>
	));
  const [active,setActive]=useState(1)
  useEffect(() => {
  
    //Implementing the setInterval method
    if(active<4){
      const interval = setInterval(() => {
        setActive(active + 1);
      }, 5000);
  
      //Clearing the interval
      return () => clearInterval(interval);
    }
    else{
      setActive(1);
    }
    
}, [active]);
	return (
		<>
			{error ? (
				<p>Error message</p>
			) : (
				<>
					<NavigationBar />
         
          <div className='flex-box'>
          <SideBar/>
          <div
						style={{ background: '#0083B7', height: '100vh' }}
						className='container-fluid categor'
					>
						{isLoading ? (
							<>
								<div className=' d-flex justify-content-center loading_spinner '>
									<LoadingSpinner />
								</div>
							</>
						) : (
							<>
								<div style={{ display: 'flex', justifyContent: 'center',gap:"20px",paddingTop:"1rem"}}>
									<div>
										<img
											width={700}
											height={420}
                      style={{borderRadius:"20px"}}
											src={`/img/${active}.png`}
										/>
									</div>
									<div style={{ display: 'flex', justifyContent: 'center',flexDirection:"column",gap:"20px" }}>
										<div>
											<img
												width={340}
												height={200}
                        style={{borderRadius:"20px"}}
												src='/img/2.png'
											/>
										</div>{' '}
										<div>
											<img
												width={340}
												height={200}
                        style={{borderRadius:"20px"}}
												src='/img/3.png'
											/>
										</div>{' '}
									</div>
								</div>

								<div className='heading-cate'> Categories </div>
								<div className='main_content'>{categoryItems}</div>
							</>
						)}
					</div>
          </div>
				
				</>
			)}
		</>
	);
}

export default Categories;
