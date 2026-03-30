import type { Metadata } from 'next';
import { ManagementPage } from './management-page';

export const metadata: Metadata = {
  title: 'Руководство | СДЮШОР "Олимпиец"',
  description: 'Руководящий состав Витебской областной специализированной детско-юношеской школы олимпийского резерва профсоюзов по зимним видам спорта "Олимпиец"',
};

export default function Page() {
  return <ManagementPage />;
}
