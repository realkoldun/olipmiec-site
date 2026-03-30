'use client';

import Image from 'next/image';
import { Users, Clock } from 'lucide-react';

const SECTIONS_DATA = [
  {
    name: 'Футбол',
    image: 'https://placehold.co/400x300/10b981/ffffff?text=Football',
    age: '7-17 лет',
    trainer: 'Сергей Козлов',
    schedule: 'Пн, Ср, Пт 17:00-19:00',
  },
  {
    name: 'Баскетбол',
    image: 'https://placehold.co/400x300/f59e0b/ffffff?text=Basketball',
    age: '8-16 лет',
    trainer: 'Александр Васильев',
    schedule: 'Вт, Чт, Сб 16:00-18:00',
  },
  {
    name: 'Плавание',
    image: 'https://placehold.co/400x300/3b82f6/ffffff?text=Swimming',
    age: '6-14 лет',
    trainer: 'Елена Сидорова',
    schedule: 'Пн-Пт 08:00-20:00',
  },
  {
    name: 'Легкая атлетика',
    image: 'https://placehold.co/400x300/ef4444/ffffff?text=Athletics',
    age: '10-18 лет',
    trainer: 'Иван Петров',
    schedule: 'Вт, Чт, Сб 17:00-19:00',
  },
];

/**
 * SectionsPage — страница услуг (секций)
 */
export function SectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Наши услуги
        </h1>
        <p className="text-muted-foreground text-lg">
          Выберите направление по душе
        </p>
      </div>

      {/* Сетка услуг */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SECTIONS_DATA.map((section, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-200"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={section.image}
                alt={section.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">
                  {section.name}
                </h3>
                <p className="text-sm text-white/80">{section.age}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{section.trainer}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{section.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
