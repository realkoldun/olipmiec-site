import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { footerSections, contactInfo } from '../navigation';

export interface FooterProps {
  className?: string;
}

/**
 * Footer — подвал сайта с контактами и навигацией
 */
export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Обработчик клика на ссылку
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <footer className={className}>
      <div className="border-t bg-muted/50 mt-auto">
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-[1400px]">
          {/* Основная секция */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Логотип и описание */}
            <div className="flex flex-col gap-4">
              <a href="/" onClick={handleLinkClick} className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
                <span className="text-2xl">🏆</span>
                <span className="flex flex-col">
                  <span className="text-lg font-bold leading-none">Олимпиец</span>
                  <span className="text-xs text-muted-foreground leading-none mt-0.5">СДЮШОР</span>
                </span>
              </a>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Спортивная школа олимпийского резерва.
                Воспитываем чемпионов с {currentYear - 50} года.
              </p>
            </div>

            {/* Навигация */}
            <div className="grid grid-cols-3 gap-6 lg:col-span-2">
              {footerSections.map((section) => (
                <div key={section.title} className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-foreground">{section.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={handleLinkClick}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block hover:translate-x-1 transform"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Контакты */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">Контакты</h3>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <address className="text-sm text-muted-foreground not-italic">
                    {contactInfo.address}
                  </address>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {contactInfo.hours}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Нижняя секция */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              © {currentYear} СДЮШОР «Олимпиец», г. Витебск. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/privacy"
                onClick={handleLinkClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Политика конфиденциальности
              </a>
              <a
                href="/terms"
                onClick={handleLinkClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
