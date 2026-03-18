import { NewsPageContent } from '@/components/news/news-page-content';
import {Header} from "@/components/layout/header/header";
import {Footer} from "@/components/layout/footer/footer";

/**
 * Страница новостей
 *
 * Роутинг страница для /news
 */
export default function NewsPage() {
  return (
      <div className="flex min-h-screen flex-col">
    <Header />
    <NewsPageContent />
    <Footer />
    </div>
        )
}
