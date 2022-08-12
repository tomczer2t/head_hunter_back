import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities';

@Entity()
export class HrInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @ManyToOne(() => UserEntity, (entity) => entity.StudentInterviews, {
    eager: true,
  })
  student: UserEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.HrInterviews)
  hr: UserEntity;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
