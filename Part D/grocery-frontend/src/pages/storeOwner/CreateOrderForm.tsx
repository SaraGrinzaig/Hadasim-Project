import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

interface Supplier {
  _id: string;
  companyName: string;
}

interface Good {
  _id: string;
  goodId: {
    _id: string;
    name: string;
  };
  pricePerUnit: number;
  minOrderQuantity: number;
}

interface Props {
  show: boolean;
  handleClose: () => void;
}

export default function CreateOrderForm({ show, handleClose }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [goods, setGoods] = useState<Good[]>([]);
  const [quantities, setQuantities] = useState<{ [goodId: string]: number }>({});
  const [loadingGoods, setLoadingGoods] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(res.data);
    };

    if (show) {
      fetchSuppliers();
      setSelectedSupplier('');
      setGoods([]);
      setQuantities({});
    }
  }, [show]);

  useEffect(() => {
    const fetchGoods = async () => {
      if (!selectedSupplier) return;
      setLoadingGoods(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/goods/supplier/${selectedSupplier}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoods(res.data);
        // reset quantities
        const initialQuantities: { [goodId: string]: number } = {};
        res.data.forEach((g: Good) => {
          initialQuantities[g.goodId._id] = g.minOrderQuantity ?? 0;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error('Failed to load goods:', err);
      } finally {
        setLoadingGoods(false);
      }
    };

    fetchGoods();
  }, [selectedSupplier]);

  const handleQuantityChange = (goodId: string, value: number) => {
    setQuantities(prev => ({ ...prev, [goodId]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const items = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([goodId, quantity]) => ({ goodId, quantity }));

    if (items.length === 0) {
      alert('Please select at least one item with quantity > 0');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/orders', {
        supplierId: selectedSupplier,
        items
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      handleClose();
    } catch (err) {
      console.error('Failed to create order:', err);
      alert('Failed to create order');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4">
          <Form.Label>Select Supplier</Form.Label>
          <Form.Select
            value={selectedSupplier}
            onChange={e => setSelectedSupplier(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {suppliers.map(supplier => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.companyName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {selectedSupplier && (
          <>
            <h5>Select Goods</h5>
            {loadingGoods ? (
              <div>Loading goods...</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.map(good => (
                    <tr key={good._id}>
                      <td>{good.goodId.name}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min={0}
                          value={quantities[good.goodId._id] || 0}
                          onChange={e => handleQuantityChange(good.goodId._id, Number(e.target.value))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Submit Order</Button>
      </Modal.Footer>
    </Modal>
  );
}