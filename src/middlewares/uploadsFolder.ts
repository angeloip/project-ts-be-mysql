import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { NextFunction, Request, Response } from "express";

export const uploadsFolder = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  const folder = join(__dirname, "..", "uploads");
  if (!existsSync(folder)) {
    mkdirSync(folder);
  }
  next();
};
