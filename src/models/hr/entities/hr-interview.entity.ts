import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities';

@Entity()
export class HrInterviewEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @OneToOne(() => UserEntity, (entity) => entity.interview, {
    eager: true,
  })
  student: UserEntity;

  @JoinTable()
  @ManyToOne(() => UserEntity, (entity) => entity.interviews)
  hr: UserEntity;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
