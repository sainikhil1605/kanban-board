interface User {
  id: number;
  email: string;
  name: string;
  avatarSrc: string;
  token?: string | null;
}

export default User;
