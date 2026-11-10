#!/usr/bin/env node
// Uses existing GitHub credentials only. No model, deploy, merge, or post calls.
import { createTask, transition } from './graph.mjs';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
export const REPO = '57caine/57hustler';
export const BRANCH = 'ceo-agent-state';
export function checkpointPath(id) {
  if (!/^pr-[1-9][0-9]*$/.test(id)) throw new Error('Task ID must be pr-N');
  return `data/ceo-agent/${id}.json`;
}
export async function checkpoint({ command, id, input, token, fetchImpl = fetch }) {
  if (!token) throw new Error('Existing GitHub credential unavailable; use connected GitHub tools. Do not create credentials.');
  if (!['init', 'advance', 'show'].includes(command)) throw new Error('Unknown command');
  const path = checkpointPath(id);
  const endpoint = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const response = await fetchImpl(`${endpoint}?ref=${BRANCH}`, { headers });
  let current;
  if (response.ok) current = await response.json();
  else if (response.status !== 404) throw new Error(`Checkpoint read failed (${response.status})`);
  // A missing task is not permission to create the state branch or use main.
  if (command === 'show') {
    if (!current) throw new Error('Checkpoint missing');
    return JSON.parse(Buffer.from(current.content, 'base64').toString('utf8'));
  }
  if (command === 'init' && current) throw new Error('Checkpoint already exists');
  if (command === 'advance' && !current) throw new Error('Checkpoint missing');
  const next = command === 'init' ? createTask(input) : transition(JSON.parse(Buffer.from(current.content, 'base64').toString('utf8')), input);
  const body = { message: `chore(ceo-state): ${id} ${next.status} r${next.revision}`, branch: BRANCH, content: Buffer.from(JSON.stringify(next, null, 2) + '\n').toString('base64'), ...(current ? { sha: current.sha } : {}) };
  const write = await fetchImpl(endpoint, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!write.ok) throw new Error(`Checkpoint write rejected (${write.status}); re-read before retry. No automatic retry.`);
  // Re-read the persisted version, never equate a write request with success.
  const confirm = await fetchImpl(`${endpoint}?ref=${BRANCH}`, { headers });
  if (!confirm.ok) throw new Error(`Checkpoint written but readback failed (${confirm.status}); do not repeat event`);
  const saved = JSON.parse(Buffer.from((await confirm.json()).content, 'base64').toString('utf8'));
  if (JSON.stringify(saved) !== JSON.stringify(next)) throw new Error('Checkpoint changed after write; re-read, do not repeat event');
  return saved;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [command, id, inputPath] = process.argv.slice(2);
  try {
    const input = inputPath ? JSON.parse(await readFile(inputPath, 'utf8')) : undefined;
    const result = await checkpoint({ command, id, input, token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
