import Button from '../components/Button';
import smiskiarticle1 from '../assets/images/smiskiarticle1.jpg';
import smiskiarticle2 from '../assets/images/smiskiarticle2.jpg';
import smiskiarticle3 from '../assets/images/smiskiarticle3.jpg';
import smiskiarticle4 from '../assets/images/smiskiarticle4.jpg';

const ArticlePage = () => {
  return (
    <div className="flex w-full flex-col gap-6">

      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
          Smiski Articles
        </p>
        <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
          Guides, news, and tips for Smiski collectors
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
          Whether you are just starting out or hunting for rare figures, our
          articles have everything you need to level up your collection.
        </p>
        <div className="mt-6">
          <Button to="/" variant="primary">Back Home</Button>
        </div>
      </section>

      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
            Latest Articles
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
            Start exploring
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4 flex flex-col justify-between">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskiarticle1}
                alt="How to Start Your Smiski Collection"
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-500">
              Guide
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#132a13]">
              How to Start Your Smiski Collection
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              New to Smiski? This beginner guide walks you through the best
              series to start with, where to buy, and tips for building your
              collection.
            </p>
            <Button className="mt-4 w-fit" variant="primary">
              Read More
            </Button>
          </article>

          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4 flex flex-col justify-between">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskiarticle2}
                alt="A Complete Look at the Smiski Bath Series"
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-500">
              Series Spotlight
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#132a13]">
              A Complete Look at the Smiski Bath Series
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              One of the most popular series ever released — explore every
              figure in the Bath Series and find out which ones are hardest
              to find.
            </p>
            <Button className="mt-4 w-fit" variant="primary">
              Read More
            </Button>
          </article>

          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4 flex flex-col justify-between">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskiarticle3}
                alt="How to Display Your Smiskis at Home"
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-500">
              Tips
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#132a13]">
              How to Display Your Smiskis at Home
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              From shelves to shadow boxes — creative and practical ways to
              show off your Smiski collection while keeping them safe and
              dust-free.
            </p>
            <Button className="mt-4 w-fit" variant="primary">
              Read More
            </Button>
          </article>

          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4 flex flex-col justify-between">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskiarticle4}
                alt="New Smiski Series: What We Know So Far"
                className="w-full h-48 object-cover"
              />
            </div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-green-500">
              News
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#132a13]">
              New Smiski Series: What We Know So Far
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              Dreams Inc. has been teasing a brand new Smiski series. Here
              is everything collectors need to know about the upcoming
              release.
            </p>
            <Button className="mt-4 w-fit" variant="primary">
              Read More
            </Button>
          </article>

        </div>
      </section>

    </div>
  );
};

export default ArticlePage;