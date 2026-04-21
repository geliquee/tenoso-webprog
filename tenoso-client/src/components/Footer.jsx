const Footer = () => {
  return (
    <footer className="border-t-2 border-[#90a955] bg-[#ecf39e] px-6 py-10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        <div>
          <h2 className="text-2xl font-bold text-[#132a13]">Smiski</h2>
          <p className="mt-2 text-sm text-[#31572c]">
            Your go-to source for everything Smiski — guides, news, and collector tips.
          </p>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-green-500 mb-3">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm text-[#31572c]">
            <li><a href="/" className="hover:text-[#132a13] transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-[#132a13] transition-colors">About</a></li>
            <li><a href="/articles" className="hover:text-[#132a13] transition-colors">Articles</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-green-500 mb-3">
            Categories
          </h3>
          <ul className="space-y-2 text-sm text-[#31572c]">
            <li><a href="/articles" className="hover:text-[#132a13] transition-colors">Guides</a></li>
            <li><a href="/articles" className="hover:text-[#132a13] transition-colors">Series Spotlight</a></li>
            <li><a href="/articles" className="hover:text-[#132a13] transition-colors">Tips</a></li>
            <li><a href="" className="hover:text-[#132a13] transition-colors">News</a></li>
          </ul>
        </div>

      </div>

      <div className="mt-10 border-t border-[#90a955] pt-6 text-center text-xs text-[#31572c]">
        © 2026 Smiski Fan Blog. All rights reserved. Not affiliated with Dreams Inc.
      </div>
    </footer>
  );
};

export default Footer;