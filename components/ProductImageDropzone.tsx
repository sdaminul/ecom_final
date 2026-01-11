"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  images: File[];
  setImages: (files: File[]) => void;
}

export default function ProductImageDropzone({ images, setImages }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImages([...images, ...acceptedFiles]);

      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews([...previews, ...newPreviews]);
    },
    [images, setImages, previews]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Remove image handler
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border border-dashed border-gray-400 p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-3">
        {previews.map((src, i) => (
          <div key={i} className="relative">
            <img
              src={src}
              alt={`preview-${i}`}
              className="h-24 w-24 object-cover border rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
