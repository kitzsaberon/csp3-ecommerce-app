import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';


export default function EditProduct({ product, fetchData }) {

  const [productId, setProductId] = useState(product._id);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [showEdit, setShowEdit] = useState(false);

  const editOpen = () => setShowEdit(true);
  const editClose = () => setShowEdit(false);


  const editProduct = async (e, productId) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/${productId}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, description, price })
      });

      const data = await response.json();

      console.log('Response:', response);
      console.log('Data:', data);

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message || 'Product updated successfully!',
          confirmButtonColor: '#3085d6'
        });

      } else {
        Swal.fire({
          icon: 'failure',
          title: 'Failure!',
          text: data.message || 'Something Went Wrong.',
          confirmButtonColor: '#d33'
        });
      }
      editClose();
      fetchData();

    } catch (error) {
      console.error('Error editing product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Network Error or Server Problem. Please Try Again.',
        confirmButtonColor: '#d33'
      });
      editClose();
    }
  }

  return (
    <>
        <Button variant="warning" size="sm" className="mx-1 d-flex align-items-center gap-1" onClick={editOpen}>
          <FaEdit /> Edit
        </Button>


      <Modal show={showEdit} onHide={editClose}>
        <Form onSubmit={(e) => editProduct(e, productId)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
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
