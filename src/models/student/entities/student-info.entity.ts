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
  bonusProjectUrlsInJson: string;

  @Column({ nullable: true, width: 9 })
  tel: number;

  @Column({ length: 20 })
  firstName: string;

  @Column({ length: 28 })
  lastName: string;

  @Column({ length: 39 })
  githubUsername: string;

  @Column({ type: 'longtext' })
  portfolioUrlsInJson: string;

  @Column({ type: 'longtext' })
  projectUrlsInJson: string;

  @Column({ type: 'longtext' })
  bio: string;

  @Column()
  expectedTypeWork: string;

  @Column({ length: 22 })
  targetWorkCity: string;

  @Column({ length: 9 })
  expectedContractType: string;

  @Column()
  expectedSalary: number;

  @Column()
  canTakeApprenticeship: boolean;

  @Column()
  monthsOfCommercialExp: number;

  @Column()
  education: string;

  @Column()
  workExperience: string;

  @Column()
  courses: string;
}
