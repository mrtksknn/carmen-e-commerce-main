import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCustomToast } from "../ui/toast-context";
import { db } from '../../firebase';
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';

const CollectionForm = ({ collectionItem, onClose, onSave }) => {
    const toast = useCustomToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (collectionItem) {
            setFormData({
                name: collectionItem.name || '',
                description: collectionItem.description || '',
            });
        }
    }, [collectionItem]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            toast({ type: "error", message: "Please enter a collection name." });
            return;
        }

        try {
            const collectionData = {
                name: formData.name,
                description: formData.description,
            };

            if (collectionItem?.id) {
                await updateDoc(doc(db, 'collections', collectionItem.id), collectionData);
                toast({ type: "success", message: `${formData.name} koleksiyonu başarıyla güncellendi.` });
            } else {
                await addDoc(collection(db, 'collections'), {
                    ...collectionData,
                    timeStamp: serverTimestamp(),
                });
                toast({ type: "success", message: `${formData.name} koleksiyonu başarıyla oluşturuldu.` });
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving collection:', error);
            toast({ type: "error", message: "Something went wrong. Please try again." });
        }
    };

    return (
        <Card className="bg-[#0a0a0a] border-none shadow-none w-full max-w-4xl">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-serif text-white">{collectionItem ? "Update Collection" : "Create New Collection"}</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Collection Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Enter collection name"
                            required
                            className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background-dark text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="Enter collection description"
                            rows={4}
                            className="w-full px-4 py-3 border border-primary/30 rounded-lg bg-background-dark text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 resize-y"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                        >
                            {collectionItem ? "Update Collection" : "Create Collection"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-primary/30 text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:border-primary/60 hover:bg-primary/10 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CollectionForm;
