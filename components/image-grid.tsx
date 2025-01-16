'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Image as ImageType } from '@/types/image';
import { ClipLoader } from 'react-spinners';
import { Trash2 } from 'lucide-react';

export function ImageGrid({ images }: { images: ImageType[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });
      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square group"
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <button
              onClick={() => handleDelete(image.id)}
              disabled={loading === image.id}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {loading === image.id ? (
                <ClipLoader size={16} color="#ffffff" />
              ) : (
                <Trash2 className="w-4 h-4 text-white" />
              )}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

