import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentInfoEntity } from '../../student/entities';
import { HrInfoEntity } from './hr-info.entity';

@Entity()
export class HrInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  hrInterviewId: string;

  @JoinColumn({ name: 'studentInfoId' })
  @OneToOne(() => StudentInfoEntity, (entity) => entity.studentInfoId, {
    onDelete: 'CASCADE',
  })
  student: StudentInfoEntity;

  @ManyToOne(() => HrInfoEntity, (entity) => entity.hrInfoId, {
    onDelete: 'CASCADE',
  })
  hr: HrInfoEntity;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
