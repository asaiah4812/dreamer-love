"use client"
import Link from 'next/link'
import { Plus, Heart, Home, User, MessageCircle } from 'lucide-react';
import React, { useState } from 'react'
import CreateChatModal from './CreateChatModal';
import { useRouter } from 'next/navigation';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    icon: <Home />,
    href: '/'
  },
  {
    label: "Liked",
    icon: <Heart />,
    href: '/liked'
  },
  {
    label: "Profile",
    icon: <User />,
    href: '/profile'
  }
]

const BottonNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateChat = (data: { girlName: string; yourName: string }) => {
    const chatId = encodeURIComponent(`${data.girlName}-${data.yourName}`.toLowerCase().replace(/\s+/g, '-'));
    const chatUrl = `/chat/${chatId}`;
    navigator.clipboard.writeText(`${window.location.origin}${chatUrl}`);
    setIsModalOpen(false);
    alert('Chat link copied to clipboard!');
  };

  return (
    <>
      <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 9999 }} className='fixed bottom-10 right-10 z-50'>
        <button 
          onClick={() => setIsModalOpen(true)}
          className='p-4 relative rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-pink-500/30 w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-all duration-300'
        >
          <MessageCircle size={24} />
        </button>
        {/* <div className='absolute -top-36 bg-pink-700/50 backdrop-blur-sm rounded-lg p-4 right-0 md:right-5'>
          <div className='flex flex-col items-center space-y-4 justify-center'>
            {menuItems.map((item) => (
              <Link href={item.href} key={item.label}>
                {item.icon}
              </Link>
            ))}
          </div>
        </div> */}
      </div>
      <CreateChatModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateChat={handleCreateChat}
      />
    </>
  );
}

export default BottonNav

