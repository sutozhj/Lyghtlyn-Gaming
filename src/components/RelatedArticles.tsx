import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Calendar } from 'lucide-react'

interface RelatedArticle {
  title: string
  slug: string
  image: string
  date: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  return (
    <>
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-lg text-white">Related Articles</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-4">
          {articles.map((article) => (
            <Link 
              key={article.slug}
              to={`/article/${article.slug}`}
              className="group block"
            >
              <div className="flex gap-3">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors text-white">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </>
  )
}

export default RelatedArticles

