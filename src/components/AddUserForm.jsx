import React, { useState } from 'react';
import { createUser } from '../services/api';

const AddUserForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        password: '',
        role: 'doctor', // Default
        branch_id: 1,
        specialization: ''
    });
    const [photo, setPhoto] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData, photo); // <--- API ga yuborish
            alert("Xodim muvaffaqiyatli qo'shildi!");
        } catch (error) {
            alert("Xatolik: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Yang Xodim Qo'shish</h2>

            <div style={{ marginBottom: '15px' }}>
                <label>F.I.O</label>
                <input required name="full_name" className="form-control" onChange={handleChange} />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Login</label>
                <input required name="username" className="form-control" onChange={handleChange} />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Parol</label>
                <input required type="password" name="password" className="form-control" onChange={handleChange} />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Lavozimi</label>
                <select name="role" className="form-control" onChange={handleChange}>
                    <option value="doctor">Doktor</option>
                    <option value="reception">Registratura</option>
                    <option value="nurse">Hamshira</option>
                    <option value="lab">Laborant</option>
                    <option value="cashier">Kassir</option>
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Rasm Yuklash</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Saqlash</button>
        </form>
    );
};

export default AddUserForm;
