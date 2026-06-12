const pty = require('node-pty');
const os = require('os');
const isolatedEnv = { ...process.env, AGY_APP_DATA_DIR: os.tmpdir() + '/agy-isolated', TERM: 'dumb', NO_COLOR: '1' };
const agyCommand = os.platform() === 'win32' ? 'agy.exe' : 'agy';
const aiProcess = pty.spawn(agyCommand, ['-i', '--dangerously-skip-permissions'], {
    name: 'dumb',
    cols: 80,
    rows: 30,
    cwd: process.cwd(),
    env: isolatedEnv
});

aiProcess.onData((data) => {
    console.log("OUT:", JSON.stringify(data));
});
aiProcess.write('hello\r');
