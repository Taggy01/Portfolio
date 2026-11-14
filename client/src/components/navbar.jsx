
const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50
      w-max max-w-[calc(100%-24px)]">

      <div className="flex items-center gap-5 sm:gap-8
        rounded-full border border-white/10
        bg-[#111111]/80 backdrop-blur-xl
        shadow-xl px-4 sm:px-6 py-3">

        <a
          href="#home"
          className="text-white font-semibold font-bricolage
          text-sm sm:text-base whitespace-nowrap"
        >
          Aditya.
        </a>

        <div className="h-5 w-px bg-white/20" />

        <div className="flex items-center gap-3 sm:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-400 hover:text-white
              text-xs sm:text-sm whitespace-nowrap
              transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

      </div>
    </nav>
  );
}
