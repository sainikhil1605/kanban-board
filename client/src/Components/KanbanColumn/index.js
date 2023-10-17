import { useRef } from "react";
import { useDrop } from "react-dnd";
import { initialiseTasks } from "../../utils/reducers/taskReducer";
import axiosInstance from "../../utils/axiosInstance";
import store from "../../utils/store";
const KanbanColumn = ({ status, children }) => {
  const changeTaskStatus = (id, status) => {
    return async function changeLane(dispatch, getState) {
      let tasks = getState().tasks;
      let task = tasks?.find((task) => task.id === id);
      const taskIndex = tasks.indexOf(task);
      const data = await axiosInstance.patch(`/task/${id}`, { status });
      task = { ...task, status };
      const newTasks = [...tasks];
      newTasks[taskIndex] = task;
      dispatch(initialiseTasks(newTasks));
    };
  };
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "card",
    drop(item) {
      store.dispatch(changeTaskStatus(item.id, status));
    },
  });
  drop(ref);
  return <div ref={ref}> {children}</div>;
};

export default KanbanColumn;
