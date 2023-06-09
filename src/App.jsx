import { useState } from 'react'
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import TransactionList from "./components/list.component";
import CreateTransaction from './components/create.component';
import EditTransaction from './components/edit.component';

function App() {
    return (<Router>
        <Navbar bg="primary">
            <Container>
                <Link to={"/"} className="navbar-brand text-white">
                    E-commerce
                </Link>
            </Container>
        </Navbar>

        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <Routes>
                        <Route path="/transaction/create" element={<CreateTransaction />} />
                        <Route path="/transaction/:id/edit" element={<EditTransaction />} />
                        <Route exact path='/' element={<TransactionList />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    </Router>);
}

export default App;
