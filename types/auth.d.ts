declare module "#auth-utils" {
  interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    profile_picture?: string;
  }

  interface UserSession {
    user: User;
  }
}

export {};
