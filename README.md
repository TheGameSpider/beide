# beide
Find the number you see twice to win. Simple multiplayer game.

# How to install:
### Windows:
1. Download
2. Extract
3. Run beide_server\INSTALL.cmd
### Linux:
1 Install node
```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. Clone beide repository
```
git clone --single-branch --branch linux_server https://github.com/TheGameSpider/beide.git
```
3. Run install script
```
install.sh
```

# How to play:
### Singleplayer:
1. Run beide_singleplayer\beide_singleplayer.html
2. Press space
3. Find the number you see twice
### Multiplayer:
#### Windows:
1. Open index.js using notepad
2. Edit configuration as you need.
3. Save and close the file.
4. Run beide_server\START.cmd (node index.js)
5. Use your browser to connect to the server using ip you see in the console.
#### Linux:
1. Open index.js using nano
```
nano index.js
```
