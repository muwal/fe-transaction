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
    const bareUrl = 'http://localhost:8000/api/';

    const [transaction, setTransaction] = useState(
        {
            id_products: '',
            'qty': ''
        }
    );
    const [products, setProducts] = useState([]);
    const [itemProduct, setItemProduct] = useState([]);
    const [qtyValue, setQtyValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [warningText, setWarningText] = useState('');

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        await axios.get(bareUrl + `product`).then(({ data }) => {
            setProducts(data.data)
        })
    }

    const handleItemChange = (item) => {

        var product = products.find((product) => {
            return product.id == item
        })

        setItemProduct(product);
        setTransaction({
            ...transaction,
            id_products: product.id,
        })
    }

    const handleQtyChange = (e) => {
        if (e.target.value > itemProduct.stock) {
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
        axios.post(bareUrl + `transaction`, transaction).then(response => {
            setIsSaving(false)
            setItemProduct([])
            setQtyValue('')
            setWarningText('')
            setProducts([])
            navigate('/')
        }).catch(error => {
            setIsSaving(false)
            console.log(error)
        });
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
                                <Form>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId="Product">
                                                <Form.Label>Product</Form.Label>
                                                <Form.Select aria-label="Product" name="product"
                                                    onChange={(e) => { handleItemChange(e.target.value) }}>
                                                    <option disabled>Open this select menu</option>
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
                                                <Form.Control type="text" defaultValue={itemProduct.stock} readOnly disabled area-aria-label="Stock" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Types">
                                                <Form.Label>Types</Form.Label>
                                                <Form.Control type="text" defaultValue={itemProduct.types} readOnly disabled area-aria-label="Types" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="my-3">
                                        <Col>
                                            <Form.Group controlId="Quantity">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" area-aria-label="Stock" className="mb-2" value={qtyValue} onChange={handleQtyChange} min={0} />
                                                {warningText}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" className="mt-2 float-end" size="md" block="block" type="submit" disabled={!qtyValue || qtyValue > itemProduct.stock || isSaving} onClick={handleSave}>
                                        {isSaving ? 'Saving...' : 'Create'}
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}