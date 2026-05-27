import { Link } from 'react-router-dom';
import Button from './Button';

const ArticleList = ({ articles }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {articles.map((article) => (
        <article
          key={article._id ?? article.slug}
          className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4 flex flex-col"
        >
          {/* Image */}
          <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-200 overflow-hidden">
            {article.imageUrl
              ? <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-[1.25rem]"
                />
              : <div className="h-12 w-12 border-2 border-zinc-300 bg-zinc-100" />
            }
          </div>
          
          <h3 className="mt-2 text-lg font-semibold text-[#132a13]">{article.title}</h3>

          {/* Preview text */}
          <p className="mt-3 text-sm leading-6 text-[#31572c] grow">
            {article.preview
              ? article.preview.substring(0, 150)
              : Array.isArray(article.content) && article.content[0]
                ? article.content[0].substring(0, 150)
                : ''}...
          </p>

          <Link to={`/articles/${article.slug ?? article.name}`} className="mt-4">
            <Button variant="primary">Read More</Button>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default ArticleList;