import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

export default function CreateTransaction() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [itemProduct, setItemProduct] = useState();

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        await axios.get(`http://localhost:8000/api/product`).then(({ data }) => {
            setProducts(data.data)
        })
    }

    function handleItemChange(item) {
        setItemProduct(item);
        console.log(item)
        products.filter(data => {
            if (data.id === item) {
                console.log(true)
            } else {
                console.log(false)
            }
        })
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">New Transaction</h4>
                            <hr />
                            <div className="form-wrapper">
                                <Form >
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Product">
                                                <Form.Label>Product</Form.Label>
                                                <Form.Select aria-label="Product" name="product" value={itemProduct}
                                                    onChange={(e) => { console.log("id_product:", e.target.value); handleItemChange(e.target.value) }}>
                                                    {
                                                        products.length > 0 && (
                                                            products.map((row, key) => (
                                                                <option key={key} value={row.id}>{row.product}</option>
                                                            ))
                                                        )
                                                    }
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Stock">
                                                <Form.Label>Stock</Form.Label>
                                                <Form.Control type="text" disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Types">
                                                <Form.Label>Types</Form.Label>

                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Quantity">
                                                <Form.Label>Quantity</Form.Label>

                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" className="mt-2 float-end" size="md" block="block" type="submit">
                                        Create
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}