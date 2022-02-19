import { Prisma, PrismaClient, User, UserStatus } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorMessage } from "../utils/error-message.enum";
import { responseBuilder } from "../utils/response-builder.utils";
import { Roles } from "../models/enums/roles.enum";

const prismaClient = Prisma;
const prisma = new PrismaClient();

export async function addBankAccount(req: Request, res: Response) {
    const { id, password, code } = req.body;

    if (!(id && password && code)) {
        const responsData = { error: true, message: errorMessage.requiredInput, status: 400 }
        return res.status(400).json(responseBuilder(responsData));
    }

    await prisma.bank.upsert({
        where: { userId: Number(req.tokenData?.id) },
        update: {
            password,
            code
        },
        create: {
            userId: Number(req.tokenData?.id),
            identityCard: id,
            password,
            code
        }
    })
        .catch(err => {
            const responsData = { rror: true, message: errorMessage.operationNotPerformed, status: 400 }
            return res.status(400).json(responseBuilder(responsData));
        });;

    return res.status(201).json();
}
