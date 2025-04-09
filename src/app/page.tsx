"use client";

import React, { useState, useEffect } from 'react';
import Tabs from '@/components/Tabs';
import PlayerForm from '@/components/PlayerForm';
import PlayerList from '@/components/PlayerList';
import MatchForm from '@/components/MatchForm';
import MatchList from '@/components/MatchList';
import BadmintonCourt from '@/components/BadmintonCourt';
import AnalysisPanel from '@/components/AnalysisPanel';
import MatchManagement from '@/components/MatchManagement';
import { Match } from '@/types/match';
import { Shot } from '@/types/shot';
import { Player } from '@/types/player';
import { db } from '@/utils/db';
import BackupPanel from '@/components/BackupPanel';

type TabType = 'players' | 'matches' | 'shots' | 'analysis' | 'management' | 'backup';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);

  // IndexedDBからデータを読み込む
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedPlayers, loadedMatches, loadedShots] = await Promise.all([
          db.getPlayers(),
          db.getMatches(),
          db.getShots(),
        ]);
        setPlayers(loadedPlayers);
        setMatches(loadedMatches);
        setShots(loadedShots);
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    };
    loadData();
  }, []);

  // データが変更されたときにIndexedDBに保存
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          db.savePlayers(players),
          db.saveMatches(matches),
          db.saveShots(shots),
        ]);
      } catch (error) {
        console.error('データの保存に失敗しました:', error);
      }
    };
    saveData();
  }, [players, matches, shots]);

  const handlePlayerAdded = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
  };

  const handlePlayerDeleted = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
    // 関連する試合とショットも削除
    const updatedMatches = matches.filter(
      (match) =>
        match.players.player1 !== id &&
        match.players.player2 !== id &&
        match.players.opponent1 !== id &&
        match.players.opponent2 !== id
    );
    setMatches(updatedMatches);
    setShots(shots.filter((shot) => 
      shot.hitPlayer !== id && shot.receivePlayer !== id
    ));
  };

  const handleMatchAdded = (match: Match) => {
    setMatches((prev) => [...prev, match]);
  };

  const handleMatchDeleted = (id: string) => {
    setMatches((prev) => prev.filter((match) => match.id !== id));
    // 関連するショットも削除
    setShots(shots.filter((shot) => shot.matchId !== id));
  };

  const handleMatchSelected = (match: Match) => {
    setSelectedMatch(match);
    setActiveTab('shots');
  };

  const handleShotAdded = (shotData: Omit<Shot, 'id' | 'timestamp'>) => {
    const newShot: Shot = {
      ...shotData,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setShots([...shots, newShot]);
  };

  const handleLastShotDeleted = () => {
    if (shots.length > 0) {
      const newShots = [...shots];
      newShots.pop(); // 最後の配球を削除
      setShots(newShots);
    }
  };

  const handleEndMatch = () => {
    // 現在のデータを保存
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('shots', JSON.stringify(shots));
    
    // アラートを表示して終了
    alert('データを保存しました。アプリケーションを終了します。');
    window.close();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <div className="space-y-4">
            <PlayerForm onPlayerAdded={handlePlayerAdded} />
            <PlayerList
              players={players}
              shots={shots}
              onPlayerDeleted={handlePlayerDeleted}
            />
          </div>
        );
      case 'matches':
        return (
          <div className="space-y-4">
            <MatchForm players={players} onMatchAdded={handleMatchAdded} />
            <MatchList
              matches={matches}
              players={players}
              onMatchDeleted={handleMatchDeleted}
              onMatchSelected={handleMatchSelected}
            />
          </div>
        );
      case 'shots':
        return selectedMatch ? (
          <div>
            <div className="mb-4 p-4 bg-white rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900">試合情報</h2>
              <p className="text-sm text-gray-500">
                {new Date(selectedMatch.date).toLocaleDateString('ja-JP')} -{' '}
                {selectedMatch.type === 'singles' ? 'シングルス' : 'ダブルス'}
              </p>
            </div>
            <BadmintonCourt
              match={selectedMatch}
              players={players}
              onShotAdded={handleShotAdded}
              onLastShotDeleted={handleLastShotDeleted}
              shots={shots}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            配球を登録する試合を選択してください
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-4">
            <AnalysisPanel
              players={players}
              shots={shots}
            />
          </div>
        );
      case 'management':
        return (
          <MatchManagement
            matches={matches}
            players={players}
            shots={shots}
            onMatchDeleted={handleMatchDeleted}
          />
        );
      case 'backup':
        return (
          <BackupPanel />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">バドミントン分析システム</h1>
            <button
              onClick={handleEndMatch}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              終了
            </button>
          </div>
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-8">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
