import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Form } from 'react-bootstrap';

export default function List() {
    const bareUrl = 'http://localhost:8000/api/';
    const [transactions, setTransactions] = useState([])
    const [sortOrder, setSortOrder] = useState("newest");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const sortData = (sortOrder) => {
        switch (sortOrder) {
            case "newest":
                setTransactions(transactions.sort((a, b) => (a.id < b.id ? 1 : -1)));
                break;
            case "oldest":
                setTransactions(transactions.sort((a, b) => (a.id > b.id ? 1 : -1)));
                break;
            case "asc":
                setTransactions(transactions.sort((a, b) => (a.product.toLowerCase() > b.product.toLowerCase() ? 1 : -1)));
                break;
            case "desc":
                setTransactions(transactions.sort((a, b) => (a.product.toLowerCase() < b.product.toLowerCase() ? 1 : -1)));
                break;
            case "asc_qty":
                setTransactions(transactions.sort((a, b) => (a.qty > b.qty ? 1 : -1)));
                break;
            case "desc_qty":
                setTransactions(transactions.sort((a, b) => (a.qty < b.qty ? 1 : -1)));
                break;
            default:
                setTransactions(transactions.sort((a, b) => (a.id < b.id ? 1 : -1)));
                break;
        }
    };

    const handleSortOrderChange = (value) => {
        setSortOrder(value);
        sortData(value);
    };

    useEffect(() => {
        fetchTransaction()
    }, [])

    const fetchTransaction = async () => {
        await axios.get(bareUrl + `transaction`).then(({ data }) => {
            setTransactions(data.data)
        })
    }

    const handleSearch = async () => {
        if (searchTerm == '') {
            await axios.get(bareUrl + `transaction`).then(({ data }) => {
                setTransactions(data.data)
            })
        } else {
            await axios.get(bareUrl + `transaction/search/${searchTerm}`).then(({ data }) => {
                setTransactions(data.data)
            })
        }
    }

    const displayDate = (date) => {
        return moment(date).format('DD MMMM YYYY')
    }

    const deleteTransaction = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Hapus transaksi ini?',
            text: "Kamu akan kehilangan data ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Hapus'
        }).then((result) => {
            return result.isConfirmed;
        });

        if (!isConfirm) {
            return;
        }

        await axios.delete(bareUrl + `transaction/${id}`).then(({ data }) => {
            Swal.fire({
                icon: "success",
                text: data.message
            })
            fetchTransaction()
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    return (
        <div className='container'>
            <div className="row mb-3">
                <div className='col-3'>
                    <Form.Control type="text" area-aria-label="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className='col-2 p-0' style={{ width: '8.666667%' }}>
                    <Button variant="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
                <div className='col-3'>
                    <Form.Select aria-label="sortOrder" name="sortOrder"
                        onChange={(e) => { handleSortOrderChange(e.target.value) }}>
                        <option value={'newest'}>Terbaru</option>
                        <option value={'oldest'}>Terlama</option>
                        <option value={'asc'}>A-Z</option>
                        <option value={'desc'}>Z-A</option>
                        <option value={'asc_qty'}>Transaksi terendah</option>
                        <option value={'desc_qty'}>Transaksi terbanyak</option>
                    </Form.Select>
                </div>
                <div className='col-4 justify-content-end' style={{ width: '41.333333%' }}>
                    <Link className='btn btn-primary float-end' to={"/transaction/create"}>
                        Create Transaction
                    </Link>
                </div>
            </div>
            <div className='row'>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Nama Barang</th>
                                        <th>Stok</th>
                                        <th>Jumlah Terjual</th>
                                        <th>Tanggal Transaksi</th>
                                        <th>Jenis Barang</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        transactions.length > 0 && (
                                            transactions.map((row, key) => (
                                                <tr key={key}>
                                                    <td className='align-middle'>{key + 1}</td>
                                                    <td className='align-middle'>{row.product}</td>
                                                    <td className='align-middle'>{row.stock}</td>
                                                    <td className='align-middle'>{row.qty}</td>
                                                    <td className='align-middle'>{displayDate(row.created_at)}</td>
                                                    <td className='align-middle'>{row.types}</td>
                                                    <td className='align-middle'>
                                                        <Button variant="danger" onClick={() => deleteTransaction(row.id)}>
                                                            Hapus
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}