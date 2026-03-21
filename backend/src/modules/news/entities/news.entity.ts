import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  telegramId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ default: false })
  hasMedia: boolean;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  postDate: Date;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
