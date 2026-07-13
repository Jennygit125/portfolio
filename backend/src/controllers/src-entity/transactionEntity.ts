import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Wallet } from './walletEntity';

export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT"
}

// i have no ideas what ts means by no signature

@Entity('transactions')
export class Transaction {
 @PrimaryGeneratedColumn('uuid')
 id!: string;
 //obviously id is necessary start reading from review for best experience about entity's i don't comment same things twice maybe i would add reading order to readme ?

@Column({ type: "uuid"})
  walletId!: string; //all must have walllets to transact if you don't have wallet you shouldn't be here

@ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: 'RESTRICT' })
@JoinColumn({ name: 'walletId' })
  wallet!: Wallet;

@Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

@Column({ type: 'enum', enum: TransactionType })
type!: TransactionType;

@Index({ unique: true }) // Fast external tracking & verification checks
@Column({ type: 'varchar', unique: true })
  reference!: string; 

@CreateDateColumn()
  createdAt!: Date;
}