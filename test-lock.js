const { spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const tempProfile = path.join(os.tmpdir(), 'agy-temp-profile');
if (!fs.existsSync(tempProfile)) fs.mkdirSync(tempProfile);

const env = { ...process.env, USERPROFILE: tempProfile, APPDATA: tempProfile, LOCALAPPDATA: tempProfile };

const aiProcess = spawn('agy.exe', ['models'], { env });

aiProcess.stdout.on('data', (data) => console.log("STDOUT:", data.toString()));
aiProcess.stderr.on('data', (data) => console.error("STDERR:", data.toString()));
aiProcess.on('close', (code) => console.log("CLOSE:", code));
