import { useCallback } from "react";
import ModalStyles from "./CardModal.styles";
import { Modal } from "@mui/base";
import { Dialog } from "@mui/material";
import { useRef, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Avatar,
  Button,
  Card,
  Input,
  TextField,
} from "@mui/material";

const CardModal = ({
  open,
  item,
  currItem,
  setItem,
  users,
  handleDelete,
  handleSubmit,
  isNewTask,
  lanes,
}) => {
  const value = lanes?.find((it) => it.value === currItem.status);
  console.log(currItem);
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
              setItem({ ...currItem, status: newValue.value })
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
              onClick={() => handleDelete()}
            >
              Delete Task
            </Button>
          )}
          <Button onClick={() => handleSubmit()}>
            {!isNewTask ? "Save Changes" : "Submit"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
export default CardModal;
