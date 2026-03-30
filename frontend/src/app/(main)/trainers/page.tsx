import type { Metadata } from 'next';
import { TrainersPage } from './trainers-page';

export const metadata: Metadata = {
  title: 'Тренерский состав | СДЮШОР "Олимпиец"',
  description: 'Тренеры-преподаватели Витебской областной специализированной детско-юношеской школы олимпийского резерва профсоюзов по зимним видам спорта "Олимпиец"',
};

export default function Page() {
  return <TrainersPage />;
}
