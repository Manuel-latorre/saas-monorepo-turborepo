import { Role } from "./types";

export type Session = {
    user: {
        id: string,
        name: string,
        role: Role
    }

    accessToken: string;
    refreshToken:string;
}

