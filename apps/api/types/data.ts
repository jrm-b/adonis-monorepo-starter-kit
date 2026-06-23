export namespace Identity {
  export interface User {
    id: string;
    fullName: string | null;
    email: string;
    role: number;
    createdAt: string;
    updatedAt: string;
  }
}
