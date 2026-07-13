import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn,
  OneToMany,
  Index
} from 'typeorm';
import { Vehicle } from './vehicleEntity';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  CAR_OWNER = 'CAR_OWNER',
  ADMIN = 'ADMIN',
  CEO = 'CEO'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: Number;

  @Index({ unique: true }) // Blazing fast login lookups
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'varchar' })
  fullName!: string;

  @Index() // Speeds up CEO/Admin analytics filters by role
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role!: UserRole;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  profileImage?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn() //Logic for soft delete
  deletedAt?: Date;

  // Relations
  @OneToMany(() => Vehicle, (vehicle) => vehicle.owner)
  vehicles?: Vehicle[];
}