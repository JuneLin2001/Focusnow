interface TimerInstructionProps {
  handleCloseInstructions: () => void;
}

const TimerInstruction: React.FC<TimerInstructionProps> = ({
  handleCloseInstructions,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-40">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-xl mb-4">操作說明</h2>
        <p className="mb-4">歡迎使用計時器和Todo List！以下是一些操作說明：</p>
        <ul className="list-disc ml-5 mb-4">
          <li>您可以設定計時器的分鐘數，預設為 25 分鐘。</li>
          <li>點擊顯示的時間可以進入編輯模式，調整計時分鐘數。</li>
          <li>使用「+」和「-」按鈕可快速增加或減少 5 分鐘。</li>
          <li>點擊「開始」以啟動計時器，計時器將開始倒數。</li>
          <li>計時期間，您無法修改分鐘數。</li>
          <li>計時完成時，將會顯示瀏覽器通知</li>
          <li>您可以在完成後重置計時器或繼續添加新任務。</li>
        </ul>
        <p className="mb-4">請記得在計時器運行時，不要忘記完成您的Todos哦！</p>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleCloseInstructions}
          >
            不再顯示
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerInstruction;
