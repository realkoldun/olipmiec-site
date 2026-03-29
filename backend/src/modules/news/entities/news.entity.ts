import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum NewsCategory {
  SPORT = 'sport',
  ANNOUNCEMENT = 'announcement',
  EVENT = 'event',
  NEWS = 'news',
}

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

  @Column({ type: 'text', nullable: true })
  summarizedContent?: string;

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

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  category?: NewsCategory;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Index()
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
