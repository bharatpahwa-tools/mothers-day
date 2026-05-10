import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Heart, Share2, Music, VolumeX, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import CardCanvas from "@/components/CardCanvas";
import { API, MUSIC_TRACKS } from "@/lib/config";

const PETAL_COLORS = ["#E07A5F", "#F4E3D7", "#FCD5CE", "#E9EDC9"];

function Petals() {
  const petals = Array.from({ length: 18 });
  return (
    <>
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const dur = 12 + Math.random() * 12;
        const delay = Math.random() * 8;
        const size = 10 + Math.random() * 14;
        const color = PETAL_COLORS[i % PETAL_COLORS.length];
        return (
          <div
            key={i}
            className="petal"
            style={{
              left: `${left}vw`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24">
              <path
                d="M12 2 C 14 8, 22 10, 12 22 C 2 10, 10 8, 12 2 Z"
                fill={color}
                opacity="0.85"
              />
            </svg>
          </div>
        );
      })}
    </>
  );
}

export default function SharedCardPage() {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await axios.get(`${API}/cards/${slug}`);
        if (cancelled) return;
        setCard(res.data);
        // confetti burst
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.4 },
            colors: ["#E07A5F", "#F4E3D7", "#E9EDC9", "#FCD5CE"],
          });
        }, 700);
        setTimeout(() => {
          confetti({
            particleCount: 80,
            spread: 70,
            angle: 60,
            origin: { x: 0, y: 0.6 },
            colors: ["#E07A5F", "#F4E3D7"],
          });
          confetti({
            particleCount: 80,
            spread: 70,
            angle: 120,
            origin: { x: 1, y: 0.6 },
            colors: ["#E9EDC9", "#FCD5CE"],
          });
        }, 1400);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      try {
        audioRef.current.volume = 0.4;
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        toast.error("Tap once more to enable audio");
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Happy Mother's Day",
          text: "A card made with love for you",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } catch {
      // user cancelled
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E07A5F]" />
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6 text-center">
        <div>
          <div className="font-cormorant text-5xl text-[#E07A5F]">
            Card not found
          </div>
          <p className="mt-3 text-[#2C362B]/70">
            This link doesn&apos;t exist or has expired.
          </p>
          <Link to="/create">
            <Button
              data-testid="shared-create-btn"
              className="mt-6 rounded-full bg-[#E07A5F] px-6 text-white hover:bg-[#d06a4f]"
            >
              Make your own
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const track = MUSIC_TRACKS.find((t) => t.id === card.music_track);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#F4E3D7]/40 to-[#FDFBF7] text-[#2C362B]">
      <Petals />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link
          to="/"
          data-testid="shared-home-link"
          className="flex items-center gap-2 text-sm text-[#2C362B]/70 hover:text-[#E07A5F]"
        >
          <Heart className="h-4 w-4" color="#E07A5F" fill="#E07A5F" />
          <span className="font-cormorant text-lg">Letter to Mom</span>
        </Link>
        <div className="flex items-center gap-2">
          {track && (
            <Button
              data-testid="music-toggle-btn"
              variant="outline"
              onClick={toggleMusic}
              className="rounded-full border-[#F4E3D7] bg-white/80 backdrop-blur"
            >
              {musicOn ? (
                <Music className="h-4 w-4 text-[#E07A5F]" />
              ) : (
                <VolumeX className="h-4 w-4 text-[#2C362B]/60" />
              )}
              <span className="ml-2 hidden sm:inline">
                {musicOn ? "Pause music" : "Play music"}
              </span>
            </Button>
          )}
          <Button
            data-testid="share-btn"
            onClick={handleShare}
            className="rounded-full bg-[#E07A5F] px-5 text-white hover:-translate-y-0.5 hover:bg-[#d06a4f] hover:shadow-lg transition-all"
          >
            <Share2 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Share</span>
          </Button>
        </div>
      </header>

      {/* Main reveal */}
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pt-6 pb-24 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="font-outfit text-[10px] uppercase tracking-[0.4em] text-[#2C362B]/60">
            A card from {card.sender_name}
          </div>
          <h1 className="mt-3 font-cormorant text-5xl leading-tight md:text-7xl">
            For{" "}
            <em className="text-[#E07A5F]">{card.recipient_name}</em>
            ,
            <br />
            with all my love.
          </h1>
        </motion.div>

        <div className="reveal-card mt-10">
          <CardCanvas card={card} size="lg" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-12 text-center"
        >
          <p className="font-cormorant text-xl italic text-[#2C362B]/70">
            &ldquo;The hand that rocks the cradle is the hand that rules the
            world.&rdquo;
          </p>
          <Link to="/create">
            <Button
              data-testid="shared-cta-btn"
              size="lg"
              className="mt-6 rounded-full bg-[#2C362B] px-8 text-white hover:-translate-y-0.5 hover:bg-[#3a4839] hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              Make one for your mom too
            </Button>
          </Link>
        </motion.div>
      </main>

      {track && (
        <audio
          ref={audioRef}
          src={track.url}
          loop
          preload="auto"
        />
      )}
    </div>
  );
}
