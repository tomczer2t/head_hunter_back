import {
  BaseEntity,
  Column,
  Entity,
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
} from '../../../config/constants';
import { StudentInfoEntity } from '../../student/entities';

@Entity()
export class HrInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  hrInfoId: string;

  @OneToOne(() => UserEntity, (entity) => entity.studentInfo)
  user: UserEntity;

  @OneToMany(() => StudentInfoEntity, (entity) => entity.studentInfoId, {
    nullable: true,
  })
  students: StudentInfoEntity[];

  @Column({ length: USER_INPUT_FIRSTNAME_MAX_LENGTH })
  firstName: string;

  @Column({ length: USER_INPUT_LASTNAME_MAX_LENGTH })
  lastName: string;

  @Column({ length: USER_INPUT_COMPANY_NAME_MAX_LENGTH })
  company: string;

  @Column({
    type: 'int',
    width: USER_INPUT_MAX_RESERVED_STUDENTS_MAX_LENGTH_ENTITY,
  })
  maxReservedStudents: number;
}
