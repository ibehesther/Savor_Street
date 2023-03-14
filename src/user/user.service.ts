import { HttpException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { MySQLStore } from 'express-mysql-session';
import { Request } from 'express';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/dto/create_user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
  // constructor(private readonly UserStore: MySQLStore) {}
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async getUser(id: string): Promise<User|HttpException>{
    let user = await this.userRepository.findOneBy({id});
    return user
  }

  async createUser(data: CreateUserDTO): Promise<User|HttpException>{
    try {
      let user = this.userRepository.create(data);
      await this.userRepository.save(user)

      return user;
    }catch (error) {
      throw new BadRequestException('User cannot be created due to bad request')
    }
  }
}