import type { Request, Response } from "express";
import { AuthService } from "../services/auth-services";

const svc = new AuthService();

export class AuthController {
    logout = async (req: Request, res: Response) => {
            await svc.logout(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!,
            req.accessToken!
        );
        res.json({ message: "Logged out (refresh token revoked)" });
    };
}
