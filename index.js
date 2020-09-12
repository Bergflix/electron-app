const {app, BrowserWindow} = require('electron');
const DiscordRPC = require('discord-rpc');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    resizable: true,
    titleBarStyle: 'hidden',
    backgroundColor: "#252525",
    webPreferences: {
      nodeIntegration: true,
    }
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();

  mainWindow.loadURL("https://dev.bergflix.de");
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => mainWindow === null && createWindow());

const clientId = '709114073853329419';
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !mainWindow) return;

  rpc.setActivity({
    details: `Video title`,
    state: 'single (or) party name',
    instance: false
  });
}

rpc.on('ready', () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
