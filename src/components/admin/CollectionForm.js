import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCustomToast } from "../ui/toast-context";
import { db } from '../../firebase';
import {
    collection,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';

const CollectionForm = ({ onClose, onSave }) => {
    const toast = useCustomToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            toast({ type: "error", message: "Please enter a collection name." });
            return;
        }

        try {
            const newCollection = {
                name: formData.name,
                description: formData.description,
                timeStamp: serverTimestamp(),
            };

            await addDoc(collection(db, 'collections'), newCollection);

            toast({ type: "success", message: `${formData.name} collection has been created successfully.` });

            onSave();
            onClose();
        } catch (error) {
            console.error('Error creating collection:', error);
            toast({ type: "error", message: "Something went wrong. Please try again." });
        }
    };

    return (
        <Card style={{ borderColor: "rgba(229, 231, 235, 0.23)" }}>
            <CardHeader>
                <CardTitle>Create New Collection</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
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
                            style={{ borderColor: "rgb(243 244 246 / 0.25)" }}
                            className="w-full px-4 py-2 border rounded bg-black text-white"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-medium">
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
                            rows={3}
                            style={{ borderColor: "rgb(243 244 246 / 0.25)" }}
                            className="w-full px-4 py-2 border rounded bg-black text-white"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-white text-black py-2 px-4 rounded hover:bg-gray-200"
                        >
                            Create Collection
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ borderColor: "rgb(243 244 246 / 0.25)" }}
                            className="flex-1 border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black"
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
