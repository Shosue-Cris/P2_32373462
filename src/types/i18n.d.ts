import 'i18n';
import { Request } from 'express';

declare module 'i18n' {
  import { Request, Response } from 'express';

  interface i18n {
    init: (req: Request, res: Response, next: () => void) => void;
  }
}

declare module 'express' {
  export interface Request {
    __: (phraseOrOptions: string | any, ...replace: any[]) => string;
    __n: (singular: string, plural: string, count: number) => string;
    setLocale: (locale: string) => void;
    getLocale: () => string;
  }

  export interface Response {
    __: (phraseOrOptions: string | any, ...replace: any[]) => string;
    __n: (singular: string, plural: string, count: number) => string;
  }
}
