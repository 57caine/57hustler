#!/usr/bin/env node
// Local single-task checkpoint. Commit state to an authorized branch/PR for durability.
import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createTask, transition } from './graph.mjs';
const [command, file, input] = process.argv.slice(2);
if (!['init', 'advance', 'show'].includes(command) || !file || (command !== 'show' && !input)) {
  throw new Error('Usage: node scripts/ceo-agent/state.mjs init|advance|show STATE.json [INPUT.json]');
}
const path = resolve(file);
if (command === 'show') {
  console.log(await readFile(path, 'utf8'));
} else {
  const data = JSON.parse(await readFile(input, 'utf8'));
  await mkdir(dirname(path), { recursive: true });
  const lock = path + '.lock';
  // mkdir is exclusive. Never automatically remove a lock owned by another run.
  await mkdir(lock);
  const temp = path + '.tmp';
  try {
    let next;
    if (command === 'init') {
      next = createTask(data);
      await writeFile(path, JSON.stringify(next, null, 2) + '\n', { flag: 'wx' });
    } else {
      next = transition(JSON.parse(await readFile(path, 'utf8')), data);
      await writeFile(temp, JSON.stringify(next, null, 2) + '\n', { flag: 'wx' });
      await rename(temp, path);
    }
    console.log(JSON.stringify({ status: next.status, revision: next.revision }));
  } finally {
    await rm(temp, { force: true });
    await rm(lock, { recursive: true });
  }
}
