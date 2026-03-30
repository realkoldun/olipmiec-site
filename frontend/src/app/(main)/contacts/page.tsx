import type { Metadata } from 'next';
import { ContactsPage } from './contacts-page';

export const metadata: Metadata = {
  title: 'Контакты | СДЮШОР "Олимпиец"',
  description: 'Контактная информация Витебской областной специализированной детско-юношеской школы олимпийского резерва профсоюзов по зимним видам спорта "Олимпиец"',
};

export default function Page() {
  return <ContactsPage />;
}
