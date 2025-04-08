import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';

interface Good {
    _id: string;
    name: string;
    description: string;
}

interface OrderItem {
    goodId: Good;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    _id: string;
}

interface Order {
    _id: string;
    supplierId: string;
    items: OrderItem[];
    status: 'invited' | 'in process' | 'completed';
    createdAt: string;
}

interface OrdersListProps {
    orders: Order[];
    onApprove: (orderId: string) => void;
}

const OrdersList = ({ orders, onApprove }: OrdersListProps) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price/Unit</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(order => (
                        order.items.map(item => (
                            <TableRow key={item._id}>
                                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{item.goodId.name}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.pricePerUnit}</TableCell>
                                <TableCell>{item.totalPrice}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    {order.status === 'invited' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => onApprove(order._id)}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrdersList;  