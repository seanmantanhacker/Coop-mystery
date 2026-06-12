const { spawn } = require('child_process');

const aiProcess = spawn('agy.exe', ['-p', 'hello', '--dangerously-skip-permissions']);

aiProcess.stdout.on('data', (data) => {
    console.log("STDOUT:", data.toString());
});

aiProcess.stderr.on('data', (data) => {
    console.error("STDERR:", data.toString());
});

aiProcess.on('error', (err) => {
    console.error("ERROR:", err);
});

aiProcess.on('close', (code) => {
    console.log("CLOSE:", code);
});
