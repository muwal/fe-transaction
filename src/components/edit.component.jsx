import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function EditTransaction() {
    const bareUrl = 'http://localhost:8000/api/';
    const navigate = useNavigate();
    const { id } = useParams();

    const [transaction, setTransaction] = useState([]);
    const [products, setProducts] = useState([]);
    const [itemProduct, setItemProduct] = useState();
    const [qtyValue, setQtyValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [warningText, setWarningText] = useState('');

    useEffect(() => {
        fetchTransaction()
    }, [])

    const fetchTransaction = async () => {
        await axios.get(bareUrl + `transaction/${id}/edit`).then(({ data }) => {
            setTransaction(data.data)
            setQtyValue(data.data.qty)
            setItemProduct(data.data.id_product)
        })
    }
    // const handleItemChange = (item) => {

    //     var product = products.find((product) => {
    //         return product.id == item
    //     })

    //     setItemProduct(product);
    //     setTransaction({
    //         ...transaction,
    //         id_products: product.id,
    //     })
    // }

    const handleQtyChange = (e) => {
        if (e.target.value > transaction.stock) {
            setIsSaving(false)
            setQtyValue(e.target.value);
            setWarningText(<span className="text-danger">Quantity can't be higher than stock</span>)
        } else {
            setQtyValue(e.target.value);
            setWarningText('')
        }
        setTransaction({
            ...transaction,
            qty: e.target.value,
        })
    }

    const handleSave = () => {
        setIsSaving(true);
        axios.patch(bareUrl + `transaction/${id}`, {
            id_products: parseInt(itemProduct),
            qty: qtyValue
        }).then(response => {
            setIsSaving(false)
            setQtyValue('')
            setWarningText('')
            setTransaction([])
            Swal.fire({
                icon: "success",
                text: response.data.message
            })
            navigate("/")
        }).catch(error => {
            setIsSaving(false)
            Swal.fire({
                text: error.response.data.message,
                icon: "error"
            })
            console.log(error)
        });
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Edit Transaction</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Product">
                                                <Form.Label>Product</Form.Label>
                                                <Form.Select aria-label="Product" name="product" disabled>
                                                    <option defaultValue={transaction.id_products}>{transaction.product}</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Stock">
                                                <Form.Label>Stock</Form.Label>
                                                <Form.Control type="text" defaultValue={transaction.stock} readOnly disabled area-aria-label="Stock" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Types">
                                                <Form.Label>Types</Form.Label>
                                                <Form.Control type="text" defaultValue={transaction.types} readOnly disabled area-aria-label="Types" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Quantity">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" autoFocus area-aria-label="Stock" className="mb-2" value={qtyValue} onChange={handleQtyChange} min={0} />
                                                {warningText}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="float-end">
                                        <Col className="p-0">
                                            <Link to={`/`} className='btn btn-secondary'>
                                                Back
                                            </Link>
                                        </Col>
                                        <Col>
                                            <Button variant="primary" className="float-end" size="md" block="block" type="submit" disabled={!qtyValue || qtyValue == 0 || qtyValue > transaction.stock || isSaving} onClick={handleSave}>
                                                {isSaving ? 'Saving...' : 'Update'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}