import type { Metadata } from 'next';
import { SectionsPage } from './sections-page';

export const metadata: Metadata = {
  title: 'Услуги | СДЮШОР "Олимпиец"',
  description: 'Спортивные услуги и секции Витебской областной специализированной детско-юношеской школы олимпийского резерва профсоюзов по зимним видам спорта "Олимпиец"',
};

export default function Page() {
  return <SectionsPage />;
}
