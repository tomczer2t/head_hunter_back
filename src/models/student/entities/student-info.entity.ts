import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities';

@Entity()
export class StudentInfoEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  studentInfoId: string;

  @OneToOne(() => UserEntity, (entity) => entity.studentInfo)
  user: UserEntity;

  @Column({ type: 'int', width: 1 })
  courseCompletion: number;

  @Column({ type: 'int', width: 1 })
  courseEngagment: number;

  @Column({ type: 'int', width: 1 })
  projectDegree: number;

  @Column({ type: 'int', width: 1 })
  teamProjectDegree: number;

  @Column({ type: 'longtext' })
  bonusProjectUrlsJson: string;

  @Column({ width: 9, nullable: true })
  tel: number;

  @Column({ length: 20, nullable: true })
  firstName: string;

  @Column({ length: 28, nullable: true })
  lastName: string;

  @Column({ length: 39, nullable: true })
  githubUsername: string;

  @Column({ type: 'longtext', nullable: true })
  portfolioUrlsJson: string;

  @Column({ type: 'longtext', nullable: true })
  projectUrlsJson: string;

  @Column({ length: '2500', nullable: true })
  bio: string;

  @Column({ length: 25, nullable: true })
  expectedTypeWork: string;

  @Column({ length: 22, nullable: true })
  targetWorkCity: string;

  @Column({ length: 9, nullable: true })
  expectedContractType: string;

  @Column({ width: 6, nullable: true })
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
