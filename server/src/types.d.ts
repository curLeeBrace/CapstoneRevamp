import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        [key: string]: string | undefined;
        ACCESS_TOKEN_SECRET : Secret;
        REFRESH_TOKEN_SECRET : Secret;
        VERIFICATION_URL : string;
        EMAIL : string;
        PASS : string;
        SECRET_KEY : string;
        MONGO_URI : string;
        CLIENT_EMAIL:string
        PRIVATE_KEY:string
    }
  }
}


export{}

