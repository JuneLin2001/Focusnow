import { Html } from "@react-three/drei";

interface ModelInstructionsProps {
  date: string;
  todoTitles: string[];
  onClose: () => void;
  position: [number, number, number];
}

const ModelInstructions: React.FC<ModelInstructionsProps> = ({
  date,
  todoTitles,
  onClose,
  position,
}) => {
  return (
    <Html position={position}>
      <div className="bg-white p-2 rounded shadow-lg">
        <p className="text-sm">專注日期: {date}</p>
        {todoTitles.length > 0 ? (
          <ul>
            {todoTitles.map((title, index) => (
              <li key={index} className="text-sm">
                - {title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">無待辦事項</p>
        )}
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
