import Button from '../components/Button';
import smiskiabout from '../assets/images/smiskiabout.jpg';
import smiskigrid1 from '../assets/images/smiskigrid1.jpg';
import smiskigrid2 from '../assets/images/smiskigrid2.jpg';
import smiskigrid3 from '../assets/images/smiskigrid3.jpg';
import smiskigrid4 from '../assets/images/smiskigrid4.jpg';

const AboutPage = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-3xl border-2 border-transparent">
            <img
              src={smiskiabout}
              alt="Smiski collection"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
              About This Site
            </p>
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
              A home for every Smiski collector
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
              The goal of this website
              to help collectors track their figures, explore every series, and
              never miss a new release from Dreams Inc.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button to="/" variant="primary">Back Home</Button>
              <Button to="/articles">View Articles</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
            Community Stats
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
            Growing alongside our collectors
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">200+</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Smiski Figures
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">30+</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Series Total
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">50+</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Secret Smiskis
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">1</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Discontinued
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
              What We Offer
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
              Everything a collector needs
            </h2>

            <div className="mt-6 space-y-4">
              <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
                <h3 className="text-lg font-semibold text-[#132a13]">Complete Series Details</h3>
                <p className="mt-3 text-sm leading-6 text-[#31572c]">
                  Browse every Smiski series ever released, with detailed info
                  on each figure including rare and limited editions.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
                <h3 className="text-lg font-semibold text-[#132a13]">Personal Collection Tracker</h3>
                <p className="mt-3 text-sm leading-6 text-[#31572c]">
                  Mark which Smiskis you own, which ones are on your wishlist,
                  and track your progress toward completing each set.
                </p>
              </article>

              <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
                <h3 className="text-lg font-semibold text-[#132a13]">New Release Alerts</h3>
                <p className="mt-3 text-sm leading-6 text-[#31572c]">
                  Stay up to date with the latest Smiski drops, collaborations,
                  and limited series announcements from Dreams Inc.
                </p>
              </article>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
              Series Categories
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[1.25rem]">
                <img src={smiskigrid1} alt="Smiski Basic" className="w-full h-70 object-cover" />
              </div>
              <div className="overflow-hidden rounded-[1.25rem]">
                <img src={smiskigrid2} alt="Smiski Bath" className="w-full h-70 object-cover" />
              </div>
              <div className="overflow-hidden rounded-[1.25rem]">
                <img src={smiskigrid3} alt="Smiski Desk" className="w-full h-70 object-cover" />
              </div>
              <div className="overflow-hidden rounded-[1.25rem]">
                <img src={smiskigrid4} alt="Smiski Limited" className="w-full h-70 object-cover" />
              </div>
            </div>
            <Button className="mt-5" variant="primary">
              Browse All
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;