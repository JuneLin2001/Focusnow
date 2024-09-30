import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
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
      <Dialog open={showInstructions} onClose={onClose}>
        <DialogTitle>操作說明</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            您過去 30 天的專注時間總和是 {last30DaysFocusDuration} 分鐘。
          </Typography>
          <Typography variant="body1" className="mt-2">
            一次專注超過 15 分鐘，場景中就會多出一隻企鵝！
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </Html>
  );
};

export default SignInstructions;
