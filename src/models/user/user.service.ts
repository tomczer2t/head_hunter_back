import { Injectable } from '@nestjs/common';
import { UserRole } from '../../../types';
import { UserEntity } from './entities';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  async addUser(email: string, role: UserRole) {
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

  getVerificationToken() {
    return uuid();
  }
}
