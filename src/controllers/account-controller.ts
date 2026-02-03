import type { Request, Response } from "express";
import { AccountService } from "../services/account-services";
import { patchDisplayNameBody } from "../validator/account-validator";

const svc = new AccountService();

export class AccountController {
  get = async (req: Request, res: Response) => {
    const out = await svc.getAccount(req.accessToken!);
    res.json(out);
  };

  patchDisplayName = async (req: Request, res: Response) => {
    const parsed = patchDisplayNameBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

    const out = await svc.updateDisplayName(req.accessToken!, parsed.data.displayName);
    res.json(out);
  };
}
