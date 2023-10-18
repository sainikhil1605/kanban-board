import ModalStyles from "./modal.styles";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Autocomplete, Button, TextField } from "@mui/material";
import store, { AppDispatch } from "../../utils/store";
import Task from "../../types/taskTypes";
import { useAppSelector } from "../../utils/hooks";
import ProjectState from "../../types/projectTypes";
type CardModalProps = {
  open: boolean;
  item?: Task;
  currItem: any;
  setItem: any;
  handleDelete?: () => (dispatch: AppDispatch) => Promise<void>;
  handleSubmit?: () => (dispatch: AppDispatch) => Promise<void>;
  isNewTask?: boolean;
};
const CardModal = ({
  open,
  item,
  currItem,
  setItem,
  handleDelete,
  handleSubmit,
  isNewTask,
}: CardModalProps) => {
  const users = useAppSelector((state: ProjectState) => state.users);
  const lanes = useAppSelector((state: ProjectState) => state.lanes);
  const value = lanes?.find((it) => it.value === currItem.status);
  // console.log(currItem);
  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <div>{item?.taskId || "Add New Task"}</div>
      </DialogTitle>
      <DialogContent dividers>
        <div style={ModalStyles.dialogField}>
          <TextField
            fullWidth
            label="Task Title"
            value={currItem.title}
            onChange={(e) => setItem({ ...currItem, title: e.target.value })}
            variant="outlined"
          />
        </div>
        <div style={ModalStyles.dialogField}>
          <TextField
            fullWidth
            label="Description"
            value={currItem.description}
            onChange={(e) =>
              setItem({ ...currItem, description: e.target.value })
            }
            variant="outlined"
          />
        </div>
        <div style={ModalStyles.dialogField}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={lanes}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.title}
            value={value}
            onChange={(e, newValue) =>
              setItem({ ...currItem, status: newValue?.value })
            }
            renderInput={(params) => <TextField {...params} label="Status" />}
          />
        </div>
        <div style={ModalStyles.dialogField}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={users}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.name}
            value={currItem.assignedTo}
            onChange={(e, newValue) => {
              setItem({ ...currItem, assignedTo: newValue });
              console.log(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Assigned" />}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div>
          {!isNewTask && (
            <Button
              color="error"
              variant="outlined"
              style={ModalStyles.dialogueDeleteBtn}
              onClick={() => handleDelete && store.dispatch(handleDelete())}
            >
              Delete Task
            </Button>
          )}

          <Button
            onClick={() => handleSubmit && store.dispatch(handleSubmit())}
          >
            {!isNewTask ? "Save Changes" : "Submit"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
export default CardModal;
