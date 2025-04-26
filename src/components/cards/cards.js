import React, { useState } from 'react';
import { db } from "../../firebase";
import {doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import '../../assets/styles/components/cards.css';

const Cards = ({ image, name, sold, price, category, changeable, id }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: '' });

    const handleDelete = async (e) => {
        e.preventDefault();
        const confirmation = window.confirm("Ürünü silmek istediğinize emin misiniz?");
        if (confirmation) {
            try {
                await deleteDoc(doc(db, 'products', id));
                console.log('Document successfully deleted!');
            } catch (error) {
                console.error('Error removing document: ', error);
            }
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data());
                setIsModalOpen(true);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error('Error fetching document: ', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, 'products', id);
            await updateDoc(docRef, formData);
            setIsModalOpen(false);
            console.log('Document successfully updated!');
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const cardStyle = {
        backgroundImage: `url(${image})`, // `url()` içinde props olarak gelen image değerini kullan
        backgroundSize: 'cover', // Arka plan resminin kaplamasını sağla
        backgroundPosition: 'center', // Arka plan resminin ortalanmasını sağla
    };

    return (
        <div>
            <a href={`/details/${name?.toLowerCase()}`} className='card' style={cardStyle}>
                <div className='card-bottom' style={{ fontSize: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <span style={{ marginRight: "5px" }}>{name}</span>
                            {category === 'baskı' && <span> - ({category})</span>}
                        </div>
                    </div>
                    {price && <span>{price} TL</span>}
                </div>
                {sold && <span className='sold bold'>Satıldı</span>}

                {changeable && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.5rem' }}>
                        <button className='uploadCards' style={{ top: "10px", left: "10px" }} onClick={handleEdit}>
                            <span className="material-icons delete">edit</span>
                        </button>
                        <button className='uploadCards' style={{ top: "10px", right: "10px" }} onClick={handleDelete}>
                            <span className="material-icons delete">delete</span>
                        </button>
                    </div>
                )}
            </a>

            {isModalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <span className='modal-title'>Güncelle - {formData.name}</span>
                            <button className='close' onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <div className='modal-body'>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleUpdate}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Adı:</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Ücret:</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label>Kategori:</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleChange} />
                                </div>
                                <div className='modal-footer'>
                                    <button type="button" className='btn-cancel' onClick={() => setIsModalOpen(false)}>Vazgeç</button>
                                    <button type="submit" className='btn-submit'>Güncelle</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
  
  export default Cards;

