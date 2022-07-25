import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities';
import {
  USER_INPUT_BIO_MAX_LENGTH,
  USER_INPUT_CITY_NAME_MAX_LENGTH,
  USER_INPUT_CONTRACT_TYPE_MAX_LENGTH,
  USER_INPUT_EXPECTED_SALARY_MAX_LENGTH_ENTITY,
  USER_INPUT_FIRSTNAME_MAX_LENGTH,
  USER_INPUT_GITHUB_USERNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MAX_LENGTH,
} from '../../../config/global';
import { HrInfoEntity } from '../../hr/entities';

@Entity()
export class StudentInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  studentInfoId: string;

  @OneToOne(() => UserEntity, (entity) => entity.studentInfo)
  user: UserEntity;

  @JoinColumn({ name: 'hrInfoId' })
  @OneToOne(() => HrInfoEntity, (entity) => entity.hrInfoId)
  bookedBy: HrInfoEntity;

  @Column({ type: 'int', width: 1 })
  courseCompletion: number;

  @Column({ type: 'int', width: 1 })
  courseEngagment: number;

  @Column({ type: 'int', width: 1 })
  projectDegree: number;

  @Column({ type: 'int', width: 1 })
  teamProjectDegree: number;

  @Column({ type: 'longtext' })
  bonusProjectUrls: string;

  @Column({ width: 9, nullable: true })
  tel: number;

  @Column({ length: USER_INPUT_FIRSTNAME_MAX_LENGTH, nullable: true })
  firstName: string;

  @Column({ length: USER_INPUT_LASTNAME_MAX_LENGTH, nullable: true })
  lastName: string;

  @Column({ length: USER_INPUT_GITHUB_USERNAME_MAX_LENGTH, nullable: true })
  githubUsername: string;

  @Column({ type: 'longtext', nullable: true })
  portfolioUrls: string;

  @Column({ type: 'longtext', nullable: true })
  projectUrls: string;

  @Column({ length: USER_INPUT_BIO_MAX_LENGTH, nullable: true })
  bio: string;

  @Column({ length: 25, nullable: true })
  expectedTypeWork: string;

  @Column({ length: USER_INPUT_CITY_NAME_MAX_LENGTH, nullable: true })
  targetWorkCity: string;

  @Column({ length: USER_INPUT_CONTRACT_TYPE_MAX_LENGTH, nullable: true })
  expectedContractType: string;

  @Column({
    width: USER_INPUT_EXPECTED_SALARY_MAX_LENGTH_ENTITY,
    nullable: true,
  })
  expectedSalary: number;

  @Column({ nullable: true })
  canTakeApprenticeship: boolean;

  @Column({ width: 3, nullable: true })
  monthsOfCommercialExp: number;

  @Column({ type: 'longtext', nullable: true })
  education: string;

  @Column({ type: 'longtext', nullable: true })
  workExperience: string;

  @Column({ type: 'longtext', nullable: true })
  courses: string;

  @Column({ width: 1, nullable: true })
  studentStatus: number;
}
