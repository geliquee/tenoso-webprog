import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import smiskihero from '../../assets/images/smiskihero.jpg';
import smiskibasic from '../../assets/images/smiskibasic.jpg';
import smiskibath from '../../assets/images/smiskibath.jpg';
import smiskidesk from '../../assets/images/smiskidesk.jpg';
import { fetchArticles } from '../../services/ArticleService';

// Local image fallbacks for the 3 series articles
const LOCAL_IMAGES = {
    'smiski-basic-series': smiskibasic,
    'smiski-bath-series': smiskibath,
    'smiski-desk-series': smiskidesk,
};

const HomePage = () => {
    const [featuredArticles, setFeaturedArticles] = useState([]);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const { data } = await fetchArticles();
                // Only show active + featured articles
                setFeaturedArticles(
                    data.articles.filter((a) => a.isActive && a.isFeatured)
                );
            } catch (error) {
                console.error('Error fetching featured articles:', error);
            }
        };
        loadFeatured();
    }, []);

    return (
        <div className="flex w-full flex-col gap-6">

            {/* Hero */}
            <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
                            Your Smiski Collection Hub
                        </p>
                        <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
                            Track, Discover, and Collect Every Smiski
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
                            Keep track of your growing Smiski collection, discover new series,
                            and never miss a new glowing little companion from Dreams Inc.
                        </p>
                        <div className="mt-6">
                            <Button to="/about" variant="primary">Learn More</Button>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-3xl border-2 border-pink-200">
                        <img src={smiskihero} alt="Smiski collection" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Collection Stats */}
            <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
                        Collection Stats
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Your collection at a glance</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { value: '12', label: 'Smiskis Owned' },
                        { value: '3', label: 'Series Collected' },
                        { value: '5', label: 'Wishlist Items' },
                        { value: '2', label: 'Secrets Collected' },
                    ].map(({ value, label }) => (
                        <div key={label} className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
                            <p className="text-2xl font-bold text-[#31572c]">{value}</p>
                            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Articles — single unified section, all from MongoDB */}
            {featuredArticles.length > 0 && (
                <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mb-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
                            Featured Articles
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
                            Popular Smiski Facts, Tips, and Guides
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        {featuredArticles.map((article) => {
                            // Use local image as fallback for the 3 series articles
                            const image = article.imageUrl || LOCAL_IMAGES[article.slug] || null;
                            return (
                                <article
                                    key={article._id}
                                    className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4 flex flex-col"
                                >
                                    <div className="overflow-hidden rounded-2xl">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={article.title}
                                                className="w-full h-64 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-zinc-200 rounded-2xl flex items-center justify-center">
                                                <div className="h-12 w-12 border-2 border-zinc-300 bg-zinc-100" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-[#132a13]">
                                        {article.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-6 text-[#31572c] grow">
                                        {article.preview
                                            ? article.preview.substring(0, 120)
                                            : Array.isArray(article.content) && article.content[0]
                                                ? article.content[0].substring(0, 120)
                                                : ''}...
                                    </p>
                                    <Link to={`/articles/${article.slug}`} className="mt-4">
                                        <Button variant="primary">Read More</Button>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

        </div>
    );
};

export default HomePage;