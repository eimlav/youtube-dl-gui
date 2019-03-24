# youtube-dl-gui

A simple graphical user interface (GUI) application for downloading videos from online sources.

Built with [Electron](https://electronjs.org/) and [youtube-dl](https://github.com/ytdl-org/youtube-dl).

Only compatible with MacOS (as far as I know).

## Usage

Inside repository directory run `npm run package-mac`. 

A `.app` file will be generated in the `release-builds` directory. 

Upon running for the first time, the following dependencies will be installed on your machine:
- HomeBrew
- youtube-dl
- ffmpeg

The installation currently happens in the background before the window is loaded so there wil be nothing
displayed until it is complete.

The best quality video/audio format will be used.

Enjoy!