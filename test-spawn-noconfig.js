const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const isolatedDir = path.join(os.tmpdir(), 'agy-isolated');
if (!fs.existsSync(isolatedDir)) fs.mkdirSync(isolatedDir, { recursive: true });

const sourceConfig = path.join(os.homedir(), '.gemini', 'antigravity-ide', 'config.json');
const destConfig = path.join(isolatedDir, 'config.json');

if (fs.existsSync(sourceConfig)) {
    fs.copyFileSync(sourceConfig, destConfig);
    console.log("Copied config.json to isolated dir.");
}

const env = { ...process.env, AGY_APP_DATA_DIR: isolatedDir };
const agyCommand = os.platform() === 'win32' ? 'agy.exe' : 'agy';

const aiProcess = spawn(agyCommand, '-i', { env });

aiProcess.stdout.on('data', d => console.log('OUT:', d.toString()));
aiProcess.stderr.on('data', d => console.log('ERR:', d.toString()));
aiProcess.write = (data) => aiProcess.stdin.write(data);

aiProcess.write('hello\n');
