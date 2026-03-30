'use client';

import { Phone, MapPin, Truck, Timer, Clock, Info } from 'lucide-react';
import { CONTACTS, SERVICES_DATA, Service } from '@/constants';

/**
 * SectionsPage — страница услуг
 */
export function SectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      {/* Заголовок */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Наши услуги
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Предоставляем качественные услуги по доступным ценам
        </p>
      </div>

      {/* Секции услуг */}
      <div className="space-y-12">
        {SERVICES_DATA.map((service, index) => (
          <ServiceSection key={index} service={service} />
        ))}
      </div>
    </div>
  );
}

interface ServiceSectionProps {
  service: Service;
}

function ServiceSection({ service }: ServiceSectionProps) {
  const IconComponent = service.icon === 'truck' ? Truck : Timer;

  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      {/* Заголовок услуги */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              {service.title}
            </h2>
            <p className="text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>
      </div>

      {/* Контакты */}
      <div className="bg-muted/50 p-4 border-b">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {CONTACTS.address}
            </span>
          </div>
          <a
            href={`tel:${CONTACTS.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-sm hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {CONTACTS.phone}
            </span>
          </a>
        </div>
      </div>

      {/* Таблица цен */}
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Прейскурант</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">
                  Наименование услуги
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Дополнительная информация
                </th>
                <th className="text-right py-3 px-4 font-semibold">
                  Стоимость
                </th>
              </tr>
            </thead>
            <tbody>
              {service.prices.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {service.icon === 'timer' && (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    {item.description}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {item.price}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
