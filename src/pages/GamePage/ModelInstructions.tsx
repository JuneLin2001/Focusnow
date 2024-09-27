import { Html } from "@react-three/drei";

interface ModelInstructionsProps {
  date: string;
  todoTitles: string[];
  onClose: () => void;
  position: [number, number, number];
  focusDuration: number; // 接收專注時間
}

const ModelInstructions: React.FC<ModelInstructionsProps> = ({
  date,
  todoTitles,
  onClose,
  position,
  focusDuration, // 接收專注時間
}) => {
  return (
    <Html position={position}>
      <div className="bg-white p-2 rounded shadow-lg w-96">
        <p className="text-sm">
          {`這隻企鵝是你在 ${date} 專注了 ${focusDuration} 分鐘，而來到這裡的`}
        </p>

        {/* 顯示專注時間 */}
        {todoTitles.length > 0 ? (
          <>
            <br />
            <p className="text-sm">你當時完成了</p>
            <ul>
              {todoTitles.map((title, index) => (
                <li key={index} className="text-sm">
                  - {title}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <button
          onClick={onClose}
          className="mt-2 bg-blue-500 text-white p-1 rounded"
        >
          關閉
        </button>
      </div>
    </Html>
  );
};

export default ModelInstructions;
