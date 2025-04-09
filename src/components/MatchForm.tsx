"use client";

import React, { useState } from 'react';
import { Match, MatchType } from '@/types/match';

interface Player {
  id: string;
  name: string;
  affiliation: string;
}

interface MatchFormProps {
  players: Player[];
  onMatchAdded: (match: Match) => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ players, onMatchAdded }) => {
  const [date, setDate] = useState('');
  const [type, setType] = useState<MatchType>('singles');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [opponent1, setOpponent1] = useState('');
  const [opponent2, setOpponent2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && player1 && opponent1 && (type === 'singles' || (type === 'doubles' && player2 && opponent2))) {
      onMatchAdded({
        id: Date.now().toString(),
        date,
        type,
        players: {
          player1,
          player2: type === 'doubles' ? player2 : undefined,
          opponent1,
          opponent2: type === 'doubles' ? opponent2 : undefined,
        },
        createdAt: Date.now(),
      });
      setDate('');
      setType('singles');
      setPlayer1('');
      setPlayer2('');
      setOpponent1('');
      setOpponent2('');
    }
  };

  // 選択可能な相手選手（自チーム選手以外のすべての選手）
  const availableOpponents = players.filter(
    (player) => player.id !== player1 && player.id !== player2
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          試合日
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">試合形式</label>
        <div className="mt-1 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="singles"
              checked={type === 'singles'}
              onChange={(e) => setType(e.target.value as MatchType)}
              className="form-radio"
            />
            <span className="ml-2">シングルス</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="doubles"
              checked={type === 'doubles'}
              onChange={(e) => setType(e.target.value as MatchType)}
              className="form-radio"
            />
            <span className="ml-2">ダブルス</span>
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="player1" className="block text-sm font-medium text-gray-700">
          自チーム選手1
        </label>
        <select
          id="player1"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">選択してください</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.affiliation})
            </option>
          ))}
        </select>
      </div>

      {type === 'doubles' && (
        <div>
          <label htmlFor="player2" className="block text-sm font-medium text-gray-700">
            自チーム選手2
          </label>
          <select
            id="player2"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">選択してください</option>
            {players
              .filter((player) => player.id !== player1)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.affiliation})
                </option>
              ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="opponent1" className="block text-sm font-medium text-gray-700">
          相手選手1
        </label>
        <select
          id="opponent1"
          value={opponent1}
          onChange={(e) => setOpponent1(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">選択してください</option>
          {availableOpponents.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.affiliation})
            </option>
          ))}
        </select>
      </div>

      {type === 'doubles' && (
        <div>
          <label htmlFor="opponent2" className="block text-sm font-medium text-gray-700">
            相手選手2
          </label>
          <select
            id="opponent2"
            value={opponent2}
            onChange={(e) => setOpponent2(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">選択してください</option>
            {availableOpponents
              .filter((player) => player.id !== opponent1)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.affiliation})
                </option>
              ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        登録
      </button>
    </form>
  );
};

export default MatchForm; 