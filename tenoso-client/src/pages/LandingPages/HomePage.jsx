import Button from '../../components/Button';
import smiskihero from '../../assets/images/smiskihero.jpg';
import smiskibasic from '../../assets/images/smiskibasic.jpg';
import smiskibath from '../../assets/images/smiskibath.jpg';
import smiskidesk from '../../assets/images/smiskidesk.jpg';

const HomePage = () => {
  return (
    <div className="flex w-full flex-col gap-6">

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
              <Button to="/about" variant="primary">
                Learn More
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border-2 border-pink-200">
            <img
              src={smiskihero}
              alt="Smiski collection"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
            Collection Stats
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
            Your collection at a glance
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">12</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Smiskis Owned
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">3</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Series Collected
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">5</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Wishlist Items
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-5">
            <p className="text-2xl font-bold text-[#31572c]">2</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4f772d]">
              Secrets Collected
            </p>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-[#90a955] bg-[#dde5b6] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500">
            Featured Series
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
            Popular Smiski series to collect
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskibasic}
                alt="Smiski Basic Series"
                className="w-full h-75 object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#132a13]">Smiski Basic Series</h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              The original series featuring Smiski in everyday poses — perfect
              for first-time collectors starting their journey.
            </p>
            <Button className="mt-4" variant="primary">View Series</Button>
          </article>

          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskibath}
                alt="Smiski Bath Series"
                className="w-full h-75 object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#132a13]">Smiski Bath Series</h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              Adorable Smiskis caught in bath-time moments — one of the most
              beloved and sought-after series among fans.
            </p>
            <Button className="mt-4" variant="primary">View Series</Button>
          </article>

          <article className="rounded-3xl border-2 border-[#90a955] bg-[#ecf39e] p-4">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={smiskidesk}
                alt="Smiski Desk Series"
                className="w-full h-75 object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[#132a13]">Smiski Desk Series</h3>
            <p className="mt-3 text-sm leading-6 text-[#31572c]">
              Smiskis hiding around your workspace — great companions for your
              desk, shelves, and study corners.
            </p>
            <Button className="mt-4" variant="primary">View Series</Button>
          </article>
        </div>
      </section>

    </div>
  );
};

export default HomePage;