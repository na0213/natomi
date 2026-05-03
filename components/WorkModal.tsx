'use client';
import React from 'react';
import Image from 'next/image';

interface WorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: {
    title: string;
    modalMedia: string;
    aiTool: string;
    description: string;
  } | null;
}

export default function WorkModal({ isOpen, onClose, work }: WorkModalProps) {
  if (!isOpen || !work) return null;
  const isImage = /\.(png|jpe?g|webp|gif|avif)$/i.test(work.modalMedia);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg max-w-xl w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>
        <div className="relative mb-4 h-64 w-full overflow-hidden rounded bg-[#f6fbfb] sm:h-80">
          {isImage ? (
            <Image
              src={work.modalMedia}
              alt={`${work.title} の作品画像`}
              fill
              sizes="(min-width: 640px) 576px, calc(100vw - 32px)"
              className="object-contain"
            />
          ) : (
            <video
              src={work.modalMedia}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <h2 className="text-xl font-bold mb-2 text-[#3be7ed]">{work.title}</h2>
        <p className="text-sm text-gray-600 mb-1">
          使用AI：<span className="font-medium text-gray-800">{work.aiTool}</span>
        </p>
        <p className="text-gray-700 text-sm whitespace-pre-wrap">
          {work.description}
        </p>
      </div>
    </div>
  );
}
