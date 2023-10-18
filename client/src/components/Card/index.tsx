import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import itemStyles from "./kanbanCard.styles";
import { Avatar, Card } from "@mui/material";
import Modal from "../Modal";
import { deepOrange } from "@mui/material/colors";
import { initialiseTasks } from "../../utils/reducers/taskReducer";
import { AppDispatch } from "../../utils/store";
import Task from "../../types/taskTypes";
import { useAppSelector } from "../../utils/hooks";

interface KanbanCardProps {
  task: Task;
}
const KanbanCard = ({ task }: KanbanCardProps) => {
  const [open, setOpen] = useState(false);
  const [currItem, setItem] = useState(task);
  const tasks = useAppSelector((state) => state.tasks);
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: { type: "card", id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(ref);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleSubmit = () => {
    return async function editTask(dispatch: AppDispatch) {
      // let currTask: any = tasks?.find((item) => item.id === task.id);
      const taskIndex = tasks?.indexOf(task);
      task = { ...task, ...currItem };
      const newTasks = [...tasks];
      newTasks[taskIndex] = task;
      dispatch(initialiseTasks(newTasks));
      setOpen(false);
    };
  };
  const handleDelete = () => {
    return async function deleteTask(dispatch: AppDispatch) {
      const taskIndex = tasks.indexOf(task);
      console.log(taskIndex);
      const newTasks = [...tasks];
      newTasks.splice(taskIndex, 1);
      dispatch(initialiseTasks(newTasks));
      setOpen(false);
    };
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
              task.status === "done"
                ? itemStyles.doneStyles
                : { alignItems: "flex-start", display: "flex", margin: "10px" }
            }
          >
            {task.title}
          </div>

          <div style={itemStyles.assigned}>
            <div style={itemStyles.itemId}>{task?.taskId}</div>
            <div>
              <Avatar
                src={task?.assignedTo?.avatarSrc || "https://"}
                alt={task?.assignedTo?.name}
                sx={{ bgcolor: deepOrange[400] }}
                title={task?.assignedTo?.name}
              />
            </div>
            {/* <span>{item?.assignedTo}</span> */}
          </div>
        </div>
      </Card>
      <Modal
        open={open}
        item={task}
        currItem={currItem}
        setItem={setItem}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default KanbanCard;
