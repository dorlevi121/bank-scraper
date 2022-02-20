import { PrismaClient, UserStatus } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorMessage } from "../utils/error-message.enum";
import { responseBuilder } from "../utils/response-builder.utils";
import { Roles } from "../models/enums/roles.enum";

const prisma = new PrismaClient();

export async function registerUser(req: Request, res: Response) {
    const { email, phone, firstName, lastName, password } = req.body;

    if (!(email && password && phone && firstName && lastName)) {
        const responsData = { error: true, message: errorMessage.login, status: 400 }
        return res.status(400).json(responseBuilder(responsData));
    }
    else if (password.length < 7) {
        const responsData = { error: true, message: errorMessage.passwordShort, status: 400 }
        return res.status(400).json(responseBuilder(responsData));
    }

    const userExist = await prisma.user.findUnique({
        where: { phone: phone }
    })
        .catch(err => {
            const responsData = { error: true, message: errorMessage.operationNotPerformed, status: 400 }
            return res.status(400).json(responseBuilder(responsData));
        });;

    if (userExist) {
        const responsData = { error: true, message: errorMessage.userExist, status: 403 }
        return res.status(403).json(responseBuilder(responsData));
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            phone,
            email,
            firstName,
            lastName,
            hashedPassword: encryptedPassword,
            status: UserStatus.PENDING,
        }
    });

    const token: string = jwt.sign(
        { id: user.id, email, phone, userType: Roles.member },
        process?.env?.TOKEN_KEY as string,
        { expiresIn: "7d", }
    );
    return res.status(200).json(responseBuilder({}, {}, { token }));
}

export async function loginUser(req: Request, res: Response) {
    const { phone, password } = req.body;

    if (!(phone && password)) {
        const responsData = {
            error: true,
            message: errorMessage.login,
            status: 400
        }
        return res.status(400).json(responseBuilder(responsData));
    }

    const user: any = await prisma.user.findUnique({
        where: { phone },
        select: {
            id: true,
            phone: true,
            email: true,
            dateCreated: true,
            dateUpdated: true,
            firstName: true,
            lastName: true,
            status: true,
            hashedPassword: true
        }
    })
        .catch(err => {
            const responsData = {
                error: true,
                message: errorMessage.operationNotPerformed,
                status: 400
            }
            return res.status(400).json(responseBuilder(responsData));
        });;

    let token;

    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
        token = jwt.sign(
            { id: user?.id, phone, userType: Roles.member },
            process?.env?.TOKEN_KEY || '',
            { expiresIn: "30d" }
        );
    }
    else {
        const responsData = {
            error: true,
            message: errorMessage.login,
            status: 401
        }
        return res.status(401).json(responseBuilder(responsData));
    }

    const { hashedPassword, ...responsData }: any = user;

    return res.status(200).json(responseBuilder(responsData, {}, { token }));
}