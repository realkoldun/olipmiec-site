'use client';

import { Phone, Mail, MapPin, Printer, Building, Clock, IdCard } from 'lucide-react';
import { CONTACTS } from '@/constants';

/**
 * ContactsPage — страница контактов
 */
export function ContactsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Контакты
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Контактная информация */}
        <div className="space-y-6">
          {/* Учредитель */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">Учредитель</p>
              <p className="text-muted-foreground">{CONTACTS.founder}</p>
            </div>
          </div>

          {/* Адрес */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">Адрес</p>
              <p className="text-muted-foreground">{CONTACTS.address}</p>
            </div>
          </div>

          {/* Телефон */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">Телефон</p>
              <a
                href={`tel:${CONTACTS.phone.replace(/\s/g, '')}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTACTS.phone}
              </a>
            </div>
          </div>

          {/* Факс */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Printer className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">Факс</p>
              <p className="text-muted-foreground">{CONTACTS.fax}</p>
            </div>
          </div>

          {/* E-mail */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">E-mail</p>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {CONTACTS.email}
              </a>
            </div>
          </div>

          {/* УНП */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">УНП</p>
              <p className="text-muted-foreground">{CONTACTS.unp}</p>
            </div>
          </div>

          {/* Режим работы */}
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold">Режим работы</p>
              <p className="text-muted-foreground">{CONTACTS.hours}</p>
            </div>
          </div>
        </div>

        {/* Яндекс карта */}
        <div className="rounded-lg border bg-card overflow-hidden h-[400px] lg:h-auto">
          <YandexMap
            lat={CONTACTS.coordinates.lat}
            lon={CONTACTS.coordinates.lon}
            address={CONTACTS.address}
          />
        </div>
      </div>
    </div>
  );
}

interface YandexMapProps {
  lat: number;
  lon: number;
  address: string;
}

function YandexMap({ lat, lon, address }: YandexMapProps) {
  return (
    <iframe
      src={`https://yandex.by/map-widget/v1/?ll=${lon}%2C${lat}&pt=${lon},${lat},pm2rdm&z=16`}
      width="100%"
      height="100%"
      frameBorder="0"
      allowFullScreen
      title="Яндекс Карта"
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
