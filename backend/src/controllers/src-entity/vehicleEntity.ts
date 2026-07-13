import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { User } from './userEntity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  ownerId!: string;

  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @Index() // Optimizes dashboard search
  @Column({ type: 'varchar' })
  brand?: string;

  @Column({ type: 'varchar' })
  model?: string;

  @Column({ type: 'int' })
  year?: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', unique: true })
  vin?: string;

  // Postgres numeric prevents rounding errors inherent to float types
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  dailyPrice?: number;

  @Index() // Speeds up filtering for only currently available cars
  @Column({ type: 'boolean', default: true })
  isAvailable!: boolean;

  @Column({ type: 'text', array: true, default: '{}' }) // Native PG array syntax for image URLs
  images?: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn() // Soft delete allows owners to "remove" cars without crashing old booking metrics
  deletedAt?: Date;
}