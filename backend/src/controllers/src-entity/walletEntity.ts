import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn, 
  OneToMany,
  UpdateDateColumn
} from 'typeorm';
import { User } from './userEntity';
import { Transaction } from './transactionEntity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  balance!: number;

  // Track payouts safely
  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0.00 })
  pendingBalance!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions!: Transaction[];

  @UpdateDateColumn()
  updatedAt!: Date;
}