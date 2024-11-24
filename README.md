
[![Logo](https://i.imgur.com/dmvHjJo.png)](https://focus-46561.web.app/)
<div align="center">

[English](./README.md) · [繁體中文](./docs/README_zh-TW.md)

</div>


# Focusnow

### A website combining Pomodoro timer, 3D scenes, and penguin-themed interactive game.
> ### <a href="https://focus-46561.web.app/">Website Link</a> 

## Features

- Freely navigable 3D scenes
- Pomodoro timer and Todo-List accessible without login; data syncs across devices upon login
- Picture-in-picture mode for the Pomodoro timer, enhancing user experience
- Penguin-themed interactive game where focus earns fish to interact with penguins
- Scene supports light/dark mode switching, allowing users to choose which one they want.

> [!NOTE]
> Some browsers do not support picture-in-picture mode. We recommend using `Chrome` for the best experience.  
> You can check [here](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API#browser_compatibility) for browser compatibility for picture-in-picture mode.


## Built With

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React_three/fiber](https://img.shields.io/badge/react_three/fiber-black?style=for-the-badge&logo=three.js&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34)


### Tech Stack

- Built with `React` and `TypeScript` to ensure prop type safety for improved stability.
- Utilized `Tailwind CSS` for fast UI development.
- Employed `Shadcn-ui` to maintain design consistency.
- Added WebGL features via `Three.js` and `React Three Fiber` to deliver 3D graphics.
- Database powered by `Firebase Firestore` for reliable data storage and accessibility.
- State management is handled with `Zustand`, allowing state to be shared across different components.
- Created 3D models using `Blender`, allowing customizable visual elements.
- Integrated the `Picture-in-Picture API` to support picture-in-picture mode, enhancing the user experience.
- Integrated `Firebase Authentication` for Google third-party login, enabling real-time user data synchronization.
- Used `React Joyride` to provide user onboarding guidance.
- Use `Chart.js` for data visualization.


## Screenshots

### 3D scenes
![Scene](./screenshots/685wGIF.gif)

### Pomodoro Timer and Todo List
![Timer](./screenshots/Timer.gif)

### Picture-in-picture mode
![Picture-in-picture](./screenshots/pipGIF.gif)


## Run Locally

```bash
git clone https://github.com/JuneLin2001/Focusnow.git
cd Focusnow
npm install
npm run dev
```

## Roadmap
- [x] Guest Login.
- [x] User guide.
- [ ] Website changelog.
- [ ] More game mechanics.
  
## Contact

### 💻 Author: [Yen-Chun,Lin](https://github.com/JuneLin2001)
### 📫 Contact email： yenchunlin2001@gmail.com
### 🐞 Found an issue? Report it here on [GitHub Issues](https://github.com/JuneLin2001/Focusnow/issues)

