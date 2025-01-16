'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { ImageUpload } from '@/types/image';

export function UploadForm({ onUpload }: { onUpload: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ImageUpload>({
    title: '',
    description: '',
    file: null as unknown as File,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(formData.file);
      reader.onloadend = async () => {
        const base64data = reader.result;

        const response = await fetch('/api/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            imageBase64: base64data,
          }),
        });

        if (response.ok) {
          setFormData({ title: '', description: '', file: null as unknown as File });
          onUpload();
        }
      };
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          required
          accept="image/*"
          className="mt-1 block w-full"
          onChange={(e) => setFormData({ ...formData, file: e.target.files![0] })}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Upload'}
      </button>
    </motion.form>
  );
}

