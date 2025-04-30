import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaArchive, FaCheckCircle } from 'react-icons/fa';


export default function ArchiveProduct({product, isActive, fetchData}) {

    const [productId] = useState(product._id);

    const archiveToggle = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
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
                <Button variant="danger" size="sm" className="d-flex align-items-center gap-1" onClick={archiveToggle}>
                <FaArchive /> Disable
                </Button>

        :
                <Button variant="success" size="sm" className="d-flex align-items-center gap-1" onClick={activateToggle}>
                <FaCheckCircle /> Activate
            </Button>
            
    )
}