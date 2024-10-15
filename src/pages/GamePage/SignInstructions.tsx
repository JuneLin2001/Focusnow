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
  howManyPenguinYouHave: number;
}

const SignInstructions: React.FC<SignInstructionsProps> = ({
  showInstructions,
  last30DaysFocusDuration,
  onClose,
  howManyPenguinYouHave,
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
          <DialogTitle>場景資訊</DialogTitle>
          <DialogDescription variant="sign">
            您過去 30 天累積了 {last30DaysFocusDuration} 分鐘的專注時間。
            <br />
            在最近的 30 天中，每當一次專注超過 15 分鐘，場景中就會增加一隻企鵝！
            <br />
            你的場景中已有 {howManyPenguinYouHave} 隻企鵝，
            {howManyPenguinYouHave === 30 ? (
              <>
                達到30隻的上限囉！
                <br />
                您真是一位很會善用時間專注的人，Focusnow 非常感謝您的使用！
              </>
            ) : (
              ` 還有 ${30 - howManyPenguinYouHave} 隻可以獲得！`
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Html>
  );
};

export default SignInstructions;
