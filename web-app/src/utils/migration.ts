import type { AppState } from '../types';

interface Migration {
  version: number;
  up: (state: any) => any;
}

const migrations: Migration[] = [];

export function runMigrations(persistedState: any, _currentVersion: number): AppState {
  let state = persistedState;
  for (const migration of migrations) {
    if (migration.version > (state.schemaVersion ?? 1)) {
      state = migration.up(state);
      state.schemaVersion = migration.version;
    }
  }
  return state as AppState;
}
