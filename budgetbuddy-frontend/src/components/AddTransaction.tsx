'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface Category {
  id: number;
  name: string;
}

interface Transaction {
  amount: number;
  description: string;
  category_id: number;
  date: number;
  type: 'Expense' | 'Income';
}

export default function AddTransaction({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [typeSelected, setTypeSelected] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [currentTab, open]);

  async function fetchCategories() {
    const type = currentTab === 0 ? 'Expense' : 'Income';
    const res = await fetch(`/api/categories?type=${type}`);
    const data = await res.json();
    setCategories(data);
  }

  async function handleSave() {
    const transaction: Transaction = {
      amount: Number(amount),
      description,
      category_id: categoryId,
      date: Date.now() / 1000,
      type: currentTab === 0 ? 'Expense' : 'Income',
    };

    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });

    setAmount('');
    setDescription('');
    setTypeSelected('');
    setCategoryId(1);
    setCurrentTab(0);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl">
          <Dialog.Title className="text-xl font-bold mb-6 text-center">
            Add Transaction
          </Dialog.Title>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setCurrentTab(0)}
              className={`flex-1 p-2 rounded-lg ${currentTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Expense
            </button>
            <button
              onClick={() => setCurrentTab(1)}
              className={`flex-1 p-2 rounded-lg ${currentTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Income
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setTypeSelected(cat.name);
                  setCategoryId(cat.id);
                }}
                className={`w-full text-left p-3 rounded-lg ${typeSelected === cat.name ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Cancel</button>
            </Dialog.Close>
            <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
