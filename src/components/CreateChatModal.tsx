import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (data: { girlName: string; yourName: string }) => void;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onCreateChat }) => {
  const [girlName, setGirlName] = useState('');
  const [yourName, setYourName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (girlName.trim() && yourName.trim()) {
      onCreateChat({ girlName: girlName.trim(), yourName: yourName.trim() });
      setGirlName('');
      setYourName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Create Chat Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-2">
              Your name
            </label>
            <input
              type="text"
              id="yourName"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              className="w-full px-4 py-2 border placeholder:text-gray-300 text-gray-300 border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your name..."
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="girlName" className="block text-sm font-medium text-gray-700 mb-2">
              Her name
            </label>
            <input
              type="text"
              id="girlName"
              value={girlName}
              onChange={(e) => setGirlName(e.target.value)}
              className="w-full px-4 py-2 border placeholder:text-gray-300 text-gray-300 border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter her name..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
          >
            Generate Chat Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChatModal; 