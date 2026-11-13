import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useCustomToast } from "../ui/toast-context";
import { addCollection, updateCollection } from '../../services/firebaseService';
import { Button, Field, inputClass, useAdminT } from './AdminUI';

const CollectionForm = ({ collectionItem, onClose, onSave }) => {
  const at = useAdminT();
  const toast = useCustomToast();
  const [isSaving, setIsSaving] = useState(false);
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

    if (!formData.name.trim()) {
      toast({ type: "error", message: at('collectionNameRequired') });
      return;
    }

    setIsSaving(true);
    try {
      const collectionData = {
        name: formData.name.trim(),
        description: formData.description,
      };

      if (collectionItem?.id) {
        await updateCollection(collectionItem.id, collectionData);
        toast({ type: "success", message: at('collectionUpdated', { name: collectionData.name }) });
      } else {
        await addCollection(collectionData);
        toast({ type: "success", message: at('collectionCreated', { name: collectionData.name }) });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving collection:', error);
      toast({ type: "error", message: at('genericError') });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Field label={at('collectionName')} required requiredLabel={at('required')} htmlFor="cf-name">
        <input
          type="text"
          id="cf-name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder={at('collectionNamePh')}
          required
          className={inputClass}
        />
      </Field>

      <Field label={at('fieldDescription')} htmlFor="cf-desc">
        <textarea
          id="cf-desc"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={at('collectionDescPh')}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </Field>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <Button type="submit" variant="accent" icon={Check} loading={isSaving}>
          {collectionItem ? at('update') : at('create')}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>{at('cancel')}</Button>
      </div>
    </form>
  );
};

export default CollectionForm;
