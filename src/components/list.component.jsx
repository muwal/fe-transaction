import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

export default function List() {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetchTransaction()
    }, [])

    const fetchTransaction = async () => {
        await axios.get(`http://localhost:8000/api/transaction`).then(({ data }) => {
            setTransactions(data.data)
        })
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

        await axios.delete(`http://localhost:8000/api/transaction/${id}`).then(({ data }) => {
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
            <div className="row">
                <div className='col-12'>
                    <Link className='btn btn-primary mb-3 float-end' to={"/create"}>
                        Create Transaction
                    </Link>
                </div>
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
                                                    <td>{key + 1}</td>
                                                    <td>{row.product}</td>
                                                    <td>{row.stock}</td>
                                                    <td>{row.qty}</td>
                                                    <td>{displayDate(row.created_at)}</td>
                                                    <td>{row.types}</td>
                                                    <td>
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