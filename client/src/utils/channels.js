const channels = ["backlog", "new", "wip", "review", "done"];
const labelsMap = {
  backlog: "Backlog",
  new: "To Do",
  wip: "In Progress",
  review: "Review",
  done: "Done",
};
const dropdownOptions = [
  { value: "backlog", label: "Backlog" },
  { value: "new", label: "To Do" },
  { value: "wip", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];
const users = [
  {
    id: 1,
    name: "Nikhil",
    avatarSrc: "/assets/images/avatar.webp",
  },
  {
    id: 2,
    name: "Kranthi",
    avatarSrc: "/assets/images/avatar1.webp",
  },
];
const tasksList = [
  {
    _id: 1,
    taskId: "ASE-300",
    title: "First Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "backlog",
    assignedTo: users[0],
    avatarSrc: "/assets/images/avatar.webp",
  },
  {
    _id: 2,
    taskId: "ASE-301",
    title: "Second Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "backlog",
    assignedTo: users[1],
    avatarSrc: "/assets/images/avatar1.webp",
  },
  {
    _id: 3,
    taskId: "ASE-302",
    title: "Third Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "backlog",
    assignedTo: users[1],
    avatarSrc: "/assets/images/avatar.webp",
  },
  {
    _id: 4,
    taskId: "ASE-303",
    title: "Fourth Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "new",
    assignedTo: users[0],
    avatarSrc: "/assets/images/avatar1.webp",
  },
  {
    _id: 5,
    taskId: "ASE-304",
    title: "Fifth Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "new",
    assignedTo: users[1],
    avatarSrc: "/assets/images/avatar.webp",
  },
  {
    _id: 6,
    taskId: "ASE-305",
    title: "Sixth Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "wip",
    assignedTo: users[0],
    avatarSrc: "/assets/images/avatar1.webp",
  },
  {
    _id: 7,
    taskId: "ASE-306",
    title: "Seventh Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "review",
    assignedTo: users[1],
    avatarSrc: "/assets/images/avatar.webp",
  },
  {
    _id: 8,
    taskId: "ASE-307",
    title: "Eighth Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "review",
    assignedTo: users[0],
    avatarSrc: "/assets/images/avatar1.webp",
  },
  {
    _id: 9,
    taskId: "ASE-308",
    title: "Ninth Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "done",
    assignedTo: users[1],
    avatarSrc: "/assets/images/avatar.webp",
  },
  {
    _id: 10,
    taskId: "ASE-309",
    title: "Tenth Task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    status: "done",
    assignedTo: users[0],
    avatarSrc: "/assets/images/avatar1.webp",
  },
];
export { channels, labelsMap, dropdownOptions, users, tasksList };
