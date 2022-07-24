import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccountStatus, UserRole } from '../../../../types';
import { StudentInfoEntity } from '../../student/entities';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, length: 255 })
  email: string;
  @Column({ length: 64 })
  passwordHash: string;
  @Column({ unique: true, nullable: true, default: null })
  refreshTokenHash: string;
  @Column({ length: 7 })
  role: UserRole;
  @Column({ default: UserAccountStatus.PENDING, length: 7 })
  accountStatus: UserAccountStatus;
  @JoinColumn({ name: 'studentInfoId' })
  @OneToOne(() => StudentInfoEntity, (entity) => entity.user, {
    nullable: true,
  })
  studentInfo: StudentInfoEntity;
  //@todo add one to one relation with HrInfo - nullable
}
