import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SCHEMA_VERSION, migrateState} from '../js/migration.js';

test('kopia testowa v2 migruje się do bieżącego schematu bez utraty wpisów', () => {
  const backup = JSON.parse(readFileSync(new URL('../backup-testowy.json', import.meta.url), 'utf8'));
  const migrated = migrateState(structuredClone(backup));
  assert.equal(migrated.schemaVersion, SCHEMA_VERSION);
  assert.equal(migrated.entries.length, backup.entries.length);
  assert.deepEqual(migrated.entries.map(entry => entry.id), backup.entries.map(entry => entry.id));
});
