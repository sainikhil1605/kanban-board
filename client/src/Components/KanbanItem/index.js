import { useCallback, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import itemStyles from "./KanbanItem.styles";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
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
import { dropdownOptions, users } from "../../utils/channels";
const CardDialog = ({
  itemId,
  open,
  item,
  currItem,
  setItem,
  setTaskStatus,
  tasks,
  setOpen,
}) => {
  const value = dropdownOptions.find((it) => it.value === currItem.status);
  const handleSubmit = useCallback(() => {
    let task = tasks.find((task) => task._id === item._id);
    const taskIndex = tasks.indexOf(item);
    task = { ...task, ...currItem };
    const newTasks = [...tasks];
    newTasks[taskIndex] = task;
    console.log(newTasks);
    setTaskStatus(newTasks);
    setOpen(false);
  }, [tasks, item, currItem, setTaskStatus, value]);
  const handleDelete = () => {
    const taskIndex = tasks.indexOf(item);
    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);
    setTaskStatus(newTasks);
    setOpen(false);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <div>{item.taskId}</div>
      </DialogTitle>
      <DialogContent dividers>
        <div style={itemStyles.dialogField}>
          <TextField
            fullWidth
            label="Task Title"
            value={currItem.title}
            onChange={(e) => setItem({ ...currItem, title: e.target.value })}
            variant="outlined"
          />
        </div>
        <div style={itemStyles.dialogField}>
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
        <div style={itemStyles.dialogField}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={dropdownOptions}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option.label}
            value={value}
            onChange={(e, newValue) =>
              setItem({ ...currItem, status: newValue.value })
            }
            renderInput={(params) => <TextField {...params} label="Status" />}
          />
        </div>
        <div style={itemStyles.dialogField}>
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
          <Button
            color="error"
            variant="outlined"
            style={itemStyles.dialogueDeleteBtn}
            onClick={() => handleDelete()}
          >
            Delete Task
          </Button>
          <Button onClick={() => handleSubmit()}>Save Changes</Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
const KanbanItem = ({ id, item, setTaskStatus, tasks }) => {
  const [open, setOpen] = useState(false);
  const [currItem, setItem] = useState(item);
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { type: "card", id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(ref);
  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Card
        ref={ref}
        style={{ ...itemStyles.card, opacity }}
        onClick={handleOpen}
      >
        <div style={itemStyles.item}>
          <div
            style={
              item.status === "done"
                ? itemStyles.doneStyles
                : { alignItems: "flex-start", display: "flex", margin: "10px" }
            }
          >
            {item.title}
          </div>

          <div style={itemStyles.assigned}>
            <div style={itemStyles.itemId}>{item?.taskId}</div>
            <div>
              <Avatar
                src={item?.assignedTo?.avatarSrc}
                alt="kanban avatar"
                title={item?.assignedTo?.name}
              />
            </div>
            {/* <span>{item?.assignedTo}</span> */}
          </div>
        </div>
      </Card>
      <CardDialog
        itemId={id}
        open={open}
        item={item}
        currItem={currItem}
        setItem={setItem}
        setTaskStatus={setTaskStatus}
        tasks={tasks}
        setOpen={setOpen}
      />
    </>
  );
};

export default KanbanItem;
