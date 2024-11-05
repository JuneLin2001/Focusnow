![Logo](https://i.imgur.com/dmvHjJo.png)

<div align="center">

[English](../README.md) · [繁體中文](./README_zh-TW.md)

</div>

# Focusnow

一個包含 3D 場景與企鵝主題互動遊戲的番茄鐘網站。
> [網站連結](https://focus-46561.web.app/)

## 特色
- 可以隨心所欲瀏覽的 3D 場景  
- 免登入即可使用的番茄鐘與Todo-List，登入後可在多裝置同步統計資料
- 番茄鐘支援子母畫面模式，提升使用者體驗  
- 企鵝主題的小遊戲，提升互動性
- 場景支援明亮/暗黑模式切換，兩種模式隨您選擇  
  
> [!NOTE]注意事項
部分瀏覽器不支援子母畫面模式，建議使用 Chrome 已獲得最佳體驗。  
可以在[這裡](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API#browser_compatibility)查看支援子母畫面的瀏覽器。

## 使用技術

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React_three/fiber](https://img.shields.io/badge/react_three/fiber-black?style=for-the-badge&logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

### 技術架構

- 使用 `React` 和 `TypeScript` 確保 prop 類型安全，提高穩定性。
- 使用 `Tailwind CSS` 進行快速 UI 開發。
- 使用 `Shadcn-ui` 來保持設計的一致性。
- 資料庫使用 `Firebase Firestore`，提供穩定的數據儲存與可擴展性。
- 狀態管理透過 `Zustand` 處理，提供高效的狀態管理。
- 3D 模型由 `Blender` 製作，以自訂視覺元素。
- 使用 `Three.js` 和 `React Three Fiber` 製作 WebGL 功能，呈現 3D 圖形。
- 整合 `Picture-in-Picture API` 來支援子母畫面模式，提升使用者體驗。
- 整合 `Firebase Authentication` 串接 Google 第三方登入，即時同步使用者資料。
- 使用 `React Joyride` 來提供使用者操作指引。


## 網站截圖

![Scene](./../screenshots/685wGIF.gif)
![Timer](./../screenshots/Timer.gif)

## 本地運行

```bash
    git clone https://github.com/JuneLin2001/Focusnow.git
    npm install
    npm run dev
```


## 未來計畫
- [x] 訪客登入
- [x] 使用者導覽
- [ ] 網站更新日誌
- [ ] 更豐富的遊戲機制
  
## 聯絡方式

- 作者： [Yen-Chun,Lin](https://github.com/JuneLin2001)
- 📫 歡迎聯絡我： yenchunlin2001@gmail.com  
- 🐞 遇到問題了嗎？請在 [GitHub Issues](https://github.com/JuneLin2001/Focusnow/issues) 回報

