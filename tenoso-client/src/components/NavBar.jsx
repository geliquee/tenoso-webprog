import { NavLink } from 'react-router-dom';
import smiskilogoo from '../assets/images/smiskilogoo.png';

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Articles', to: '/articles' },
];

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition',
    isActive
      ? 'border-transparent bg-[#ffe566] text-[#283618]'
      : 'border-transparent text-zinc-500 hover:border-[#ffb3c6] hover:bg-[#ffe5ec] hover:text-[#4a5759]',
  ].join(' ');

const NavBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-[#90a955] bg-[#ecf39e]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="space-y-0.5">
            <img src={smiskilogoo} alt="Logo" className="h-12 w-auto object-contain" />
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/auth/signin"
            className="ml-2 rounded-full border-2 border-[#90a955] bg-[#f9e07f] px-4 py-2 text-[11px] 
            font-semibold uppercase tracking-[0.24em] text-[#283618] transition hover:bg-[#f4d03f]"
          >
            Sign In
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;