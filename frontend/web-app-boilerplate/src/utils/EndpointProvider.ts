import isDevEnv from "./DevDetect";

export const buildUrl = (path: string) => !isDevEnv() ? `http://localhost:5073/api/${path}` : `http://localhost:5073/api/${path}`;