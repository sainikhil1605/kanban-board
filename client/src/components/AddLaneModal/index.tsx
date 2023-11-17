import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { addLanes } from "../../utils/reducers/laneReducer";
import store, { AppDispatch } from "../../utils/store";
import ModalStyles from "../Modal/modal.styles";
interface AddLaneModalProps {
  addLaneOpen: boolean;
  setAddLaneOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddLaneModal = ({ addLaneOpen, setAddLaneOpen }: AddLaneModalProps) => {
  const [currLane, setLane] = useState({
    title: "",
    description: "",
    value: "",
  });
  const [error, setError] = useState(false);
  const handleLaneAdd = () => {
    return async function addNewTask(dispatch: AppDispatch) {
      currLane.value = currLane.title.toLowerCase().replace(/\s/g, "");
      const data = await axiosInstance.post("/lane", currLane);
      setLane({
        title: "",
        description: "",
        value: "",
      });
      dispatch(addLanes(data.data));
      setAddLaneOpen(false);
    };
  };
  const handleAdd = () => {
    if (currLane.title === "") {
      setError(true);
      return;
    }
    setError(false);
    store.dispatch(handleLaneAdd());
  };
  return (
    <Dialog open={addLaneOpen} fullWidth maxWidth="xs">
      <DialogTitle>
        <div>Add New Lane</div>
        <IconButton
          aria-label="close"
          onClick={() => setAddLaneOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div style={ModalStyles.dialogField}>
          <TextField
            fullWidth
            label="Lane Title"
            value={currLane.title}
            onChange={(e) => setLane({ ...currLane, title: e.target.value })}
            variant="outlined"
            error={error}
            helperText={error === true && "Lane Title is required"}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleAdd()}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLaneModal;
