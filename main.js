const electron = require('electron');
const url = require('url');
const path = require('path');

const {
    app,
    BrowserWindow,
    Menu
} = electron;

// Create main window
app.on('ready', function(){
    // TODO: Check youtube-dl is installed

    // Create main window
    mainWindow = new BrowserWindow({});
    
    // Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
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
];

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