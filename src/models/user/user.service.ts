import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterResponse, UserRole } from '../../../types';
import { UserEntity } from './entities';
import { v4 as uuid } from 'uuid';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  async addUser(email: string, role: UserRole): Promise<UserEntity> {
    const emailExists = !!(await UserEntity.findOneBy({
      email,
    }));
    if (emailExists) {
      throw new Error('Email already exists in database');
    }
    const user = new UserEntity();
    user.verificationToken = this.getVerificationToken();
    user.email = email;
    user.role = role;
    await user.save();
    return user;
  }

  async findAndDelete(email: string): Promise<boolean> {
    const user = await UserEntity.findOne({
      where: { email },
      relations: ['studentInfo', 'hrInfo'],
    });
    if (!user) {
      return false;
    }
    if (user.studentInfo) {
      await user.studentInfo.remove();
      return true;
    }
    if (user.hrInfo) {
      await user.hrInfo.remove();
      return true;
    }
    await user.remove();
    return true;
  }

  async getUserByEmailWithRelations(email: string): Promise<UserEntity | null> {
    return await UserEntity.findOne({
      where: { email },
      relations: ['studentInfo', 'hrInfo'],
    });
  }

  async register(
    registrationDto: UserRegistrationDto,
  ): Promise<RegisterResponse> {
    const user = await UserEntity.findOneBy({ id: registrationDto.id });
    if (!user) {
      throw new NotFoundException(
        'user with that id does not exist in database',
      );
    }
    user.passwordHash = await this.hashData(registrationDto.password);
    await user.save();
    return { isOk: true };
  }

  getVerificationToken(): string {
    return uuid();
  }

  async hashData(data: string): Promise<string> {
    return await hash(data, await genSalt(10));
  }
}
