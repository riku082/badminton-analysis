"use client";

import React from 'react';
import { Match } from '@/types/match';

interface Player {
  id: string;
  name: string;
  affiliation: string;
}

interface MatchListProps {
  matches: Match[];
  players: Player[];
  onMatchDeleted: (id: string) => void;
  onMatchSelected: (match: Match) => void;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  players,
  onMatchDeleted,
  onMatchSelected,
}) => {
  const getPlayerName = (id: string | undefined) => {
    if (!id) return '未設定';
    const player = players.find((p) => p.id === id);
    return player ? `${player.name} (${player.affiliation})` : '不明';
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium text-gray-900">登録済み試合</h2>
      <div className="mt-2 space-y-2">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {new Date(match.date).toLocaleDateString('ja-JP')} -{' '}
                {match.type === 'singles' ? 'シングルス' : 'ダブルス'}
              </p>
              <p className="text-sm text-gray-500">
                自チーム: {getPlayerName(match.players.player1)}
                {match.players.player2 && `, ${getPlayerName(match.players.player2)}`}
              </p>
              <p className="text-sm text-gray-500">
                相手選手: {getPlayerName(match.players.opponent1)}
                {match.players.opponent2 && `, ${getPlayerName(match.players.opponent2)}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onMatchSelected(match)}
                className="text-blue-500 hover:text-blue-700"
              >
                配球登録
              </button>
              <button
                onClick={() => onMatchDeleted(match.id)}
                className="text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchList; 