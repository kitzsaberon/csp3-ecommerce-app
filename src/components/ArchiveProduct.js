import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ArchiveProduct({product, isActive, fetchData}) {

    const [productId, setProductId] = useState(product._id);

    const archiveToggle = () => {
        fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/${productId}/archive`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(async res => {

            const data = await res.json();

            if (res.ok) {
                
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message || 'Successfully Archived!',
                    confirmButtonColor: '#3085d6'
                  });

            } else {
                
                Swal.fire({
                    icon: 'error',
                    title: 'Failure!',
                    text: data.message || 'Something Went Wrong!',
                    confirmButtonColor: '#d33'
                  });
            }
            fetchData();
        });
    }


    const activateToggle = () => {
        fetch(`https://9791shtc1e.execute-api.us-west-2.amazonaws.com/production/products/${productId}/activate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(async res => {

            const data = await res.json();

            if (res.ok) {

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: data.message || 'Successfully Activated!',
                    confirmButtonColor: '#3085d6'
                  });

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Failure!',
                    text: data.message || 'Something Went Wrong!',
                    confirmButtonColor: '#d33'
                  });   
            }
            fetchData();
        });
    }
 
    return (
		isActive ?
			<Button variant="danger" size="sm" onClick={() => archiveToggle()}>Archive</Button>
        :
			<Button variant="success" size="sm" onClick={() => activateToggle()}>Activate</Button>
    )
}