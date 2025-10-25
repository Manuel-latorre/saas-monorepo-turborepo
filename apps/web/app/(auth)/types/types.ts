export type FormState =
  | {
      error?: {
        name?: string;
        email?: string;
        password?: string[];
      };
      message: string;
    }
  | undefined;

export enum Role {
  ADMIN = "ADMIN",
  PERSONAL_TRAINER = "PERSONAL_TRAINER",
  CLIENT = "CLIENT",
}
