import { FONT_OPTIONS, FRAME_OPTIONS } from "@/lib/config";
import StickerLayer from "@/components/StickerLayer";

const FRAME_STYLES = {
  none: {},
  soft: { border: "1px solid rgba(44,54,43,0.18)", borderRadius: 18 },
  double: {
    border: "1px solid #2C362B",
    boxShadow: "inset 0 0 0 6px #FDFBF7, inset 0 0 0 7px #2C362B",
    borderRadius: 6,
  },
  ornate: {
    border: "3px double #E07A5F",
    boxShadow: "inset 0 0 0 8px rgba(244,227,215,0.6)",
    borderRadius: 4,
  },
  deckle: {
    borderRadius: 0,
    boxShadow:
      "0 0 0 12px #FDFBF7, 0 0 0 13px rgba(44,54,43,0.15), 0 30px 60px -20px rgba(44,54,43,0.25)",
  },
};

export default function CardCanvas({
  card,
  onStickerUpdate,
  editable = false,
  size = "md",
}) {
  const fontClass =
    FONT_OPTIONS.find((f) => f.name === card.font_family)?.className ||
    "font-cormorant";

  const frameStyle = FRAME_STYLES[card.frame] || {};
  const dimensions =
    size === "lg"
      ? "w-full max-w-[440px] aspect-[5/7]"
      : "w-full max-w-[360px] aspect-[5/7]";

  return (
    <div
      data-testid="card-canvas"
      className={`relative paper-texture overflow-hidden shadow-2xl ${dimensions}`}
      style={{
        background: card.bg_gradient || card.bg_color,
        ...frameStyle,
      }}
    >
      {/* Photo */}
      {card.image_url && (
        <div className="absolute inset-x-6 top-6 h-[42%] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5">
          <img
            src={card.image_url}
            alt="memory"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      )}

      {/* Header */}
      <div
        className={`absolute left-0 right-0 ${card.image_url ? "top-[48%]" : "top-[8%]"} px-6 text-center`}
        style={{ color: card.text_color }}
      >
        <div className="font-outfit text-[10px] uppercase tracking-[0.32em] opacity-70">
          Happy Mother&apos;s Day
        </div>
        <div className={`mt-1 ${fontClass} text-2xl leading-tight`}>
          {card.recipient_name ? `Dear ${card.recipient_name}` : "Dear Mom"}
        </div>
      </div>

      {/* Message */}
      <div
        className={`absolute left-0 right-0 ${card.image_url ? "top-[60%]" : "top-[28%]"} bottom-[14%] overflow-hidden px-6 text-center`}
        style={{ color: card.text_color }}
      >
        <p
          className={`${fontClass} ${size === "lg" ? "text-lg" : "text-base"} italic leading-snug`}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {card.message ||
            "Your message will appear here. Pour your heart out."}
        </p>
      </div>

      {/* Signature */}
      <div
        className="absolute bottom-4 left-0 right-0 px-6 text-center"
        style={{ color: card.text_color }}
      >
        <div className="font-outfit text-[10px] uppercase tracking-[0.32em] opacity-60">
          With love,
        </div>
        <div className={`${fontClass} text-xl`}>
          {card.sender_name || "Your name"}
        </div>
      </div>

      {/* Stickers */}
      <StickerLayer
        stickers={card.stickers || []}
        onUpdate={onStickerUpdate}
        editable={editable}
      />
    </div>
  );
}
