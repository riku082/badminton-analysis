"use client";

import React from 'react';
import { Player } from '@/types/player';
import { Shot } from '@/types/shot';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PlayerListProps {
  players: Player[];
  shots: Shot[];
  onPlayerDeleted: (id: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, shots, onPlayerDeleted }) => {
  // 選手ごとの統計を計算
  const calculatePlayerStats = (player: Player, shots: Shot[]) => {
    const playerShots = shots.filter(shot => shot.hitPlayer === player.id);
    const totalShots = playerShots.length;
    const crossShots = playerShots.filter(shot => shot.isCross).length;
    const missShots = playerShots.filter(shot => shot.result === 'miss').length;
    const pointShots = playerShots.filter(shot => shot.result === 'point').length;
    const totalRearShots = playerShots.filter(shot => shot.area.includes('R')).length;
    const totalMidShots = playerShots.filter(shot => shot.area.includes('M')).length;
    const totalFrontShots = playerShots.filter(shot => shot.area.includes('F')).length;

    return {
      totalShots,
      crossRate: totalShots > 0 ? (crossShots / totalShots) * 100 : 0,
      missRate: totalShots > 0 ? (missShots / totalShots) * 100 : 0,
      pointRate: totalShots > 0 ? (pointShots / totalShots) * 100 : 0,
      rearRate: totalShots > 0 ? (totalRearShots / totalShots) * 100 : 0,
      midRate: totalShots > 0 ? (totalMidShots / totalShots) * 100 : 0,
      frontRate: totalShots > 0 ? (totalFrontShots / totalShots) * 100 : 0,
    };
  };

  const getChartData = (stats: ReturnType<typeof calculatePlayerStats>) => ({
    labels: ['後衛', '中衛', '前衛'],
    datasets: [
      {
        data: [
          stats.rearRate,
          stats.midRate,
          stats.frontRate
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.map(player => {
        const stats = calculatePlayerStats(player, shots);
        return (
          <div key={player.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{player.name}</h3>
              <button
                onClick={() => {
                  if (window.confirm(`${player.name}を削除してもよろしいですか？`)) {
                    onPlayerDeleted(player.id);
                  }
                }}
                className="text-red-500 hover:text-red-700"
              >
                削除
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 円グラフ */}
              <div className="h-40">
                <Doughnut data={getChartData(stats)} options={chartOptions} />
              </div>

              {/* 統計情報 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">クロス率</p>
                  <p className="text-xl font-bold">{stats.crossRate.toFixed(1)}%</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm text-gray-600">ミス率</p>
                  <p className="text-xl font-bold">{stats.missRate.toFixed(1)}%</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">得点率</p>
                  <p className="text-xl font-bold">{stats.pointRate.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">総ショット数</p>
                  <p className="text-xl font-bold">{stats.totalShots}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList; 