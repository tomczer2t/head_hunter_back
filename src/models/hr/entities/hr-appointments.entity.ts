import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities';
import {
  USER_INPUT_COMPANY_NAME_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MAX_LENGTH,
  USER_INPUT_MAX_RESERVED_STUDENTS_MAX_LENGTH_ENTITY,
} from '../../../config/global';
import { StudentInfoEntity } from '../../student/entities';
import { HrInfoEntity } from './hr-info.entity';

@Entity()
export class HrInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  hrInterviewId: string;

  @JoinColumn({ name: 'studentInfoId' })
  @OneToOne(() => StudentInfoEntity, (entity) => entity.studentInfoId)
  student: StudentInfoEntity;

  @ManyToOne(() => HrInfoEntity, (entity) => entity.hrInfoId)
  hr: HrInfoEntity;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
