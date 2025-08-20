import { Html } from "@react-three/drei";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
interface ModelInstructionsProps {
  date: string;
  todoTitles: string[];
  onClose: () => void;
  position: [number, number, number];
  focusDuration: number;
  open: boolean;
}

const ModelInstructions: React.FC<ModelInstructionsProps> = ({
  date,
  todoTitles,
  onClose,
  position,
  focusDuration,
  open,
}) => {
  return (
    <Html position={position}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900">
              <Info className="size-6 text-blue-600 dark:text-blue-200" />
            </div>
            <DialogTitle className="m-0 flex items-center">
              詳細資料
            </DialogTitle>
          </div>{" "}
          <DialogDescription variant="sign">
            {`這隻企鵝是你在 ${date} 專注了 ${focusDuration} 分鐘，而來到這裡的`}
            <br />
            {todoTitles.length > 0 ? (
              <>
                <DialogDescription>你當時完成了:</DialogDescription>
                <ul>
                  {todoTitles.map((title, index) => (
                    <li key={index}>
                      <DialogDescription variant="default">
                        - {title}
                      </DialogDescription>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Html>
  );
};

export default ModelInstructions;
