import { Player, Match, Shot } from '@/types';

const DB_NAME = 'badmintonAnalysisDB';
const DB_VERSION = 1;

const STORES = {
  PLAYERS: 'players',
  MATCHES: 'matches',
  SHOTS: 'shots',
} as const;

class Database {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.PLAYERS)) {
          db.createObjectStore(STORES.PLAYERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.MATCHES)) {
          db.createObjectStore(STORES.MATCHES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.SHOTS)) {
          db.createObjectStore(STORES.SHOTS, { keyPath: 'id' });
        }
      };
    });
  }

  async savePlayers(players: Player[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.PLAYERS, 'readwrite');
      const store = transaction.objectStore(STORES.PLAYERS);
      
      const requests = players.map(player => store.put(player));
      Promise.all(requests.map(req => new Promise((res, rej) => {
        req.onsuccess = () => res(undefined);
        req.onerror = () => rej(req.error);
      })))
        .then(() => resolve())
        .catch(reject);
    });
  }

  async saveMatches(matches: Match[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.MATCHES, 'readwrite');
      const store = transaction.objectStore(STORES.MATCHES);
      
      const requests = matches.map(match => store.put(match));
      Promise.all(requests.map(req => new Promise((res, rej) => {
        req.onsuccess = () => res(undefined);
        req.onerror = () => rej(req.error);
      })))
        .then(() => resolve())
        .catch(reject);
    });
  }

  async saveShots(shots: Shot[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.SHOTS, 'readwrite');
      const store = transaction.objectStore(STORES.SHOTS);
      
      const requests = shots.map(shot => store.put(shot));
      Promise.all(requests.map(req => new Promise((res, rej) => {
        req.onsuccess = () => res(undefined);
        req.onerror = () => rej(req.error);
      })))
        .then(() => resolve())
        .catch(reject);
    });
  }

  async getPlayers(): Promise<Player[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.PLAYERS, 'readonly');
      const store = transaction.objectStore(STORES.PLAYERS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getMatches(): Promise<Match[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.MATCHES, 'readonly');
      const store = transaction.objectStore(STORES.MATCHES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getShots(): Promise<Shot[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.SHOTS, 'readonly');
      const store = transaction.objectStore(STORES.SHOTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<string> {
    const [players, matches, shots] = await Promise.all([
      this.getPlayers(),
      this.getMatches(),
      this.getShots(),
    ]);

    return JSON.stringify({ players, matches, shots }, null, 2);
  }

  async importData(data: string): Promise<void> {
    const { players, matches, shots } = JSON.parse(data);
    
    await Promise.all([
      this.savePlayers(players),
      this.saveMatches(matches),
      this.saveShots(shots),
    ]);
  }
}

export const db = new Database(); 