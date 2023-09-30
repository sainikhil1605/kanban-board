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
import { dropdownOptions } from "../../utils/channels";
import CardModal from "../CardModal";
import { deepOrange } from "@mui/material/colors";

const KanbanItem = ({ id, item, setTaskStatus, tasks, users }) => {
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
  const handleSubmit = useCallback(() => {
    let task = tasks?.find((task) => task._id === item._id);
    const taskIndex = tasks.indexOf(item);
    task = { ...task, ...currItem };
    const newTasks = [...tasks];
    newTasks[taskIndex] = task;
    console.log(newTasks);
    setTaskStatus(newTasks);
    setOpen(false);
  }, [tasks, item, currItem, setTaskStatus]);
  const handleDelete = () => {
    const taskIndex = tasks.indexOf(item);
    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);
    setTaskStatus(newTasks);
    setOpen(false);
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
                src={item?.assignedTo?.avatarSrc || "https://"}
                alt={item?.assignedTo?.name}
                sx={{ bgcolor: deepOrange[400] }}
                title={item?.assignedTo?.name}
              />
            </div>
            {/* <span>{item?.assignedTo}</span> */}
          </div>
        </div>
      </Card>
      <CardModal
        itemId={id}
        open={open}
        item={item}
        currItem={currItem}
        setItem={setItem}
        setTaskStatus={setTaskStatus}
        tasks={tasks}
        setOpen={setOpen}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        users={users}
      />
    </>
  );
};

export default KanbanItem;
