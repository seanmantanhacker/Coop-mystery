const { exec } = require('child_process');

exec('agy.exe -p "hello" --dangerously-skip-permissions', (error, stdout, stderr) => {
    console.log("ERROR:", error);
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);
});
