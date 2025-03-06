declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  }

  interface UserSession {
    user: User;
  }
}

export {};
