import Lane from "./laneTypes";
import Task from "./taskTypes";
import User from "./userTypes";

interface ProjectState {
  tasks: Task[];
  users: User[];
  lanes: Lane[];
}
export default ProjectState;
