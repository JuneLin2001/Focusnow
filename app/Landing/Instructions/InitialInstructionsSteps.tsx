import { Button } from "@/components/ui/button";
import { AlarmClock, ChartColumn, FishSymbol } from "lucide-react";

const steps = [
  {
    title: "場景介紹",
    description: (
      <>
        歡迎來到Focusnow！
        <br />
        這是一個結合番茄鐘 & 3D 場景 & 企鵝互動遊戲的網站。
      </>
    ),
    targetPosition: [-50, 12, -1500] as [number, number, number],
  },
  {
    title: "互動操作",
    description: (
      <>
        可以自由移動鏡頭來探索場景。
        <br />
        透過滑鼠拖曳或觸控螢幕來控制鏡頭，
        <br />
        透過滑鼠滾輪或兩指縮放來拉近或拉遠。
        <br />
      </>
    ),
    targetPosition: [-100, 60, 10] as [number, number, number],
  },
  {
    title: "互動操作",
    description: (
      <>
        點擊 &nbsp;
        <Button variant="default">
          <AlarmClock /> <div className="ml-2 leading-[24px]">Timer</div>
        </Button>
        &nbsp; 可以進入番茄鐘頁面
        <br />
        在登入後能將資料儲存在資料庫。
      </>
    ),
    targetPosition: [-100, 60, 10] as [number, number, number],
  },
  {
    title: "互動操作",
    description: (
      <>
        點擊 &nbsp;
        <Button variant="default">
          <ChartColumn /> <div className="ml-2 leading-[24px]">Analytics</div>
        </Button>
        &nbsp; 可查看統計資料
        <br />
        可以看到統計圖表與完成的 Todos。
      </>
    ),
    targetPosition: [-100, 60, 10] as [number, number, number],
  },
  {
    title: "互動操作",
    description: (
      <>
        點擊告示牌可以看到最近30天的專注分鐘數
        <br />
        一次專注15分鐘以上，場景中就會多出一隻可互動的企鵝。
      </>
    ),
    targetPosition: [-100, 60, 10] as [number, number, number],
  },
  {
    title: "互動操作",
    description: (
      <>
        完成專注時，每專注1分鐘能獲得1條魚
        <br />
        可以點擊 &nbsp;
        <Button variant="default">
          <FishSymbol /> <div className="ml-2 leading-[24px]">0</div>
        </Button>
        &nbsp; 放下魚來和企鵝互動。
      </>
    ),
    targetPosition: [-100, 60, 10] as [number, number, number],
  },
  {
    title: "互動操作",
    description: (
      <>
        可以在右上角切換場景的明亮 / 暗黑模式
        <br />
        點擊使用者頭貼來設定個人資訊以及登出
        <br />
        點擊左上角 Focusnow 可以回到場景首頁
      </>
    ),
    targetPosition: [-250, 60, 10] as [number, number, number],
  },
  {
    title: "說明結束",
    description: <>現在就使用 Focusnow開始專注吧！</>,
    targetPosition: [-250, 60, 10] as [number, number, number],
  },
];

export default steps;
