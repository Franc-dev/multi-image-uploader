'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { useDropzone } from 'react-dropzone';

export function UploadArea({ onUpload }: { onUpload: () => void }) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onUpload();
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mb-8"
    >
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        {loading ? (
          <ClipLoader size={30} color="#4F46E5" />
        ) : (
          <p className="text-gray-600">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </p>
        )}
      </div>
    </motion.div>
  );
}

