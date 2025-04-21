import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Select, MenuItem, Paper, Container } from '@mui/material';
import OrdersList from './OrdersList';

interface Order {
  _id: string;
  supplierId: string;
  items: OrderItem[];
  status: 'invited' | 'in process' | 'completed';
  createdAt: string;
}

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

const SupplierDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');
  
    const supplierId = localStorage.getItem('supplierId');
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/orders/supplier/${supplierId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(res.data);
        } catch (err) {
          console.error('Failed to fetch orders:', err);
        }
      };
  
      if (supplierId && token) fetchOrders();
    }, [supplierId, token]);
  
    const handleApprove = async (orderId: string) => {
      try {
        await axios.patch(
          `http://localhost:5000/api/orders/${orderId}/status`,
          { status: 'in process' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(prev =>
          prev.map(o => (o._id === orderId ? { ...o, status: 'in process' } : o))
        );
      } catch (err) {
        console.error('Failed to approve order:', err);
      }
    };
  
    const filteredOrders = statusFilter === 'all'
      ? orders
      : orders.filter(o => o.status === statusFilter);
  
      return (
        <Container maxWidth="lg">
          <div className="my-5">
            <h2 className="text-center mb-4">Supplier Orders</h2>
      
            <div className="text-center mb-3">
              <select
                className="form-select w-auto d-inline-block"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="invited">Invited</option>
                <option value="in process">In Process</option>
                <option value="completed">Completed</option>
              </select>
            </div>
      
            <OrdersList orders={filteredOrders} onApprove={handleApprove} />
          </div>
        </Container>
      );
      
  };
  
  export default SupplierDashboard;