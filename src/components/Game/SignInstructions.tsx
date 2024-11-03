import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Html } from "@react-three/drei";
import { Info } from "lucide-react";

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
        <DialogContent>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900">
              <Info className="size-6 text-blue-600 dark:text-blue-200" />
            </div>
            <DialogTitle className="m-0 flex items-center">
              場景資訊
            </DialogTitle>
          </div>
          <DialogDescription variant="sign">
            您過去 30 天累積了 {last30DaysFocusDuration} 分鐘的專注時間。
            <br />
            每當一次專注超過 15 分鐘，場景中就會增加一隻企鵝！
            <br />
            你的場景中已有 {howManyPenguinYouHave} 隻企鵝，
            {howManyPenguinYouHave === 30 ? (
              <>
                達到30隻的上限囉！
                <br />
                Focusnow 非常感謝您的使用！
              </>
            ) : (
              ` 目前上限是30隻！`
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </Html>
  );
};

export default SignInstructions;
