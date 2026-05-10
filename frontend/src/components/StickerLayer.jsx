import * as Lucide from "lucide-react";

export default function StickerLayer({ stickers, onUpdate, editable }) {
  return (
    <>
      {stickers.map((s) => {
        const Icon = Lucide[s.type] || Lucide.Heart;
        return (
          <div
            key={s.id}
            data-testid={`sticker-${s.id}`}
            className={`absolute select-none ${editable ? "cursor-move" : ""}`}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            }}
            onPointerDown={(e) => {
              if (!editable) return;
              const target = e.currentTarget.parentElement;
              const rect = target.getBoundingClientRect();
              const move = (ev) => {
                const nx = ((ev.clientX - rect.left) / rect.width) * 100;
                const ny = ((ev.clientY - rect.top) / rect.height) * 100;
                onUpdate(s.id, {
                  x: Math.max(0, Math.min(100, nx)),
                  y: Math.max(0, Math.min(100, ny)),
                });
              };
              const up = () => {
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
              };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", up);
            }}
          >
            <Icon
              size={s.size}
              color={s.color}
              fill={s.color}
              strokeWidth={1.5}
              style={{ opacity: 0.95 }}
            />
          </div>
        );
      })}
    </>
  );
}
