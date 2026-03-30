'use client';

import { Phone, Award, Calendar, User } from 'lucide-react';
import { TRAINERS_DATA, Trainer, type SportSection } from '@/constants';

/**
 * TrainersPage — страница тренерского состава
 */
export function TrainersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      {/* Заголовок */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Тренерский состав
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Наши тренеры — профессионалы высочайшего уровня
        </p>
      </div>

      {/* Секции по видам спорта */}
      <div className="space-y-12">
        {TRAINERS_DATA.map((section, index) => (
          <SportSection key={index} section={section} />
        ))}
      </div>
    </div>
  );
}

interface SportSectionProps {
  section: SportSection;
}

function SportSection({ section }: SportSectionProps) {
  return (
    <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
      {/* Заголовок секции */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{section.emoji}</span>
          <h2 className="text-2xl font-bold">
            {section.title}
          </h2>
          <span className="text-sm text-muted-foreground ml-auto">
            {section.trainers.length} тренер{getTrainerCountForm(section.trainers.length)}
          </span>
        </div>
      </div>

      {/* Сетка тренеров */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.trainers.map((trainer, idx) => (
            <TrainerCard key={idx} trainer={trainer} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TrainerCardProps {
  trainer: Trainer;
}

function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Изображение */}
      <div className="aspect-square bg-muted overflow-hidden relative">
        {trainer.image ? (
          <img
            src={trainer.image}
            alt={trainer.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-4 space-y-3">
        {/* Имя и должность */}
        <div>
          <h3 className="text-lg font-semibold mb-1 line-clamp-2">
            {trainer.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {trainer.position}
          </p>
        </div>

        {/* Информация */}
        <div className="space-y-2 pt-2 border-t">
          {/* Телефон */}
          {trainer.phone && (
            <a
              href={`tel:${trainer.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
            >
              <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="group-hover/link:underline">
                {trainer.phone}
              </span>
            </a>
          )}

          {/* Категория */}
          {trainer.category && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 flex-shrink-0 text-primary" />
              <span>{trainer.category}</span>
            </div>
          )}

          {/* Стаж */}
          {trainer.experience && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
              <span>Стаж: {trainer.experience}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Склонение слова "тренер" по числительным
 */
function getTrainerCountForm(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'ов';
  }

  if (lastDigit === 1) {
    return '';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'а';
  }

  return 'ов';
}
