const { spawn } = require('child_process');
const os = require('os');
const env = { ...process.env, AGY_APP_DATA_DIR: os.tmpdir() + '/agy-isolated' };
const aiProcess = spawn('agy.exe', ['-i', '--dangerously-skip-permissions'], { env });
aiProcess.stdout.on('data', d => console.log('OUT:', d.toString()));
aiProcess.stderr.on('data', d => console.log('ERR:', d.toString()));
aiProcess.write = (data) => aiProcess.stdin.write(data);
aiProcess.write('hello\n');
