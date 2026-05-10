import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Heart,
  Upload,
  Wand2,
  Image as ImageIcon,
  Type,
  Palette,
  Frame as FrameIcon,
  Music,
  Sticker as StickerIcon,
  Loader2,
  Sparkles,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import * as Lucide from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

import CardCanvas from "@/components/CardCanvas";
import {
  API,
  COLOR_PALETTE,
  FONT_OPTIONS,
  FRAME_OPTIONS,
  STICKER_LIBRARY,
  MUSIC_TRACKS,
} from "@/lib/config";

const initialCard = {
  sender_name: "",
  recipient_name: "",
  message: "",
  image_url: "",
  image_public_id: "",
  bg_color: "#FDFBF7",
  bg_gradient: "",
  font_family: "Elegant Serif",
  text_color: "#2C362B",
  frame: "soft",
  stickers: [],
  music_track: "piano",
};

export default function CreateCardPage() {
  const navigate = useNavigate();
  const [card, setCard] = useState(initialCard);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [tone, setTone] = useState("heartfelt");
  const [saving, setSaving] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const fileRef = useRef(null);

  const update = (patch) => setCard((c) => ({ ...c, ...patch }));

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const sigRes = await axios.get(`${API}/cloudinary/signature`);
      const sig = sigRes.data;
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.api_key);
      form.append("timestamp", sig.timestamp);
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
        form,
      );
      update({
        image_url: res.data.secure_url,
        image_public_id: res.data.public_id,
      });
      toast.success("Photo uploaded");
    } catch (e) {
      console.error(e);
      toast.error("Upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
    }
  };

  const handleAiSuggest = async () => {
    if (!card.recipient_name) {
      toast.error("Add your mom's name first");
      return;
    }
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/ai/suggest-message`, {
        recipient_name: card.recipient_name,
        tone,
        relationship: "mother",
      });
      setSuggestions(res.data.suggestions || []);
      toast.success("Got 3 ideas for you");
    } catch (e) {
      console.error(e);
      toast.error("AI is taking a break. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const addSticker = (type) => {
    const id = `${type}-${Date.now()}`;
    update({
      stickers: [
        ...card.stickers,
        {
          id,
          type,
          x: 50,
          y: 90,
          size: 28,
          color: "#E07A5F",
          rotation: 0,
        },
      ],
    });
    setSelectedSticker(id);
  };

  const updateSticker = (id, patch) => {
    update({
      stickers: card.stickers.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });
  };

  const removeSticker = (id) => {
    update({ stickers: card.stickers.filter((s) => s.id !== id) });
    setSelectedSticker(null);
  };

  const handleSave = async () => {
    if (!card.sender_name || !card.recipient_name || !card.message) {
      toast.error("Fill in your name, mom's name, and a message");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(`${API}/cards`, card);
      toast.success("Card created!");
      navigate(`/card/${res.data.slug}`);
    } catch (e) {
      console.error(e);
      toast.error("Could not save card");
    } finally {
      setSaving(false);
    }
  };

  const sticker = card.stickers.find((s) => s.id === selectedSticker);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C362B]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#F4E3D7] bg-[#FDFBF7]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            to="/"
            data-testid="editor-back-btn"
            className="flex items-center gap-2 text-sm text-[#2C362B]/70 hover:text-[#E07A5F]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 font-cormorant text-xl">
            <Heart className="h-5 w-5" color="#E07A5F" fill="#E07A5F" />
            Design Your Card
          </div>
          <Button
            data-testid="editor-save-btn"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-[#E07A5F] px-6 text-white hover:-translate-y-0.5 hover:bg-[#d06a4f] hover:shadow-lg transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Create & Share
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-12 md:px-10">
        {/* Sidebar */}
        <aside className="md:col-span-5 lg:col-span-4">
          {/* Names */}
          <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
            <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
              Your Name
            </Label>
            <Input
              data-testid="input-sender-name"
              value={card.sender_name}
              onChange={(e) => update({ sender_name: e.target.value })}
              placeholder="e.g., Maya"
              className="mt-2 rounded-xl border-[#F4E3D7]"
            />
            <Label className="mt-4 block text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
              Mom&apos;s Name
            </Label>
            <Input
              data-testid="input-recipient-name"
              value={card.recipient_name}
              onChange={(e) => update({ recipient_name: e.target.value })}
              placeholder="e.g., Anjali"
              className="mt-2 rounded-xl border-[#F4E3D7]"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="message" className="mt-6">
            <TabsList
              data-testid="editor-tabs"
              className="grid w-full grid-cols-6 rounded-full bg-[#F4E3D7]/60 p-1"
            >
              <TabsTrigger
                data-testid="tab-message"
                value="message"
                className="rounded-full data-[state=active]:bg-white"
              >
                <Type className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                data-testid="tab-photo"
                value="photo"
                className="rounded-full data-[state=active]:bg-white"
              >
                <ImageIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                data-testid="tab-stickers"
                value="stickers"
                className="rounded-full data-[state=active]:bg-white"
              >
                <StickerIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                data-testid="tab-style"
                value="style"
                className="rounded-full data-[state=active]:bg-white"
              >
                <Palette className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                data-testid="tab-frame"
                value="frame"
                className="rounded-full data-[state=active]:bg-white"
              >
                <FrameIcon className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger
                data-testid="tab-music"
                value="music"
                className="rounded-full data-[state=active]:bg-white"
              >
                <Music className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            {/* Message + AI */}
            <TabsContent value="message" className="mt-4">
              <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Your Message
                </Label>
                <Textarea
                  data-testid="input-message"
                  rows={8}
                  value={card.message}
                  onChange={(e) => update({ message: e.target.value })}
                  placeholder="Pour your heart out…"
                  className="mt-2 rounded-xl border-[#F4E3D7]"
                />

                <Separator className="my-5 bg-[#F4E3D7]" />

                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Stuck? Let AI help.
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger
                      data-testid="select-tone"
                      className="rounded-xl border-[#F4E3D7]"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heartfelt">Heartfelt</SelectItem>
                      <SelectItem value="poetic">Poetic</SelectItem>
                      <SelectItem value="funny">Funny & sweet</SelectItem>
                      <SelectItem value="grateful">Grateful</SelectItem>
                      <SelectItem value="simple">Simple & honest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    data-testid="ai-suggest-btn"
                    onClick={handleAiSuggest}
                    disabled={generating}
                    className="rounded-full bg-[#2C362B] px-5 text-white hover:bg-[#3a4839]"
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Suggest</span>
                  </Button>
                </div>

                {suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        data-testid={`ai-suggestion-${i}`}
                        onClick={() => {
                          update({ message: s });
                          toast.success("Applied");
                        }}
                        className="w-full rounded-2xl border border-[#F4E3D7] bg-[#FDFBF7] p-4 text-left text-sm leading-relaxed text-[#2C362B] transition-all hover:-translate-y-0.5 hover:border-[#E07A5F] hover:shadow-md"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Photo */}
            <TabsContent value="photo" className="mt-4">
              <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  A photo of mom (or you both)
                </Label>
                <input
                  ref={fileRef}
                  data-testid="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
                <button
                  data-testid="upload-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="mt-3 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#F4E3D7] bg-[#FDFBF7] py-10 transition-all hover:border-[#E07A5F]"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-[#E07A5F]" />
                  ) : (
                    <Upload className="h-8 w-8 text-[#E07A5F]" />
                  )}
                  <span className="mt-2 text-sm">
                    {uploading
                      ? "Uploading…"
                      : card.image_url
                        ? "Change photo"
                        : "Click to upload"}
                  </span>
                </button>
                {card.image_url && (
                  <div className="mt-4">
                    <img
                      src={card.image_url}
                      alt="uploaded"
                      className="h-32 w-full rounded-xl object-cover"
                    />
                    <Button
                      data-testid="remove-photo-btn"
                      variant="ghost"
                      onClick={() =>
                        update({ image_url: "", image_public_id: "" })
                      }
                      className="mt-2 w-full rounded-xl text-[#2C362B]/70"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Stickers */}
            <TabsContent value="stickers" className="mt-4">
              <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Add stickers
                </Label>
                <div className="mt-3 grid grid-cols-6 gap-2">
                  {STICKER_LIBRARY.map((s) => {
                    const Icon = Lucide[s.type] || Lucide.Heart;
                    return (
                      <button
                        key={s.type}
                        data-testid={`sticker-add-${s.type}`}
                        onClick={() => addSticker(s.type)}
                        className="flex aspect-square items-center justify-center rounded-xl bg-[#F4E3D7]/40 transition-all hover:-translate-y-0.5 hover:bg-[#F4E3D7]"
                        title={s.name}
                      >
                        <Icon
                          className="h-5 w-5"
                          color="#E07A5F"
                          fill="#E07A5F"
                        />
                      </button>
                    );
                  })}
                </div>

                {sticker && (
                  <div className="mt-5 rounded-2xl bg-[#FDFBF7] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                        Selected: {sticker.type}
                      </div>
                      <Button
                        data-testid="sticker-remove-btn"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSticker(sticker.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3">
                      <Label className="text-xs">Size</Label>
                      <Slider
                        data-testid="sticker-size-slider"
                        value={[sticker.size]}
                        min={16}
                        max={120}
                        step={2}
                        onValueChange={(v) =>
                          updateSticker(sticker.id, { size: v[0] })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div className="mt-3">
                      <Label className="text-xs">Rotation</Label>
                      <Slider
                        value={[sticker.rotation]}
                        min={-180}
                        max={180}
                        step={5}
                        onValueChange={(v) =>
                          updateSticker(sticker.id, { rotation: v[0] })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div className="mt-3">
                      <Label className="text-xs">Color</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c}
                            data-testid={`sticker-color-${c}`}
                            onClick={() =>
                              updateSticker(sticker.id, { color: c })
                            }
                            className="h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-[#FDFBF7] transition-transform hover:scale-110"
                            style={{
                              background: c,
                              boxShadow:
                                sticker.color === c
                                  ? "0 0 0 2px #E07A5F"
                                  : "0 0 0 1px rgba(0,0,0,0.1)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-[#2C362B]/60">
                      Tip: drag stickers on the card to reposition.
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Style */}
            <TabsContent value="style" className="mt-4">
              <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Background color
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      data-testid={`bg-color-${c}`}
                      onClick={() =>
                        update({ bg_color: c, bg_gradient: "" })
                      }
                      className="h-9 w-9 rounded-full transition-transform hover:scale-110"
                      style={{
                        background: c,
                        boxShadow:
                          card.bg_color === c && !card.bg_gradient
                            ? "0 0 0 2px #E07A5F"
                            : "0 0 0 1px rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}
                </div>

                <Label className="mt-5 block text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Gradients
                </Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    "linear-gradient(135deg,#FCD5CE,#F8EDEB)",
                    "linear-gradient(135deg,#F4E3D7,#E9EDC9)",
                    "linear-gradient(135deg,#FDFBF7,#F4E3D7)",
                    "linear-gradient(135deg,#E9EDC9,#FCD5CE)",
                    "linear-gradient(135deg,#F0EFEB,#FCD5CE)",
                    "linear-gradient(135deg,#FDFBF7,#FCD5CE)",
                  ].map((g) => (
                    <button
                      key={g}
                      data-testid={`bg-gradient-${g}`}
                      onClick={() => update({ bg_gradient: g })}
                      className="h-12 rounded-xl ring-1 ring-black/5"
                      style={{
                        background: g,
                        outline:
                          card.bg_gradient === g ? "2px solid #E07A5F" : "none",
                      }}
                    />
                  ))}
                </div>

                <Separator className="my-5 bg-[#F4E3D7]" />

                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Font
                </Label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      data-testid={`font-${f.id}`}
                      onClick={() => update({ font_family: f.name })}
                      className={`rounded-xl border px-4 py-3 text-left transition-all ${
                        card.font_family === f.name
                          ? "border-[#E07A5F] bg-[#FDFBF7]"
                          : "border-[#F4E3D7] hover:border-[#E07A5F]"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#2C362B]/50">
                        {f.name}
                      </div>
                      <div className={`${f.className} text-lg`}>
                        Happy Mother&apos;s Day
                      </div>
                    </button>
                  ))}
                </div>

                <Separator className="my-5 bg-[#F4E3D7]" />

                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Text color
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["#2C362B", "#E07A5F", "#81B29A", "#3D405B", "#FFFFFF"].map(
                    (c) => (
                      <button
                        key={c}
                        data-testid={`text-color-${c}`}
                        onClick={() => update({ text_color: c })}
                        className="h-9 w-9 rounded-full transition-transform hover:scale-110"
                        style={{
                          background: c,
                          boxShadow:
                            card.text_color === c
                              ? "0 0 0 2px #E07A5F"
                              : "0 0 0 1px rgba(0,0,0,0.1)",
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Frame */}
            <TabsContent value="frame" className="mt-4">
              <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Frame style
                </Label>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {FRAME_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      data-testid={`frame-${f.id}`}
                      onClick={() => update({ frame: f.id })}
                      className={`rounded-2xl border-2 px-4 py-6 text-sm transition-all ${
                        card.frame === f.id
                          ? "border-[#E07A5F] bg-[#FDFBF7]"
                          : "border-[#F4E3D7] hover:border-[#E07A5F]"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Music */}
            <TabsContent value="music" className="mt-4">
              <div className="rounded-3xl border border-[#F4E3D7] bg-white p-6">
                <Label className="text-xs uppercase tracking-[0.2em] text-[#2C362B]/60">
                  Background music (plays on the shared card)
                </Label>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <button
                    data-testid="music-none"
                    onClick={() => update({ music_track: "" })}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      !card.music_track
                        ? "border-[#E07A5F] bg-[#FDFBF7]"
                        : "border-[#F4E3D7] hover:border-[#E07A5F]"
                    }`}
                  >
                    <div className="text-sm">No music</div>
                  </button>
                  {MUSIC_TRACKS.map((t) => (
                    <button
                      key={t.id}
                      data-testid={`music-${t.id}`}
                      onClick={() => update({ music_track: t.id })}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                        card.music_track === t.id
                          ? "border-[#E07A5F] bg-[#FDFBF7]"
                          : "border-[#F4E3D7] hover:border-[#E07A5F]"
                      }`}
                    >
                      <div className="text-sm">{t.name}</div>
                      <Music className="h-4 w-4 text-[#E07A5F]" />
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Canvas preview */}
        <main className="md:col-span-7 lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-28 flex flex-col items-center"
          >
            <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[#2C362B]/50">
              Live Preview
            </div>
            <CardCanvas
              card={card}
              size="lg"
              editable
              onStickerUpdate={updateSticker}
            />
            <div className="mt-4 text-xs text-[#2C362B]/50">
              Tip: drag stickers to position them anywhere on the card.
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
