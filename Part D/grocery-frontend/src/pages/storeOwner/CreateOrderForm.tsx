import { useState, useEffect } from 'react';
import {
  Modal, Button, Form, Row, Col
} from 'react-bootstrap';
import axios from 'axios';

interface Props {
  show: boolean;
  handleClose: () => void;
}

export default function CreateOrderForm({ show, handleClose }: Props) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [goods, setGoods] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ goodId: string; quantity: number }[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/suppliers');
        setSuppliers(res.data);
      } catch (err) {
        console.error('Failed to load suppliers', err);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        if (selectedSupplier) {
          const res = await axios.get(`http://localhost:5000/api/goods/supplier/${selectedSupplier}`);
          setGoods(res.data);
        }
      } catch (err) {
        console.error('Failed to load goods', err);
      }
    };
    fetchGoods();
  }, [selectedSupplier]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', {
        supplierId: selectedSupplier,
        items: selectedItems,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Supplier</Form.Label>
            <Form.Select value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
              <option value="">Choose...</option>
              {suppliers.map(s => (
                <option key={s._id} value={s._id}>
                  {s.companyName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {goods.length > 0 && (
            <div className="mt-3">
              <h5>Select Goods</h5>
              {goods.map(good => (
                <Row key={good._id} className="mb-2 align-items-center">
                  <Col>{good.name}</Col>
                  <Col>
                    <Form.Control
                      type="number"
                      min={good.minQuantity}
                      placeholder={`Min: ${good.minQuantity}`}
                      onChange={e => {
                        const quantity = parseInt(e.target.value);
                        setSelectedItems(prev =>
                          prev.filter(i => i.goodId !== good._id).concat({ goodId: good._id, quantity }),
                        );
                      }}
                    />
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={!selectedSupplier || selectedItems.length === 0}>
          Submit Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
