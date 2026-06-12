# Bot-Riggock
a super inteligence helper

# AG linux install
curl -fsSL https://antigravity.google/cli/install.sh | bash

For Bash (~/.bashrc):
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

# AG Windows

Method A: Using PowerShell (Recommended)
```bash
irm https://antigravity.google/cli/install.ps1 | iex
```
Method B: CMD
```cmd
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
```
- Need to edit system variable
verify : agy --version
# first
npm install express ws
