import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Table } from 'react-bootstrap';
import CreateOrderForm from './CreateOrderForm';

type OrderItem = {
    goodId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
};

type Supplier = {
    _id: string;
    companyName: string;
    email: string;
    phone: string;
    representativeName: string;
};

type Order = {
    _id: string;
    supplierId: Supplier;
    items: OrderItem[];
    status: 'invited' | 'in process' | 'completed';
    createdAt: string;
};

export default function AllOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>All Orders</h2>
                <Button onClick={() => setShowModal(true)} variant="primary">
                    Create New Order
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Total Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, idx) => (
                        <tr key={order._id}>
                            <td>{idx + 1}</td>
                            <td>{order.supplierId.companyName}</td>
                            <td>{order.status}</td>
                            <td>{order.items.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <CreateOrderForm show={showModal} handleClose={() => setShowModal(false)} />
        </Container>
    );
}
