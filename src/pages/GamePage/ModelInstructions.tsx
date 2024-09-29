import { Html } from "@react-three/drei";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ModelInstructionsProps {
  date: string;
  todoTitles: string[];
  onClose: () => void;
  position: [number, number, number];
  focusDuration: number; // 接收專注時間
  open: boolean; // 新增 open 屬性
}

const ModelInstructions: React.FC<ModelInstructionsProps> = ({
  date,
  todoTitles,
  onClose,
  position,
  focusDuration,
  open, // 新增 open 屬性
}) => {
  return (
    <Html position={position}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>詳細資料</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {`這隻企鵝是你在 ${date} 專注了 ${focusDuration} 分鐘，而來到這裡的`}
          </Typography>

          {todoTitles.length > 0 ? (
            <>
              <br />
              <Typography variant="body1">你當時完成了:</Typography>
              <ul>
                {todoTitles.map((title, index) => (
                  <li key={index}>
                    <Typography variant="body2">- {title}</Typography>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
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

export default ModelInstructions;
