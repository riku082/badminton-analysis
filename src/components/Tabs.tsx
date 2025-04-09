"use client";

import React from 'react';

type TabType = 'players' | 'matches' | 'shots' | 'analysis' | 'management' | 'backup';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'players', label: 'プレイヤー管理' },
    { id: 'matches', label: '試合登録' },
    { id: 'shots', label: '配球登録' },
    { id: 'analysis', label: '分析' },
    { id: 'management', label: '試合管理' },
    { id: 'backup', label: 'バックアップ' },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as TabType)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs; 