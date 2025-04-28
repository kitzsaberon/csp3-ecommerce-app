import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function EditProduct({ product, fetchData }) {

	const [productId, setProductId] = useState(product._id);

	const [name, setName] = useState(product.name);
	const [description, setDescription] = useState(product.description);
	const [price, setPrice] = useState(product.price);

	const [showEdit, setShowEdit] = useState(false);

	const editOpen = () => {
		setShowEdit(true);
	}

	const editClose = () => {
		setShowEdit(false);
	}

	const editProduct = (e, productId) => {

		e.preventDefault();

		fetch(`http://localhost:4000/products/${productId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(res => res.json())
		.then(data => {

			if(data.success === true) {

				Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Successfully Updated!',
                    confirmButtonColor: '#3085d6'
                  });
				editClose();
				fetchData();

			} else {

				Swal.fire({
                    icon: 'error',
                    title: 'Failure!',
                    text: 'Something Went Wrong. Please Try Again.',
                    confirmButtonColor: '#d33'
                  });
				editClose();
				fetchData();
			}
		})
	}

	return (
		<>
			<Button variant="primary" size="sm" type="submit" className="mx-1" onClick={() => editOpen()}>Edit</Button>

			<Modal show={showEdit} onHide={editClose}>
				<Form onSubmit={(e) => editProduct(e, productId)}>
			        <Modal.Header closeButton>
			          	<Modal.Title>Edit Product</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			        	<Form.Group>
				        	<Form.Label>Name</Form.Label>
				        	<Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)}/>
			        	</Form.Group>

			        	<Form.Group>
				        	<Form.Label>Description</Form.Label>
				        	<Form.Control type="text" required value={description} onChange={(e) => setDescription(e.target.value)}/>
			        	</Form.Group>

			        	<Form.Group>
				        	<Form.Label>Price</Form.Label>
				        	<Form.Control type="number" required value={price} onChange={(e) => setPrice(e.target.value)}/>
			        	</Form.Group>
			        </Modal.Body>
			        <Modal.Footer>
			          	<Button variant="secondary" onClick={editClose}>Close</Button>
			          	<Button variant="success" type="submit">Save Changes</Button>
			        </Modal.Footer>
		        </Form>
		    </Modal>
		</>
	)
}