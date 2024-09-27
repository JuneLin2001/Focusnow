interface SignInstructionsProps {
  showInstructions: boolean;
  last30DaysFocusDuration: number;
  onClose: () => void;
}

const SignInstructions: React.FC<SignInstructionsProps> = ({
  showInstructions,
  last30DaysFocusDuration,
  onClose,
}) => {
  if (!showInstructions) return null;

  return (
    <div className="flex justify-center items-center bg-gray-800 bg-opacity-50 z-40 w-full h-full">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-xl mb-4">操作說明：</h2>
        <p className="mb-2">
          您過去 30 天的專注時間總和是 {last30DaysFocusDuration} 分鐘。
        </p>
        <p className="mb-2">每專注 30 分鐘，場景中就會多出一隻企鵝！</p>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={onClose}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInstructions;
