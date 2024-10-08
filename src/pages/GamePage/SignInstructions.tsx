import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Html } from "@react-three/drei";

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
  return (
    <Html>
      <Dialog open={showInstructions} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button onClick={onClose} className="hidden">
            Open Instructions
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>操作說明</DialogTitle>
          <DialogDescription variant="sign">
            您過去 30 天的專注時間總和是 {last30DaysFocusDuration} 分鐘。
            <br />
            一次專注超過 15 分鐘，場景中就會多出一隻企鵝！
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Html>
  );
};

export default SignInstructions;
