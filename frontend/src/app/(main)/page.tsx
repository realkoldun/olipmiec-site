'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Trophy, Users, Target, ChevronRight, Clock } from 'lucide-react';
import { mockEvents } from '@/mocks/events.mock';
import { NewsCard } from '@/components/news/news-card';
import { Button } from '@/components/ui/button/button';
import { cn } from '@/utils/cn';
import { SiteLayout } from '@/components/layout/site-layout';
import { MAIN_NAVIGATION, CONTACTS, SITE_INFO, getSchoolAge, PAGINATION } from '@/constants';
import { useLatestNews } from '@/hooks/use-news';

export default function HomePage() {
  const router = useRouter();

  // Получаем последние новости с бэкенда
  const { data: latestNews, isLoading: newsLoading } = useLatestNews(5);
  
  const upcomingEvents = mockEvents.slice(0, 3);

  const handleNewsClick = (id: string) => {
    router.push(`/news/${id}`);
  };

  const handleEventClick = (id: string) => {
    // Пока заглушка, в будущем будет страница мероприятия
    console.log('Event clicked:', id);
  };

  return (
    <SiteLayout>
      <div className="min-h-screen">
        {/* Hero секция */}
        <HeroSection />

        {/* Преимущества */}
        <FeaturesSection />

        {/* Последние новости */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Последние новости</h2>
                <p className="text-muted-foreground">
                  Будьте в курсе событий школы
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/news')}
                className="hidden md:flex items-center gap-2"
              >
                Все новости
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsLoading ? (
                // Skeletons для новостей
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded animate-pulse w-full" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-3 bg-muted rounded animate-pulse w-16" />
                        <div className="h-3 bg-muted rounded animate-pulse w-16" />
                      </div>
                    </div>
                  </div>
                ))
              ) : latestNews && latestNews.length > 0 ? (
                latestNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    news={news}
                    onClick={handleNewsClick}
                    size="md"
                    showCategory
                    showViews
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Новости временно отсутствуют
                </div>
              )}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button
                variant="outline"
                onClick={() => router.push('/news')}
                className="w-full"
              >
                Все новости
              </Button>
            </div>
          </div>
        </section>

        {/* Ближайшие мероприятия */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Мероприятия</h2>
                <p className="text-muted-foreground">
                  Спортивные события и праздники
                </p>
              </div>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
              >
                Календарь
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Секции */}
        <SectionsSection />

        {/* CTA секция */}
        <CTASection />

        {/* Статистика */}
        <StatsSection />
      </div>
    </SiteLayout>
  );
}

// ============================================================================
// HERO СЕКЦИЯ
// ============================================================================

function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Фоновый паттерн */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 max-w-[1400px] py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              СДЮШОР {SITE_INFO.foundingYear} года
            </span>
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {SITE_INFO.name}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {SITE_INFO.description}
          </p>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              Записаться в секцию
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Узнать больше
            </Button>
          </div>

          {/* Статистика в hero */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t">
            <HeroStat number="50+" label="Лет истории" />
            <HeroStat number="1000+" label="Воспитанников" />
            <HeroStat number="100+" label="Побед" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
        {number}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

// ============================================================================
// СЕКЦИЯ ПРЕИМУЩЕСТВ
// ============================================================================

function FeaturesSection() {
  const features = [
    {
      icon: Trophy,
      title: 'Чемпионы и победители',
      description: 'Наши воспитанники регулярно занимают призовые места на республиканских и международных соревнованиях',
    },
    {
      icon: Users,
      title: 'Опытные тренеры',
      description: 'Преподаватели с высшим образованием и многолетним стажем работы',
    },
    {
      icon: Target,
      title: 'Современная база',
      description: 'Стадион, бассейны, тренажерные залы с новым оборудованием',
    },
    {
      icon: Clock,
      title: 'Удобное расписание',
      description: 'Занятия в утренние и вечерние часы, группы выходного дня',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            СДЮШОР &laquo;Олимпиец&raquo; — это школа, которая готовит чемпионов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// СЕКЦИЯ СЕКЦИЙ
// ============================================================================

function SectionsSection() {
  const sections = [
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

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Наши секции</h2>
            <p className="text-muted-foreground">
              Выберите направление по душе
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2"
            onClick={() => window.location.href = '/sections'}
          >
            Все секции
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => (
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

        <div className="mt-8 text-center md:hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = '/sections'}
          >
            Все секции
          </Button>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA СЕКЦИЯ
// ============================================================================

function CTASection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готовы начать тренироваться?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Запишитесь на пробное занятие прямо сейчас
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Подать заявку
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Контакты
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// СЕКЦИЯ СТАТИСТИКИ
// ============================================================================

function StatsSection() {
  const stats = [
    { number: getSchoolAge(), label: 'Лет успешной работы' },
    { number: '5000+', label: 'Выпускников' },
    { number: '200+', label: 'Спортсменов сейчас' },
    { number: '50+', label: 'Тренеров' },
    { number: '1000+', label: 'Наград и медалей' },
    { number: '10', label: 'Спортивных секций' },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Школа в цифрах</h2>
          <p className="text-muted-foreground">
            Достижения и факты о СДЮШОР &laquo;Олимпиец&raquo;
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// КАРТОЧКА МЕРОПРИЯТИЯ
// ============================================================================

interface EventCardProps {
  event: typeof mockEvents[0];
  onClick?: (id: string) => void;
}

function EventCard({ event, onClick }: EventCardProps) {
  const handleClick = () => {
    onClick?.(event.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <article
      className="group rounded-lg border bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer overflow-hidden"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Открыть мероприятие: ${event.title}`}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={event.image!}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
        {event.registrationOpen && (
          <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white">
            Регистрация открыта
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              {formatDate(event.startDate)}
              {event.endDate && ` — ${formatDate(event.endDate)}`}
              {event.startTime && `, ${event.startTime}`}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{event.location}</span>
          </div>
        </div>

        {event.price && (
          <div className="mt-4 pt-4 border-t">
            <span className={cn(
              'text-sm font-medium',
              event.price === 'Бесплатно' ? 'text-green-600' : 'text-primary'
            )}>
              {event.price}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
