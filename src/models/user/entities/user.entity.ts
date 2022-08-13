import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAccountStatus, UserRole } from '../../../../types';
import { StudentInfoEntity } from '../../student/entities';
import { HrInfoEntity } from '../../hr/entities';
import { USER_INPUT_EMAIL_MAX_LENGTH } from '../../../config/constants';
import { HrInterviewEntity } from '../../hr/entities/hr-interview.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true, length: USER_INPUT_EMAIL_MAX_LENGTH })
  email: string;
  @Column({ length: 64, nullable: true })
  passwordHash: string;
  @Column({ unique: true, nullable: true, default: null })
  refreshTokenHash: string;
  @Column({ length: 7 })
  role: UserRole;
  @Column({ default: UserAccountStatus.PENDING, length: 7 })
  accountStatus: UserAccountStatus;
  @Column({ length: 64, nullable: true })
  verificationToken: string;
  @JoinColumn({ name: 'studentInfoId' })
  @OneToOne(() => StudentInfoEntity, (entity) => entity.user, {
    nullable: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  studentInfo: StudentInfoEntity;

  @JoinColumn({ name: 'hrInfoId' })
  @OneToOne(() => HrInfoEntity, (entity) => entity.hrInfoId, {
    nullable: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  hrInfo: HrInfoEntity;

  @OneToMany(() => HrInterviewEntity, (entity) => entity.student)
  StudentInterviews: HrInterviewEntity[];

  @OneToMany(() => HrInterviewEntity, (entity) => entity.hr)
  HrInterviews: HrInterviewEntity[];
}
