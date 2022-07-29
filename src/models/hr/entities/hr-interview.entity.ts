import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HrInfoEntity } from './hr-info.entity';
import { UserEntity } from '../../user/entities';

@Entity()
export class HrInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'studentInfoId' })
  @OneToOne(() => UserEntity, (entity) => entity.studentInfo, {
    onDelete: 'CASCADE',
  })
  studentInfoId: UserEntity;

  @ManyToOne(() => HrInfoEntity, (entity) => entity.hrInfoId, {
    onDelete: 'CASCADE',
  })
  hrInfoId: HrInfoEntity | string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
