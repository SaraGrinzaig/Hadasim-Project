import { useEffect, useState } from 'react';
import { Container, Button, Badge, Table, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CreateOrderForm from './CreateOrderForm';
import { Plus } from 'react-bootstrap-icons';

interface OrderItem{
    goodId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
}

interface Supplier{
    _id: string;
    companyName: string;
    email: string;
    phone: string;
    representativeName: string;
}

interface Order {
    _id: string;
    supplierId: Supplier;
    items: OrderItem[];
    status: 'invited' | 'in process' | 'completed';
    createdAt: string;
}

export default function AllOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'invited' | 'in process' | 'completed'>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(res.data);
        } catch (err: any) {
            console.error('Failed to fetch orders:', err);
            setError('שגיאה בטעינת ההזמנות');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: Order['status']) => {
        const colorMap: { [key in Order['status']]: string } = {
            invited: 'warning',
            'in process': 'info',
            completed: 'success',
        };
        return <Badge bg={colorMap[status]} className="text-capitalize">{status}</Badge>;
    };

    const approveOrder = async (orderId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
                status: 'completed'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedOrder = res.data;
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
        } catch (err) {
            console.error('Failed to approve order:', err);
            alert('failed in approving the order.');
        }
    };

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(order => order.status === statusFilter);

    if (loading) return <div className="text-center mt-4">loading orders...</div>;
    if (error) return <div className="text-danger text-center mt-4">{error}</div>;

    return (
        <Container fluid className="mt-2">

            <div className="text-center mb-4">
                <h2 className="fw-bold d-inline-block border-bottom pb-2">
                    All Orders
                </h2>
            </div>

            <Row className="align-items-center mb-3 px-3">
                <Col xs={12} md={6}>
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        style={{ maxWidth: '250px' }} 
                    >
                        <option value="all">All Orders</option>
                        <option value="invited">Invited</option>
                        <option value="in process">In Process</option>
                        <option value="completed">Completed</option>
                    </Form.Select>
                </Col>
                <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                    <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                        <Plus className="me-2" />
                        Create New Order
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive className="w-100 text-center align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Total Items</th>
                        {/* <th>Total Price</th> */}
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.supplierId?.companyName}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>{order.items.length}</td>
                            {/* <td>{order.items[index].totalPrice}</td> */}
                            <td>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                            <td>
                                {order.status === 'in process' && (
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => approveOrder(order._id)}>
                                        Approve
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <CreateOrderForm show={showModal} handleClose={() => setShowModal(false)} />
        </Container>
    );
}
