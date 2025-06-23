import React, { useState } from 'react';
import { db } from '../../firebase';
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import '../../assets/styles/components/cards.css';

const Cards = ({ image, name, sold, price, category, changeable, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', category: '' });

  const cardStyle = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('Ürünü silmek istediğinize emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        console.log('Document deleted.');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        setFormData(docSnap.data());
        setIsModalOpen(true);
      } else {
        console.log('Belge bulunamadı.');
      }
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'products', id), formData);
      setIsModalOpen(false);
      console.log('Document updated.');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <a href={`/details/${name?.toLowerCase()}`} className="card" style={cardStyle}>
        <div className="card-bottom text-lg flex justify-between items-center">
          <div>
            <span className="font-medium">{name}</span>
            {category === 'baskı' && <span className="ml-2 text-sm">({category})</span>}
          </div>
          {price && <span>{price} TL</span>}
        </div>

        {sold && <span className="sold bold">Satıldı</span>}

        {changeable && (
          <div className="flex justify-between items-center p-2 w-full">
            <button className="uploadCards" onClick={handleEdit}>
              <span className="material-icons delete">edit</span>
            </button>
            <button className="uploadCards" onClick={handleDelete}>
              <span className="material-icons delete">delete</span>
            </button>
          </div>
        )}
      </a>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Güncelle - {formData.name}</span>
              <button className="close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <form className="modal-body flex flex-col gap-4" onSubmit={handleUpdate}>
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Adı:</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="price">Ücret:</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleChange} />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="category">Kategori:</label>
                <input id="category" name="category" value={formData.category} onChange={handleChange} />
              </div>

              <div className="modal-footer flex justify-end gap-3">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn-submit">
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
