import { Html } from "@react-three/drei";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        <DialogTrigger asChild>
          <Button onClick={onClose} className="hidden">
            Open Instructions
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>詳細資料</DialogTitle>
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
