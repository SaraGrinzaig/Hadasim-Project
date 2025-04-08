import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface GoodInput {
    name: string;
    description: string;
    pricePerUnit: number;
    minOrderQuantity: number;
    [key: string]: string | number;
}

interface RegisterForm {
    companyName: string;
    representativeName: string;
    phone: string;
    email: string;
    password: string;
    goods: GoodInput[];
}


function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        companyName: '',
        representativeName: '',
        phone: '',
        email: '',
        password: '',
        goods: [
            { name: '', description: '', pricePerUnit: 0, minOrderQuantity: 0 }
        ],
    });

    // const validateForm = (): string | null => {
    //     if (!form.companyName.trim()) return 'Company name is required';
    //     if (!form.representativeName.trim()) return 'Representative name is required';
    //     if (!form.phone.trim()) return 'Phone number is required';
    //     if (!form.email.trim()) return 'Email is required';
    //     if (!form.password.trim()) return 'Password is required';

    //     for (let i = 0; i < form.goods.length; i++) {
    //         const good = form.goods[i];
    //         if (!good.name.trim()) return `Good #${i + 1}: Name is required`;
    //         if (good.pricePerUnit <= 0) return `Good #${i + 1}: Price per unit must be greater than 0`;
    //         if (good.minOrderQuantity <= 0) return `Good #${i + 1}: Minimum order quantity must be greater than 0`;
    //     }

    //     return null;
    // };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number, field?: string) => {
        const value = e.target.value;

        // const errorMsg = validateForm();
        // if (errorMsg) {
        //     alert(errorMsg);
        //     return;
        // }

        if (field && typeof index === 'number') {
            const updatedGoods = [...form.goods];
            const good = { ...updatedGoods[index] };

            if (field === 'pricePerUnit' || field === 'minOrderQuantity') {
                good[field] = parseFloat(value);
            } else {
                good[field] = value;
            }

            updatedGoods[index] = good;
            setForm({ ...form, goods: updatedGoods });
        } else {
            setForm({ ...form, [e.target.name]: value });
        }
    };

    const addGood = () => {
        setForm({
            ...form,
            goods: [...form.goods, { name: '', description: '', pricePerUnit: 0, minOrderQuantity: 0 }]
        });
    };

    const removeGood = (index: number) => {
        const updatedGoods = [...form.goods];
        updatedGoods.splice(index, 1);
        setForm({ ...form, goods: updatedGoods });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/suppliers/signup', form);
            const { token, supplier } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', 'supplier');
            localStorage.setItem('supplierId', supplier._id);

            navigate('/supplier');
        } catch (error: any) {
            alert(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Register as a New Supplier</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Company Name</label>
                    <input name="companyName" className="form-control" required value={form.companyName} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label>Representative Name</label>
                    <input name="representativeName" className="form-control" required value={form.representativeName} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label>Phone Number</label>
                    <input name="phone" className="form-control" required value={form.phone} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label>Email</label>
                    <input name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <input name="password" type="password" className="form-control" required value={form.password} onChange={handleChange} />
                </div>

                <hr />
                <h5>Goods Offered</h5>
                {form.goods.map((good, index) => (
                    <div key={index} className="border p-3 mb-3 rounded bg-light">
                        <div className="mb-2">
                            <label>Good Name</label>
                            <input className="form-control" value={good.name} onChange={e => handleChange(e, index, 'name')} required />
                        </div>
                        <div className="mb-2">
                            <label>Description</label>
                            <input className="form-control" value={good.description} onChange={e => handleChange(e, index, 'description')} />
                        </div>
                        <div className="mb-2">
                            <label>Price per Unit</label>
                            <input type="number" className="form-control" value={good.pricePerUnit} onChange={e => handleChange(e, index, 'pricePerUnit')} required />
                        </div>
                        <div className="mb-2">
                            <label>Minimum Order Quantity</label>
                            <input type="number" className="form-control" value={good.minOrderQuantity} onChange={e => handleChange(e, index, 'minOrderQuantity')} required />
                        </div>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeGood(index)}>Remove Good</button>
                    </div>
                ))}

                <button type="button" className="btn btn-secondary mb-3" onClick={addGood}>Add Another Good</button>

                <br />
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
}

export default Register;
