import { Request, Response } from 'express';
import AuthService from '../services/auth.service';

export class AuthController {

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const result = await AuthService.login(email, password);
            res.json(result);
        } 
        catch (err: any) {
            res.status(401).json({ error: err.message });
        }
    };

}
export default new AuthController();