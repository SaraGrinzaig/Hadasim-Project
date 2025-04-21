// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Button,
// } from '@mui/material';

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
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price/Unit</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order =>
                order.items.map(item => (
                  <tr key={item._id}>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{item.goodId.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.pricePerUnit}</td>
                    <td>{item.totalPrice}</td>
                    <td>
                      <span className={`badge 
                        ${order.status === 'invited' ? 'bg-warning' : 
                          order.status === 'in process' ? 'bg-info' : 'bg-success'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'invited' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onApprove(order._id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      );
};

export default OrdersList;  