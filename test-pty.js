const os = require('os');
const path = require('path');
const pty = require('node-pty');
const fs = require('fs');

// 1. Force the absolute path to your agy.exe binary
const userHome = os.homedir();
const agyCommand = path.join(userHome, 'AppData', 'Local', 'agy', 'bin', 'agy.exe');

// 2. Set an explicit target folder (Your Windows Desktop)
const targetDirectory = path.join(userHome, 'Documents');
const folderToCreate = path.join(targetDirectory, 'Folder_A_Test');

// 3. Pinpoint your Google Session credential directory exactly
const exactAgyDataDir = path.join(userHome, 'AppData', 'Local', 'agy');
const authenticatedEnv = {
    ...process.env,
    AGY_APP_DATA_DIR: exactAgyDataDir
};

console.log(`🤖 Targeting Binary: ${agyCommand}`);
console.log(`📂 Intended Target Destination: ${folderToCreate}`);

// Check if the binary even exists before trying to run it
if (!fs.existsSync(agyCommand)) {
    console.error(`❌ CRITICAL: agy.exe was not found at ${agyCommand}.`);
    process.exit(1);
}

try {
    const promptMessage = `create a directory at the exact path "${folderToCreate}"`;

    // 🔥 FIX: We change 'cwd' to a directory guaranteed to exist ('C:\\Windows\\Temp' or system temp)
    // This stops Windows Error 267 completely.
    const safeCwd = os.tmpdir();

    const aiProcess = pty.spawn(agyCommand, ['--help'], { // Or try '-h' or 'version'
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: safeCwd,
        env: authenticatedEnv
    });

    console.log(`✅ Virtual Terminal Spawned. PID: ${aiProcess.pid}`);

    aiProcess.onData((data) => {
        process.stdout.write(data);
    });

    aiProcess.onExit(({ exitCode }) => {
        console.log(`\n---`);
        console.log(`🏁 Process finished with Exit Code: ${exitCode}`);

        if (fs.existsSync(folderToCreate)) {
            console.log("🎉 SUCCESS! The folder 'Folder_A_Test' is physically sitting on your Desktop right now!");
        } else {
            console.log("❌ The terminal closed, but the folder is missing. Read the tool's logs above.");
        }
    });

} catch (error) {
    console.error("❌ Fatal crash while trying to spawn node-pty:", error.message);
}