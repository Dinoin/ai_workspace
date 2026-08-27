#!/usr/bin/env node
'use strict';

/**
 * 單一入口：執行 `npx gitnexus analyze --embeddings`，並清除該指令
 * 自動重複寫入橋接檔（如 CLAUDE.md）內的 GitNexus 區塊。
 *
 * 背景：AGENTS.md 是本專案的唯一事實來源（SSOT），CLAUDE.md 僅透過
 * `@AGENTS.md` 匯入其內容。但 gitnexus analyze 會把同一段
 * `<!-- gitnexus:start -->...<!-- gitnexus:end -->` 區塊同時寫入
 * CLAUDE.md 與 AGENTS.md，導致 CLAUDE.md 出現重複內容，違反 SSOT。
 * 此腳本在 analyze 成功後自動移除橋接檔內的重複區塊，僅保留在 AGENTS.md。
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');

// 需要清除重複 GitNexus 區塊的橋接檔（內容已透過匯入語法涵蓋於 AGENTS.md）。
const BRIDGE_FILES = ['CLAUDE.md'];

const GITNEXUS_BLOCK_RE = /\n*<!-- gitnexus:start -->[\s\S]*?<!-- gitnexus:end -->\n*/;

function runAnalyze() {
  console.log('\n> npx gitnexus analyze --embeddings\n');
  const result = spawnSync('npx', ['gitnexus', 'analyze', '--embeddings'], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  return result.status ?? 1;
}

function stripBridgeBlocks() {
  for (const relPath of BRIDGE_FILES) {
    const filePath = path.join(REPO_ROOT, relPath);
    if (!fs.existsSync(filePath)) {
      console.log(`[skip] ${relPath} 不存在`);
      continue;
    }
    const original = fs.readFileSync(filePath, 'utf8');
    if (!GITNEXUS_BLOCK_RE.test(original)) {
      console.log(`[ok] ${relPath} 無重複區塊，略過`);
      continue;
    }
    const cleaned = original
      .replace(GITNEXUS_BLOCK_RE, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+$/, '\n');
    fs.writeFileSync(filePath, cleaned, 'utf8');
    console.log(`[cleaned] 已移除 ${relPath} 內重複的 GitNexus 區塊`);
  }
}

const exitCode = runAnalyze();
if (exitCode !== 0) {
  console.error(`\ngitnexus analyze 失敗（exit code ${exitCode}），略過橋接檔清理。`);
  process.exit(exitCode);
}
stripBridgeBlocks();
console.log('\n完成：索引已更新，橋接檔已同步清理。');
