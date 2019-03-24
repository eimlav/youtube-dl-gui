const electron = require('electron');
const url = require('url');
const path = require('path');
const {
    spawn
} = require('child_process');

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

const commandExecutable = 'youtube-dl',
    commandFormat = '-f \'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best\'',
    commandOutputDirectory = '-o \'~/Downloads',
    commandOutputTitle = '/%(title)s.%(ext)s\''

// Create main window
app.on('ready', function () {
    // TODO: Check youtube-dl is installed

    // Create main window
    mainWindow = new BrowserWindow({});

    // Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'assets/html/mainWindow.html'),
        protocol: 'file:',
        slashes: true,
    }));

    // Quit app when closed
    mainWindow.on('closed', function () {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    // Listen for URL submit event from mainWindow.html
    ipcMain.on('video:add', function (e, videoUrl) {
        // Download video
        downloadVideo(videoUrl);
    })
})

// Create menu template
const mainMenuTemplate = [{
        label: app.getName(),
        submenu: [{
            label: 'Quit',
            accelerator: 'Cmd+Q',
            click() {
                app.quit();
            }
        }]
    },
    {
        label: "Edit",
        submenu: [{
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                selector: "undo:"
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                selector: "redo:"
            },
            {
                type: "separator"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                selector: "cut:"
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                selector: "copy:"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                selector: "paste:"
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                selector: "selectAll:"
            }
        ]
    }
];

// Builds youtube-dl command used for downloading video
function buildDownloadCommand(videoUrl) {
    var command = `${commandExecutable} ${commandFormat} ${commandOutputDirectory}${commandOutputTitle} ${videoUrl}`;
    return command;
}

// Executes the downloading of the video
function downloadVideo(videoUrl) {
    // Check video url is valid
    result = videoUrl.match(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)
    if (result == null) {
        mainWindow.webContents.send('video:done', `Ensure you have entered a valid YouTube url`);
        return;
    }

    // Build command
    command = buildDownloadCommand(videoUrl);

    // Create child process to execute command
    const child = spawn(`${command}`, {
        shell: true,
    });

    // Log errors
    var error = '';
    child.stderr.on('data', (data) => {
        error += (`\n${data}`)
    });

    // Signal mainWindow.html when done
    child.on('close', (code) => {
        // Return error if it occured, else nothing
        if (code !== 0) {
            mainWindow.webContents.send('video:done', `Encountered error:\n${error}`);
        } else {
            mainWindow.webContents.send('video:done', 'Download completed successfully!');
        }
    });
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Cmd+I' : 'Ctrl+I',
                click(item, focusedwindow) {
                    focusedwindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}