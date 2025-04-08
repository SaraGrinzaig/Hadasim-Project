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
  const [selectedGoods, setSelectedGoods] = useState<{ [goodId: string]: boolean }>({});

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
        const initialSelected: { [goodId: string]: boolean } = {};
        res.data.forEach((g: Good) => {
          initialQuantities[g.goodId._id] = g.minOrderQuantity ?? 0;
          initialSelected[g.goodId._id] = false;
        });
        setQuantities(initialQuantities);
        setSelectedGoods(initialSelected);
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

  const handleCheckboxChange = (goodId: string, checked: boolean) => {
    setSelectedGoods(prev => ({ ...prev, [goodId]: checked }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const items = Object.entries(selectedGoods)
      .filter(([goodId, isSelected]) => isSelected)
      .map(([goodId]) => {
        const quantity = quantities[goodId];
        const good = goods.find(g => g.goodId._id === goodId);
        return {
          goodId,
          quantity,
          valid: good && quantity >= good.minOrderQuantity
        };
      })
      .filter(item => item.valid)
      .map(item => ({ goodId: item.goodId, quantity: item.quantity }));

    if (items.length === 0) {
      alert('Please select at least one product and enter valid quantity');
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
                    <th>Select</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.map(good => {
                    const goodId = good.goodId._id;
                    return (
                      <tr key={good._id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedGoods[goodId] || false}
                            onChange={e => handleCheckboxChange(goodId, e.target.checked)}
                          />
                        </td>
                        <td>{good.goodId.name}</td>
                        <td>
                          {selectedGoods[goodId] && (
                            <Form.Control
                              type="number"
                              min={good.minOrderQuantity}
                              step={1}
                              value={quantities[goodId] || good.minOrderQuantity}
                              onChange={e => handleQuantityChange(goodId, Number(e.target.value))}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
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