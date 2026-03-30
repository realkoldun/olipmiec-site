'use client';

import { Phone, MapPin, Clock, User } from 'lucide-react';
import { LEADERSHIP_DATA } from '@/constants';

/**
 * ManagementPage — страница руководства
 */
export function ManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Руководство
        </h1>
        <p className="text-muted-foreground text-lg">
          Учреждение «Витебская областная специализированная детско-юношеская школа олимпийского резерва профсоюзов по зимним видам спорта «Олимпиец»
        </p>
      </div>

      {/* Карточки руководства */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEADERSHIP_DATA.map((person, index) => (
          <div
            key={index}
            className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            {/* Изображение */}
            <div className="aspect-square bg-muted overflow-hidden">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <User className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Контент */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  {person.name}
                </h3>
                <p className="text-muted-foreground">
                  {person.position}
                </p>
              </div>

              <div className="space-y-3">
                {/* Телефон */}
                {person.phone && (
                  <a
                    href={`tel:${person.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {person.phone}
                  </a>
                )}

                {/* Адрес */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{person.address}</span>
                </div>

                {/* Часы приёма */}
                {person.reception && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Личный приём:</span>
                      <br />
                      {person.reception}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Общая информация */}
      <div className="mt-12 p-6 rounded-lg border bg-card">
        <h2 className="text-2xl font-semibold mb-4">
          Контактная информация
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Адрес:</p>
                <p className="text-muted-foreground">
                  г. Витебск, ул. Офицерская, д. 2
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Телефон:</p>
                <a
                  href="tel:80212669396"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  8 (0212) 66 93 96
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Режим работы:</p>
                <p className="text-muted-foreground">
                  Понедельник - Пятница: 9.00 - 18.00
                </p>
                <p className="text-muted-foreground">
                  Обед: 13.00 - 14.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
