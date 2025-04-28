'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    // Здесь можно добавить логику очистки токенов, если надо
    router.push('/'); // Переход на главную страницу
  };

  return (
    <div className="absolute top-6 right-6">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gray-200 hover:bg-teal-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition-all"
      >
        👤 User
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 bg-white border rounded-lg shadow-lg p-2"
        >
          <button
            onClick={handleSignOut}
            className="text-red-500 hover:text-red-700 px-4 py-2 block w-full text-left"
          >
            Sign Out
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserMenu;
