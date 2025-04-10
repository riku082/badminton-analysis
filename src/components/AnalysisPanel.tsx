"use client";

import React from 'react';
import { Shot, ShotType } from '@/types/shot';
import { Player } from '@/types/player';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AnalysisPanelProps {
  shots: Shot[];
  players: Player[];
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ shots, players }) => {
  const calculatePlayerStats = (player: Player) => {
    const playerShots = shots.filter(shot => shot.hitPlayer === player.id);
    const totalShots = playerShots.length;
    const crossShots = playerShots.filter(shot => shot.isCross).length;
    const missShots = playerShots.filter(shot => shot.result === 'miss').length;
    const pointShots = playerShots.filter(shot => shot.result === 'point').length;
    const totalRearShots = playerShots.filter(shot => ['LR', 'CR', 'RR'].includes(shot.hitArea)).length;
    const totalMidShots = playerShots.filter(shot => ['LM', 'CM', 'RM'].includes(shot.hitArea)).length;
    const totalFrontShots = playerShots.filter(shot => ['LF', 'CF', 'RF'].includes(shot.hitArea)).length;

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

  const getShotTypeChartData = (player: Player) => {
    const playerShots = shots.filter(shot => shot.hitPlayer === player.id);
    const shotTypeCounts = playerShots.reduce((acc, shot) => {
      acc[shot.shotType] = (acc[shot.shotType] || 0) + 1;
      return acc;
    }, {} as Record<ShotType, number>);

    const totalShots = playerShots.length;
    const shotTypeLabels = {
      'short_serve': 'ショートサーブ',
      'long_serve': 'ロングサーブ',
      'clear': 'クリアー',
      'smash': 'スマッシュ',
      'drop': 'ドロップ',
      'long_return': 'ロングリターン',
      'short_return': 'ショートリターン',
      'drive': 'ドライブ',
      'lob': 'ロブ',
      'push': 'プッシュ',
      'hairpin': 'ヘアピン'
    };

    return {
      labels: Object.entries(shotTypeCounts).map(([type]) => shotTypeLabels[type as ShotType]),
      datasets: [
        {
          data: Object.values(shotTypeCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(40, 102, 255, 0.8)',
            'rgba(255, 102, 102, 0.8)',
            'rgba(102, 255, 102, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(40, 102, 255, 1)',
            'rgba(255, 102, 102, 1)',
            'rgba(102, 255, 102, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

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
        const stats = calculatePlayerStats(player);
        return (
          <div key={player.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">{player.name}</h3>
            
            <div className="space-y-4">
              {/* コート位置の円グラフ */}
              <div>
                <h4 className="text-sm font-medium mb-2">コート位置分布</h4>
                <div className="h-40">
                  <Doughnut data={getChartData(stats)} options={chartOptions} />
                </div>
              </div>

              {/* ショット種類の円グラフ */}
              <div>
                <h4 className="text-sm font-medium mb-2">ショット種類分布</h4>
                <div className="h-40">
                  <Doughnut data={getShotTypeChartData(player)} options={chartOptions} />
                </div>
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

export default AnalysisPanel; 