"use client";

import React, { useState } from 'react';
import { Player } from '@/types/player';
import { Shot } from '@/types/shot';
import { Match } from '@/types/match';

interface AnalysisPanelProps {
  players: Player[];
  matches: Match[];
  shots: Shot[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ players, matches, shots }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // 選手ごとの統計を計算
  const calculatePlayerStats = (playerId: string) => {
    const playerShots = shots.filter(shot => shot.hitPlayer === playerId);
    const rearShots = playerShots.filter(shot => ['LR', 'CR', 'RR'].includes(shot.hitArea));
    const totalRearShots = rearShots.length;

    // クロス率の計算
    const crossShots = rearShots.filter(shot => {
      const hitArea = shot.hitArea;
      const receiveArea = shot.receiveArea;
      return (
        (hitArea === 'LR' && ['RF', 'RM'].includes(receiveArea)) ||
        (hitArea === 'RR' && ['LF', 'LM'].includes(receiveArea))
      );
    });

    // ミス率と得点率の計算
    const winners = rearShots.filter(shot => shot.result === 'winner').length;
    const errors = rearShots.filter(shot => shot.result === 'error').length;

    return {
      totalRearShots,
      crossRate: totalRearShots > 0 ? ((crossShots.length / totalRearShots) * 100).toFixed(1) : '0.0',
      missRate: totalRearShots > 0 ? ((errors / totalRearShots) * 100).toFixed(1) : '0.0',
      pointRate: totalRearShots > 0 ? ((winners / totalRearShots) * 100).toFixed(1) : '0.0',
    };
  };

  // ヒートマップデータの生成
  const generateHeatmapData = (playerId: string) => {
    const playerShots = shots.filter(shot => shot.hitPlayer === playerId);
    const errorShots = playerShots.filter(shot => shot.result === 'error');
    
    const areaErrors: { [key: string]: number } = {};
    const courtAreas = ['LR', 'CR', 'RR', 'LM', 'CM', 'RM', 'LF', 'CF', 'RF'];

    // 各エリアのミス数をカウント
    courtAreas.forEach(area => {
      areaErrors[area] = errorShots.filter(shot => shot.hitArea === area).length;
    });

    // 最大ミス数に基づいて色の強度を計算
    const maxErrors = Math.max(...Object.values(areaErrors));
    return courtAreas.map(area => ({
      area,
      errors: areaErrors[area],
      intensity: maxErrors > 0 ? (areaErrors[area] / maxErrors) * 100 : 0
    }));
  };

  return (
    <div className="space-y-6">
      {/* 選手選択 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">選手選択</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {players.map(player => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className={`p-2 rounded ${
                selectedPlayer?.id === player.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <>
          {/* 後衛からのショット分析 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">後衛からのショット分析</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(calculatePlayerStats(selectedPlayer.id)).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    {key === 'totalRearShots' ? '総ショット数' :
                     key === 'crossRate' ? 'クロス率' :
                     key === 'missRate' ? 'ミス率' : '得点率'}
                  </p>
                  <p className="text-2xl font-bold">
                    {key === 'totalRearShots' ? value :
                     `${value}%`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ヒートマップ */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">ミスヒートマップ</h3>
            <div className="relative w-full">
              <div className="aspect-[2/1] bg-green-500 relative">
                <div className="absolute inset-2 border-2 border-white grid grid-cols-3 grid-rows-3">
                  {generateHeatmapData(selectedPlayer.id).map(({ area, intensity }) => (
                    <div
                      key={area}
                      className="border border-white relative"
                      style={{
                        backgroundColor: `rgba(255, 0, 0, ${intensity / 100})`
                      }}
                    >
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center">
                <span className="text-xs mr-2">少ない</span>
                <div className="h-4 w-32 bg-gradient-to-r from-red-100 to-red-500"></div>
                <span className="text-xs ml-2">多い</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisPanel; 