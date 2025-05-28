const { app, BrowserWindow, session } = require('electron');
const path = require('node:path');
const { shell } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    autoHideMenuBar: true,
  });

  // Load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// Inject custom Content Security Policy headers
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const isDev = process.env.NODE_ENV === 'development';

    const csp = [
      "default-src 'self';",
      "style-src 'self' https://unpkg.com 'unsafe-inline';",
      // changed to make the pdf export work
      "connect-src 'self' https://*.supabase.co https://unpkg.com;",
      // "connect-src 'self' https://*.supabase.co;", //default
      "font-src 'self' https://unpkg.com;",
      // "font-src 'self' https://unpkg.com;", // default
      "img-src 'self' data:;",
      "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval';" : ';')
    ].join(' ');


    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': csp
      }
    });
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Open external links in the default browser
// and prevent navigation within the app
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  contents.on('will-navigate', (event, url) => {
    if (url !== contents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
});

