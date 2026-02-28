import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt"
@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }
    hello(): string {
        return "ok"
    }

    async register({ email, password }: RegisterDto) {
        console.log("email=", email)
        console.log("password", password)
        const findUser = await this.prisma.user.findUnique({ where: { email } })
        // console.log("find user=", findUser)
        if (findUser) {
            throw new ConflictException("conflict occur")
        }
        if (!email || !password) {
            throw new BadRequestException(`${(!email && !password) ? 'email & password are' : !email ? 'email is' : 'passwword'} not provemailed`)
        }

        const hashPassword = await bcrypt.hash(password, 10)
        console.log("hashPassword", hashPassword)
        await this.prisma.user.create({ data: { email, password: hashPassword } })
        return { status: 201, message: "User created successfully" }

    }
}