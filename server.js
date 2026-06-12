const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const os = require('os');
const pty = require('node-pty');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let aiProcess = null;

wss.on('connection', (ws) => {
    console.log('User joined the chat.');

    ws.on('message', (message) => {
        const userText = message.toString().trim();
        console.log("Received prompt:", userText);

        // If the agent is running and genuinely asks a follow-up question
        if (aiProcess) {
            aiProcess.write(userText + '\r');
            return;
        }

        try {
            ws.send(JSON.stringify({ sender: 'system', event: 'start', text: 'Initializing Antigravity Agent...' }));

            const agyCommand = os.platform() === 'win32' ? 'agy.exe' : 'agy';

            // Try to find the exact location of agy
            let exactPath = agyCommand;
            if (os.platform() === 'win32') {
                // If you are relying on the installer path:
                const fallbackPath = path.join(os.homedir(), 'AppData', 'Local', 'agy', 'bin', 'agy.exe');
                if (fs.existsSync(fallbackPath)) {
                    exactPath = fallbackPath;
                    console.log("🚀 Verified agy.exe path location:", exactPath);
                } else {
                    console.log("⚠️ Could not find agy.exe at fallback path. Relying on system PATH.");
                }
            }
            // 1. Force the exact path to your Windows user directory credentials
            const userHome = os.homedir(); // Direct path to C:\Users\<YourUsername>
            const exactAgyDataDir = path.join(userHome, 'AppData', 'Local', 'agy');

            const authenticatedEnv = {
                ...process.env,
                AGY_APP_DATA_DIR: exactAgyDataDir // Forces the spawned agent to look precisely here
            };

            // 2. Spawn the process using this authenticated environment
            aiProcess = pty.spawn(agyCommand, ['-p', userText, '--dangerously-skip-permissions'], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.cwd(),
                env: authenticatedEnv // 🔥 Injected here!
            });

            // 🔥 DIAGNOSTIC CHECKPOINT: Print the PID immediately
            if (aiProcess.pid) {
                console.log(`✅ OS Confirmation: Successfully spawned process! PID assigned: ${aiProcess.pid}`);
            } else {
                console.error("❌ OS Failure: Process failed to create a PID.");
            }

            // 🔥 FIX 2: Removed the immediate aiProcess.write(userText) line. 
            // The '-p' flag automatically passes 'userText' as the execution goal.

            aiProcess.onData((data) => {
                // node-pty merges stdout and stderr seamlessly
                const cleanText = data
                console.log("CLI Output:", cleanText);
                ws.send(JSON.stringify({ sender: 'agent', event: 'chunk', text: cleanText }));
            });

            aiProcess.onExit(({ exitCode }) => {
                ws.send(JSON.stringify({ sender: 'system', event: 'close', text: 'Task Completed', code: exitCode }));
                aiProcess = null;
            });

        } catch (fatalErr) {
            console.error('Fatal execution error:', fatalErr);
            ws.send(JSON.stringify({ sender: 'system', event: 'error', text: '❌ Critical failure.' }));
            aiProcess = null;
        }
    });
});

server.listen(3000, '0.0.0.0', () => console.log('Messenger Bridge running on port 3000'));