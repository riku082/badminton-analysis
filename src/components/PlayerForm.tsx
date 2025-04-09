"use client";

import React, { useState } from 'react';

interface Player {
  id: string;
  name: string;
  affiliation: string;
}

interface PlayerFormProps {
  onPlayerAdded: (player: Player) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onPlayerAdded }) => {
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && affiliation) {
      onPlayerAdded({
        id: Date.now().toString(),
        name,
        affiliation,
      });
      setName('');
      setAffiliation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          選手名
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
          所属
        </label>
        <input
          type="text"
          id="affiliation"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        登録
      </button>
    </form>
  );
};

export default PlayerForm; 