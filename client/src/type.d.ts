declare global {
    namespace NodeJS {
      interface ProcessEnv {
          // [key: string]: string | undefined;
          SECRET_KEY : string;
      }
    }
  }
  
  
  export{}