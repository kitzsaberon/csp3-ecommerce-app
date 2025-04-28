import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import PreviewProducts from './PreviewProducts';

export default function FeaturedProducts() {

	const [previews, setPreviews] = useState([]);

	useEffect(() => {

		fetch('https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/active')
		.then(res => res.json())
		.then(data => {

			const numbers = [];
			const featured = [];

			const generateRandomNumber = () => {
				let randomNum = Math.floor(Math.random() * data.length)

				if(numbers.indexOf(randomNum) === -1) {
					numbers.push(randomNum)
				} else {
					generateRandomNumber()
				}
			}

			for(let i=0; i < 3; i++) {
				generateRandomNumber()

				featured.push(<PreviewProducts data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={4} />)
			}

			setPreviews(featured);
		})
	}, [])
	return (
		<>
		<h2 className="text-center">Featured Products</h2>
		<CardGroup className="justify-content-center">
		{previews}
		</CardGroup>
		</>


		)
}