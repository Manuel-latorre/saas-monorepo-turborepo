import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'argon2';
import { randomUUID } from 'crypto';


@Injectable()
export class UserService {

  constructor (private readonly prisma:PrismaService){}

  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...user} = createUserDto;

      const hashedPassword = await hash(password);

      const result = await this.prisma.users.create({
        data:{
          id: randomUUID(),
          password: hashedPassword,
          updatedAt: new Date(),
          ...user,
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email:string){
    return await this.prisma.users.findUnique({
      where: {
        email
      }
    })
  }


  async findOne(userId:string){
    return await this.prisma.users.findUnique({
      where: {
        id: userId
      }
    })
  }

  async updateHashedRefreshToken(userId:string, hashedRT:string | null){
    return await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT
      }
    })
  }

  /* findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  } */
}
