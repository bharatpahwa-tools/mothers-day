import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Sparkles, Music, Share2, Wand2 } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1551642465-6e7e5b2f10fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwyfHxtb3RoZXIlMjBkYXVnaHRlciUyMGxvdmluZyUyMHBvcnRyYWl0fGVufDB8fHx8MTc3ODM5NDQ0MXww&ixlib=rb-4.1.0&q=85";
const FLORAL_IMG =
  "https://images.unsplash.com/photo-1657426103794-a5937b9d916c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZmxvcmFsJTIwYm91cXVldHxlbnwwfHx8fDE3NzgzOTQ0MzJ8MA&ixlib=rb-4.1.0&q=85";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C362B]">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-2"
        >
          <Heart
            className="h-5 w-5"
            color="#E07A5F"
            fill="#E07A5F"
            strokeWidth={1.5}
          />
          <span className="font-cormorant text-xl tracking-tight">
            Letter to Mom
          </span>
        </Link>
        <Link to="/create">
          <Button
            data-testid="nav-create-btn"
            className="rounded-full bg-[#E07A5F] px-6 text-white hover:-translate-y-0.5 hover:bg-[#d06a4f] hover:shadow-lg transition-all"
          >
            Create a Card
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-20 pt-10 md:grid-cols-12 md:px-10 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F4E3D7] bg-white px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-[#2C362B]/70">
            <Sparkles className="h-3 w-3" color="#E07A5F" />
            Mother&apos;s Day, made by you
          </div>
          <h1 className="mt-6 font-cormorant text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            A card for the woman <br />
            who held your <em className="text-[#E07A5F]">whole world</em>.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#2C362B]/75 md:text-lg">
            Upload a memory, write your feelings (or let AI help), pick the
            perfect frame and music — and share a stunning, animated card with
            its very own link. No login. Just love.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/create">
              <Button
                data-testid="hero-create-btn"
                size="lg"
                className="rounded-full bg-[#E07A5F] px-8 py-6 text-base text-white hover:-translate-y-0.5 hover:bg-[#d06a4f] hover:shadow-xl transition-all"
              >
                Start Your Card
                <Wand2 className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-[#2C362B]/60">
              <Heart className="h-4 w-4" color="#E07A5F" fill="#E07A5F" />
              No sign-up. Free. Takes 2 minutes.
            </div>
          </div>

          {/* Feature pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { icon: Wand2, label: "AI message helper" },
              { icon: Heart, label: "Stickers & frames" },
              { icon: Music, label: "Background music" },
              { icon: Share2, label: "Shareable link" },
            ].map((f) => (
              <div
                key={f.label}
                className="inline-flex items-center gap-2 rounded-full bg-[#F4E3D7]/60 px-4 py-2 text-sm text-[#2C362B]"
              >
                <f.icon className="h-4 w-4" color="#E07A5F" />
                {f.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative md:col-span-5"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-2xl">
            <img
              src={HERO_IMG}
              alt="Mother and child"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C362B]/30 via-transparent to-transparent" />
          </div>
          <div className="animate-float absolute -left-6 -top-6 hidden h-28 w-28 overflow-hidden rounded-full ring-8 ring-[#FDFBF7] shadow-xl md:block">
            <img
              src={FLORAL_IMG}
              alt="floral"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-white px-5 py-4 shadow-xl md:block">
            <div className="font-cormorant italic text-[#E07A5F] text-lg">
              &ldquo;You are my home.&rdquo;
            </div>
            <div className="text-xs text-[#2C362B]/60 mt-1">
              — written with love
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <h2 className="font-cormorant text-3xl md:text-4xl">
          Three small steps. One unforgettable moment.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Pick a memory",
              d: "Upload a photo of your mom (or a memory you share). We host it beautifully.",
            },
            {
              n: "02",
              t: "Make it yours",
              d: "Choose a frame, font, color, stickers, and music. Get AI help with the words.",
            },
            {
              n: "03",
              t: "Share the link",
              d: "Send the unique link to your mom. She'll see a private, animated reveal page made for her.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-3xl border border-[#F4E3D7] bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="font-cormorant text-5xl text-[#E07A5F]">
                {s.n}
              </div>
              <div className="mt-4 font-cormorant text-2xl">{s.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-[#2C362B]/70">
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#2C362B] p-10 text-center md:p-16">
          <h3 className="font-cormorant text-3xl text-[#FDFBF7] md:text-5xl">
            She gave you everything. <br />
            Give her a moment back.
          </h3>
          <Link to="/create">
            <Button
              data-testid="cta-create-btn"
              size="lg"
              className="mt-8 rounded-full bg-[#E07A5F] px-10 py-6 text-base text-white hover:-translate-y-0.5 hover:bg-[#d06a4f] hover:shadow-xl transition-all"
            >
              Create a Card Now
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#F4E3D7]/60">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-xs text-[#2C362B]/50 md:px-10">
          Made with love for moms everywhere.
        </div>
      </footer>
    </div>
  );
}
