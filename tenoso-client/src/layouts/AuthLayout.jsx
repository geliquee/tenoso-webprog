import { Outlet } from 'react-router-dom';

const AuthLayout = ({ image }) => {
  return (
    <section className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        <div className="flex items-center justify-center border-b-2 border-zinc-300 bg-[#ecf39e] p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-[#90a955] lg:p-16">
          {image && (
            <img src={image} alt="Auth visual" className="w-full max-w-[30rem] object-contain" />
          )}
        </div>

        <main className="flex items-center bg-[#dde5b6] px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;