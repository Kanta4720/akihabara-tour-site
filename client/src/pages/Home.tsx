/*
 * DESIGN PHILOSOPHY: Neon Cyberpunk — 秋葉原の夜
 * Dark navy/black base | Cyan + Magenta + Amber neon accents
 * Orbitron headings | Space Grotesk body
 * Asymmetric layouts, glow effects, scan lines
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Film, Mic, MessageSquare, Calendar, ChevronRight, 
  Copy, Check, Play, ArrowRight, Layers, Bot, Workflow,
  Star, Hash, Volume2, Scissors, Upload, Instagram
} from "lucide-react";
import { toast } from "sonner";

// ── Images ──────────────────────────────────────────────────────────────────
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663313244152/PJRKuGKLiV8qybSdJnFX8v/hero-akihabara-night-6E5oDojB8Bk5TAxtv9Dp4e.webp";
const WORKFLOW_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663313244152/PJRKuGKLiV8qybSdJnFX8v/workflow-bg-6228Pz82JaYEPdj34GPcjF.webp";
const REEL_MOCKUP = "https://d2xsxph8kpxj0f.cloudfront.net/310519663313244152/PJRKuGKLiV8qybSdJnFX8v/reel-mockup-g5H5S4KVWugWo6Mtsph5EM.webp";

// ── Data ─────────────────────────────────────────────────────────────────────
const AI_TOOLS = [
  {
    icon: <Scissors className="w-6 h-6" />,
    name: "CapCut",
    category: "動画編集・字幕生成",
    color: "cyan",
    desc: "スマホアプリで完結。AI自動字幕（英語対応）、自動カット、豊富なテンプレート。初心者でもプロ品質の動画が作れる最強ツール。",
    badge: "無料",
    url: "https://www.capcut.com",
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    name: "Vrew",
    category: "動画編集・字幕生成",
    color: "cyan",
    desc: "PCベースの動画編集ソフト。音声認識による自動字幕生成の精度が高く、無音区間の自動カット機能が特に優秀。",
    badge: "無料プランあり",
    url: "https://vrew.ai",
  },
  {
    icon: <Volume2 className="w-6 h-6" />,
    name: "ElevenLabs",
    category: "音声読み上げ（ナレーション）",
    color: "magenta",
    desc: "最高品質のAI音声生成。英語ネイティブのような自然な発音で、感情表現も調整可能。欧米ターゲットに最適。",
    badge: "月5分無料",
    url: "https://elevenlabs.io",
  },
  {
    icon: <Volume2 className="w-6 h-6" />,
    name: "音読さん",
    category: "音声読み上げ（ナレーション）",
    color: "magenta",
    desc: "日本語に強いAI音声読み上げ。多言語対応で無料から使い始められる。日本語ナレーションが必要な場合に活躍。",
    badge: "無料",
    url: "https://ondoku3.com",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    name: "ChatGPT (GPT-4o)",
    category: "構成・台本・キャプション作成",
    color: "amber",
    desc: "台本作成、キャプション生成、ハッシュタグ提案まで万能。「秋葉原ツアーのリール台本を英語で」と一言で完成。",
    badge: "無料プランあり",
    url: "https://chat.openai.com",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    name: "Meta Business Suite",
    category: "投稿予約・分析",
    color: "green",
    desc: "Instagram公式の管理ツール。リール投稿の予約スケジューリングと詳細なインサイト分析が無料で利用可能。",
    badge: "無料",
    url: "https://business.facebook.com",
  },
];

const TEMPLATES = [
  {
    id: "A",
    name: "スポット紹介型",
    tagline: "Deep Dive Format",
    color: "cyan",
    desc: "一つのスポットを深掘り。強烈なフックから始め、詳細を見せてCTAで締める王道構成。",
    scenes: [
      { time: "0-3秒", label: "HOOK", content: "最も衝撃的な映像 + テキスト", note: "You won't believe what's inside!" },
      { time: "3-8秒", label: "INTRO", content: "スポットの全景・外観", note: "期待感を高める" },
      { time: "8-20秒", label: "DETAILS", content: "店内・商品・体験の流れ", note: "複数クリップをテンポよく" },
      { time: "20-25秒", label: "CLIMAX", content: "最大の魅力を再アピール", note: "限定グッズ・特別体験" },
      { time: "25-30秒", label: "CTA", content: "ツアーへの誘導", note: "Link in bio!" },
    ],
  },
  {
    id: "B",
    name: "リスト型（まとめ型）",
    tagline: "Top N Format",
    color: "magenta",
    desc: "「Top 3...」形式で複数スポットを紹介。数字で視聴者の興味を引き、最後まで見させる構成。",
    scenes: [
      { time: "0-3秒", label: "HOOK", content: "数字+テーマを明確に提示", note: "3 Must-Try Anime Spots!" },
      { time: "3-10秒", label: "#1", content: "1つ目のスポット紹介", note: "#1: Gachapon Heaven 🎰" },
      { time: "10-17秒", label: "#2", content: "2つ目のスポット紹介", note: "#2: Retro Arcade 🕹️" },
      { time: "17-24秒", label: "#3", content: "3つ目のスポット紹介", note: "#3: Anime Cafe ☕" },
      { time: "24-30秒", label: "CTA", content: "コメント促進+ツアー誘導", note: "Which is your fav?" },
    ],
  },
  {
    id: "C",
    name: "VLOG風体験型",
    tagline: "POV Experience Format",
    color: "amber",
    desc: "撮影者視点でツアーを追体験。親近感と没入感で「自分も行きたい」という感情を引き出す。",
    scenes: [
      { time: "0-3秒", label: "HOOK", content: "楽しんでいる表情のアップ", note: "Come with me to Akihabara!" },
      { time: "3-10秒", label: "JOURNEY", content: "移動・発見シーン", note: "ストーリー性を持たせる" },
      { time: "10-25秒", label: "EXPERIENCE", content: "体験シーンを複数見せる", note: "メイドカフェ・ゲーセン等" },
      { time: "25-30秒", label: "ENDING + CTA", content: "最高の笑顔で締める", note: "Best day ever! Check our tour!" },
    ],
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    phase: "企画・撮影",
    icon: <Film className="w-6 h-6" />,
    color: "cyan",
    tools: ["ChatGPT", "スマートフォン"],
    tasks: [
      "テンプレートA/B/Cから構成を選択",
      "ChatGPTで台本の骨子を作成",
      "縦向き（9:16）で3〜5秒クリップを複数撮影",
      "手ブレ補正ON・明るい場所で撮影",
    ],
    tip: "各シーンを少し長めに撮っておくと編集が楽になります",
  },
  {
    step: "02",
    phase: "編集・AI活用",
    icon: <Scissors className="w-6 h-6" />,
    color: "magenta",
    tools: ["CapCut", "ElevenLabs"],
    tasks: [
      "CapCutでクリップを読み込み・並べ替え",
      "BGMを選択（トレンド楽曲 or 著作権フリー）",
      "「テキスト→自動キャプション」でAI字幕生成（英語）",
      "ElevenLabsでナレーション音声を生成・挿入",
      "1080p / 30fps でエクスポート",
    ],
    tip: "固有名詞（店名等）はAI字幕の誤認識が多いので必ず確認を",
  },
  {
    step: "03",
    phase: "投稿・分析",
    icon: <Instagram className="w-6 h-6" />,
    color: "amber",
    tools: ["ChatGPT", "Meta Business Suite"],
    tasks: [
      "ChatGPTでキャプション・ハッシュタグを生成",
      "Instagramリール作成画面からアップロード",
      "カバー写真を選択して投稿",
      "Meta Business Suiteでインサイトを確認",
    ],
    tip: "投稿は火〜木の19〜21時が欧米ターゲットへのリーチが高い傾向",
  },
];

const SCRIPT_EXAMPLE = {
  theme: "3 Secret Anime Spots in Akihabara",
  template: "リスト型 (Template B)",
  scenes: [
    {
      time: "0-3秒",
      label: "HOOK",
      color: "cyan",
      visual: "アニメシーンと現実の風景を交互に見せる",
      text: "3 Secret Anime Spots in Akihabara You MUST Visit! 🤫",
      narration: "(Music driven — no narration)",
    },
    {
      time: "3-10秒",
      label: "#1: The Hidden Shrine",
      color: "magenta",
      visual: "雑居ビルの間の小さな神社。フィギュアのお供えをアップで",
      text: "#1: The Hidden Shrine ⛩️",
      narration: "First, find the hidden shrine where locals pray for their gacha luck!",
    },
    {
      time: "10-17秒",
      label: "#2: Retro Arcade Heaven",
      color: "amber",
      visual: "地下のレトロゲーセン。格闘ゲームをプレイする手元",
      text: "#2: Retro Arcade Heaven 🕹️",
      narration: "Next, dive into a basement arcade packed with retro games from the 90s.",
    },
    {
      time: "17-24秒",
      label: "#3: Anime-Inspired Cafe",
      color: "green",
      visual: "コラボカフェのラテアートと限定グッズ",
      text: "#3: Anime-Inspired Cafe ☕",
      narration: "Finally, relax at a limited-time anime cafe. The latte art is just too cute!",
    },
    {
      time: "24-30秒",
      label: "CTA",
      color: "cyan",
      visual: "ガイドが笑顔で手を振るシーン",
      text: "Want to discover more secrets? Full tour link in bio! ✨",
      narration: "Ready to explore? Our Akihabara tour shows you all these spots and more!",
    },
  ],
};

const CATCHPHRASES = [
  {
    en: "Unleash Your Inner Otaku: The Ultimate Akihabara Tour.",
    ja: "内なるオタクを解放せよ！究極の秋葉原ツアー",
    use: "ヒーロー文言・プロフィール",
    color: "cyan",
  },
  {
    en: "Akihabara isn't just a place, it's an experience. Dive in with us.",
    ja: "秋葉原はただの場所じゃない、体験だ。一緒に飛び込もう",
    use: "キャプション冒頭",
    color: "magenta",
  },
  {
    en: "From Arcades to Anime: Your Epic Akihabara Adventure Starts Here.",
    ja: "アーケードからアニメまで：壮大な秋葉原の冒険はここから",
    use: "リスト型リールのフック",
    color: "amber",
  },
  {
    en: "Warning: May cause extreme happiness and an empty wallet. 😉",
    ja: "警告：極度の幸福と空っぽの財布を引き起こす可能性あり",
    use: "ユーモア系キャプション",
    color: "green",
  },
  {
    en: "Skip the tourist traps. We'll show you the REAL Akihabara.",
    ja: "観光客向けの罠はスキップ。本物の秋葉原を見せます",
    use: "差別化訴求フック",
    color: "cyan",
  },
  {
    en: "Your anime pilgrimage starts now. ⛩️",
    ja: "あなたのアニメ聖地巡礼は、今始まる",
    use: "短尺フック・ストーリーズ",
    color: "magenta",
  },
];

const AUTOMATION_NODES = [
  { id: "trigger", label: "Google Drive", sub: "素材アップロードをトリガー", x: 10, color: "cyan" },
  { id: "n8n", label: "n8n / Zapier", sub: "ワークフロー自動実行", x: 35, color: "magenta" },
  { id: "video", label: "動画AI API", sub: "字幕・ナレーション付き動画を生成", x: 60, color: "amber" },
  { id: "caption", label: "ChatGPT API", sub: "キャプション・ハッシュタグ生成", x: 60, color: "green" },
  { id: "post", label: "Instagram API", sub: "指定日時に自動投稿予約", x: 85, color: "cyan" },
];

// ── Utility ──────────────────────────────────────────────────────────────────
const colorMap: Record<string, { text: string; border: string; bg: string; glow: string; badge: string }> = {
  cyan:    { text: "text-[oklch(0.85_0.18_195)]",    border: "border-[oklch(0.85_0.18_195/50%)]",  bg: "bg-[oklch(0.85_0.18_195/10%)]",  glow: "shadow-[0_0_20px_oklch(0.85_0.18_195/30%)]",  badge: "bg-[oklch(0.85_0.18_195/15%)] text-[oklch(0.85_0.18_195)]" },
  magenta: { text: "text-[oklch(0.72_0.25_330)]",    border: "border-[oklch(0.72_0.25_330/50%)]",  bg: "bg-[oklch(0.72_0.25_330/10%)]",  glow: "shadow-[0_0_20px_oklch(0.72_0.25_330/30%)]",  badge: "bg-[oklch(0.72_0.25_330/15%)] text-[oklch(0.72_0.25_330)]" },
  amber:   { text: "text-[oklch(0.82_0.18_65)]",     border: "border-[oklch(0.82_0.18_65/50%)]",   bg: "bg-[oklch(0.82_0.18_65/10%)]",   glow: "shadow-[0_0_20px_oklch(0.82_0.18_65/30%)]",   badge: "bg-[oklch(0.82_0.18_65/15%)] text-[oklch(0.82_0.18_65)]" },
  green:   { text: "text-[oklch(0.82_0.2_145)]",     border: "border-[oklch(0.82_0.2_145/50%)]",   bg: "bg-[oklch(0.82_0.2_145/10%)]",   glow: "shadow-[0_0_20px_oklch(0.82_0.2_145/30%)]",   badge: "bg-[oklch(0.82_0.2_145/15%)] text-[oklch(0.82_0.2_145)]" },
};

function NeonBadge({ color, children }: { color: string; children: React.ReactNode }) {
  const c = colorMap[color] ?? colorMap.cyan;
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded ${c.badge} border ${c.border}`}>
      {children}
    </span>
  );
}

function SectionTitle({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-12">
      <p className="text-xs font-mono tracking-[0.3em] text-[oklch(0.85_0.18_195)] mb-3 uppercase">{label}</p>
      <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">{title}</h2>
      {sub && <p className="text-[oklch(0.6_0.04_265)] max-w-2xl text-base leading-relaxed">{sub}</p>}
    </div>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────

function HeroSection() {
  const [typed, setTyped] = useState("");
  const full = "Akihabara Reels Studio";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(t);
    }, 70);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.1_0.025_265/95%)] via-[oklch(0.1_0.025_265/75%)] to-[oklch(0.1_0.025_265/40%)]" />
      <div className="absolute inset-0 pixel-grid opacity-30" />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 6%) 2px, oklch(0 0 0 / 6%) 4px)"
      }} />

      <div className="relative z-10 container py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-[oklch(0.85_0.18_195)]" />
              <span className="text-xs font-mono tracking-[0.3em] text-[oklch(0.85_0.18_195)] uppercase">
                AI-Powered Content Studio
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-2 cursor-blink">
              {typed}
            </h1>
            <div className="flex items-center gap-2 mb-8 mt-4">
              <span className="text-[oklch(0.72_0.25_330)] font-mono text-lg">秋葉原</span>
              <span className="text-[oklch(0.6_0.04_265)]">×</span>
              <span className="text-[oklch(0.85_0.18_195)] font-mono text-lg">Instagram Reels</span>
              <span className="text-[oklch(0.6_0.04_265)]">×</span>
              <span className="text-[oklch(0.82_0.18_65)] font-mono text-lg">AI Automation</span>
            </div>

            <p className="text-[oklch(0.75_0.03_265)] text-lg leading-relaxed mb-10 max-w-2xl">
              訪日外国人向け秋葉原ツアーの集客を、AIツールで最小限の労力で最大化する。
              撮影から投稿まで、完全ガイド付きのインタラクティブワークフロー。
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#workflow" className="group flex items-center gap-2 px-6 py-3 bg-[oklch(0.85_0.18_195)] text-[oklch(0.1_0.025_265)] font-bold rounded hover:bg-[oklch(0.9_0.18_195)] transition-all shadow-[0_0_20px_oklch(0.85_0.18_195/40%)]">
                ワークフローを見る
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#templates" className="flex items-center gap-2 px-6 py-3 border border-[oklch(0.85_0.18_195/50%)] text-[oklch(0.85_0.18_195)] font-bold rounded hover:bg-[oklch(0.85_0.18_195/10%)] transition-all">
                テンプレートを見る
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating phone mockup */}
      <motion.div
        className="absolute right-8 bottom-0 hidden lg:block w-72 xl:w-80"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <img src={REEL_MOCKUP} alt="Reel Mockup" className="w-full drop-shadow-2xl" />
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[oklch(0.5_0.04_265)]">
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-[oklch(0.85_0.18_195)] to-transparent"
        />
      </div>
    </section>
  );
}

function ToolsSection() {
  const categories = Array.from(new Set(AI_TOOLS.map(t => t.category)));
  const [active, setActive] = useState(categories[0]);

  return (
    <section id="tools" className="py-24 relative">
      <div className="absolute inset-0 pixel-grid opacity-20" />
      <div className="container relative z-10">
        <SectionTitle
          label="// Section 01"
          title="おすすめAIツール一覧"
          sub="動画制作の各工程に最適なAIツールを目的別に厳選。これらを組み合わせることで、作業効率が飛躍的に向上します。"
        />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 text-sm font-mono rounded border transition-all ${
                active === cat
                  ? "bg-[oklch(0.85_0.18_195/15%)] border-[oklch(0.85_0.18_195/70%)] text-[oklch(0.85_0.18_195)]"
                  : "border-[oklch(0.28_0.05_265/60%)] text-[oklch(0.6_0.04_265)] hover:border-[oklch(0.85_0.18_195/40%)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {AI_TOOLS.filter(t => t.category === active).map((tool, i) => {
            const c = colorMap[tool.color];
            return (
              <motion.a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`neon-card rounded-lg p-6 block group hover:${c.glow} transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${c.bg} ${c.text}`}>
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg text-white group-hover:${c.text} transition-colors`}>
                        {tool.name}
                      </h3>
                      <p className="text-xs text-[oklch(0.5_0.04_265)] font-mono">{tool.category}</p>
                    </div>
                  </div>
                  <NeonBadge color={tool.color}>{tool.badge}</NeonBadge>
                </div>
                <p className="text-[oklch(0.7_0.03_265)] text-sm leading-relaxed">{tool.desc}</p>
                <div className={`flex items-center gap-1 mt-4 text-xs ${c.text} font-mono opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <span>サイトを開く</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Quick reference table */}
        <div className="mt-12 neon-card rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[oklch(0.28_0.05_265/60%)]">
            <h3 className="font-bold text-white font-mono text-sm">// 推奨ツールスタック（最小構成）</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[oklch(0.28_0.05_265/40%)]">
                  <th className="text-left px-6 py-3 text-[oklch(0.5_0.04_265)] font-mono text-xs">工程</th>
                  <th className="text-left px-6 py-3 text-[oklch(0.5_0.04_265)] font-mono text-xs">推奨ツール</th>
                  <th className="text-left px-6 py-3 text-[oklch(0.5_0.04_265)] font-mono text-xs">コスト</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { step: "動画編集・自動字幕", tool: "CapCut", cost: "無料", color: "cyan" },
                  { step: "AI音声ナレーション", tool: "ElevenLabs", cost: "月5分無料", color: "magenta" },
                  { step: "台本・キャプション作成", tool: "ChatGPT (GPT-4o)", cost: "無料プランあり", color: "amber" },
                  { step: "投稿予約・分析", tool: "Meta Business Suite", cost: "無料", color: "green" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[oklch(0.28_0.05_265/20%)] hover:bg-[oklch(0.85_0.18_195/3%)] transition-colors">
                    <td className="px-6 py-4 text-[oklch(0.75_0.03_265)]">{row.step}</td>
                    <td className={`px-6 py-4 font-mono font-bold ${colorMap[row.color].text}`}>{row.tool}</td>
                    <td className="px-6 py-4"><NeonBadge color={row.color}>{row.cost}</NeonBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function TemplatesSection() {
  const [selected, setSelected] = useState(0);
  const tmpl = TEMPLATES[selected];
  const c = colorMap[tmpl.color];

  return (
    <section id="templates" className="py-24 bg-[oklch(0.13_0.025_265)]">
      <div className="container">
        <SectionTitle
          label="// Section 02"
          title="動画構成テンプレート"
          sub="3パターンのテンプレートから選ぶだけ。フックを重視した構成で、最後まで視聴させるリールが作れます。"
        />

        {/* Template selector */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {TEMPLATES.map((t, i) => {
            const tc = colorMap[t.color];
            return (
              <button
                key={t.id}
                onClick={() => setSelected(i)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selected === i
                    ? `${tc.bg} ${tc.border} ${tc.glow}`
                    : "border-[oklch(0.28_0.05_265/60%)] hover:border-[oklch(0.28_0.05_265)]"
                }`}
              >
                <div className={`text-2xl font-black font-mono mb-1 ${selected === i ? tc.text : "text-[oklch(0.4_0.04_265)]"}`}>
                  {t.id}
                </div>
                <div className="text-white font-bold text-sm">{t.name}</div>
                <div className="text-[oklch(0.5_0.04_265)] text-xs font-mono mt-1">{t.tagline}</div>
              </button>
            );
          })}
        </div>

        {/* Template detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`neon-card rounded-lg p-6 mb-6 border ${c.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-black text-white mb-1`}>
                    Template {tmpl.id}: {tmpl.name}
                  </h3>
                  <p className="text-[oklch(0.65_0.03_265)] text-sm">{tmpl.desc}</p>
                </div>
                <NeonBadge color={tmpl.color}>{tmpl.tagline}</NeonBadge>
              </div>

              {/* Timeline */}
              <div className="space-y-3 mt-6">
                {tmpl.scenes.map((scene, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="text-xs font-mono text-[oklch(0.5_0.04_265)]">{scene.time}</span>
                    </div>
                    <div className="flex-shrink-0 w-px bg-[oklch(0.28_0.05_265/60%)] self-stretch relative">
                      <div className={`absolute top-1 -left-1.5 w-3 h-3 rounded-full border-2 ${c.border} ${c.bg}`} />
                    </div>
                    <div className={`flex-1 pb-4 rounded-lg px-4 py-3 ${c.bg} border ${c.border}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-mono font-bold ${c.text}`}>{scene.label}</span>
                      </div>
                      <p className="text-white text-sm font-medium">{scene.content}</p>
                      <p className="text-[oklch(0.6_0.04_265)] text-xs mt-1 font-mono">→ {scene.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${WORKFLOW_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.1_0.025_265)] via-transparent to-[oklch(0.1_0.025_265)]" />
      <div className="container relative z-10">
        <SectionTitle
          label="// Section 03"
          title="撮影→編集→投稿 ワークフロー"
          sub="初心者でも再現可能な3ステップ。CapCut + ElevenLabs + ChatGPTの組み合わせで、スマホ一台から始められます。"
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {WORKFLOW_STEPS.map((step, i) => {
            const c = colorMap[step.color];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`neon-card rounded-lg p-6 border ${c.border} ${c.glow}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-4xl font-black font-mono ${c.text} opacity-30`}>{step.step}</div>
                  <div>
                    <div className={`p-2 rounded ${c.bg} ${c.text} w-fit mb-1`}>{step.icon}</div>
                    <h3 className="text-white font-bold text-lg">{step.phase}</h3>
                  </div>
                </div>

                {/* Tools */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {step.tools.map(tool => (
                    <NeonBadge key={tool} color={step.color}>{tool}</NeonBadge>
                  ))}
                </div>

                {/* Tasks */}
                <ul className="space-y-2 mb-5">
                  {step.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[oklch(0.7_0.03_265)]">
                      <ChevronRight className={`w-3 h-3 mt-0.5 flex-shrink-0 ${c.text}`} />
                      {task}
                    </li>
                  ))}
                </ul>

                {/* Tip */}
                <div className={`rounded px-3 py-2 ${c.bg} border ${c.border}`}>
                  <p className={`text-xs font-mono ${c.text}`}>💡 TIP</p>
                  <p className="text-xs text-[oklch(0.7_0.03_265)] mt-1">{step.tip}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ScriptSection() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("コピーしました！");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section id="script" className="py-24 bg-[oklch(0.13_0.025_265)]">
      <div className="container">
        <SectionTitle
          label="// Section 04"
          title="バズる台本サンプル"
          sub="「3 Secret Anime Spots in Akihabara」をテーマにした完全台本。そのままコピーして使えます。"
        />

        <div className="neon-card rounded-lg overflow-hidden border border-[oklch(0.85_0.18_195/30%)]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[oklch(0.28_0.05_265/60%)] flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">{SCRIPT_EXAMPLE.theme}</h3>
              <p className="text-xs font-mono text-[oklch(0.5_0.04_265)]">{SCRIPT_EXAMPLE.template}</p>
            </div>
            <div className="flex items-center gap-2">
              <NeonBadge color="cyan">30秒</NeonBadge>
              <NeonBadge color="magenta">欧米向け</NeonBadge>
            </div>
          </div>

          {/* Scenes */}
          <div className="divide-y divide-[oklch(0.28_0.05_265/30%)]">
            {SCRIPT_EXAMPLE.scenes.map((scene, i) => {
              const c = colorMap[scene.color];
              return (
                <div key={i} className="px-6 py-5 hover:bg-[oklch(0.85_0.18_195/3%)] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-[oklch(0.5_0.04_265)] w-16">{scene.time}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${c.bg} ${c.text} border ${c.border}`}>
                      {scene.label}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[oklch(0.5_0.04_265)] text-xs font-mono mb-1">VISUAL</p>
                      <p className="text-[oklch(0.75_0.03_265)]">{scene.visual}</p>
                    </div>
                    <div>
                      <p className="text-[oklch(0.5_0.04_265)] text-xs font-mono mb-1">TEXT OVERLAY</p>
                      <p className="text-white font-medium">{scene.text}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[oklch(0.5_0.04_265)] text-xs font-mono">NARRATION</p>
                        {scene.narration !== "(Music driven — no narration)" && (
                          <button
                            onClick={() => handleCopy(scene.narration, i)}
                            className="text-[oklch(0.5_0.04_265)] hover:text-[oklch(0.85_0.18_195)] transition-colors"
                          >
                            {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                      <p className={`italic ${scene.narration.startsWith("(") ? "text-[oklch(0.4_0.04_265)]" : "text-[oklch(0.82_0.18_65)]"}`}>
                        "{scene.narration}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CatchphraseSection() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("コピーしました！");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <section id="catchphrases" className="py-24">
      <div className="container">
        <SectionTitle
          label="// Section 05"
          title="英語キャッチコピー集"
          sub="欧米のアニメ・サブカルファンに刺さる6つのコピー。クリックでコピーしてそのまま使えます。"
        />

        <div className="grid md:grid-cols-2 gap-4">
          {CATCHPHRASES.map((cp, i) => {
            const c = colorMap[cp.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`neon-card rounded-lg p-5 border ${c.border} group cursor-pointer hover:${c.glow} transition-all`}
                onClick={() => handleCopy(cp.en, i)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white font-bold text-base leading-snug mb-2 group-hover:text-[oklch(0.92_0.01_265)] transition-colors">
                      {cp.en}
                    </p>
                    <p className="text-[oklch(0.5_0.04_265)] text-sm">{cp.ja}</p>
                    <div className="mt-3">
                      <NeonBadge color={cp.color}>{cp.use}</NeonBadge>
                    </div>
                  </div>
                  <button className={`flex-shrink-0 p-2 rounded ${c.bg} ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {copiedIdx === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hashtag section */}
        <div className="mt-12 neon-card rounded-lg p-6 border border-[oklch(0.72_0.25_330/40%)]">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-[oklch(0.72_0.25_330)]" />
            <h3 className="text-white font-bold">推奨ハッシュタグセット</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "#Akihabara", "#JapanTravel", "#AnimeLover", "#OtakuCulture",
              "#TokyoTour", "#AnimeJapan", "#JapanTourism", "#Manga",
              "#JapanVlog", "#VisitJapan", "#AkihabaraElectricTown", "#AnimeTravel",
              "#JapanAdventure", "#TokyoLife", "#SubcultureJapan"
            ].map(tag => (
              <button
                key={tag}
                onClick={() => { navigator.clipboard.writeText(tag); toast.success(`${tag} をコピーしました`); }}
                className="text-sm font-mono text-[oklch(0.72_0.25_330)] bg-[oklch(0.72_0.25_330/10%)] border border-[oklch(0.72_0.25_330/30%)] px-3 py-1 rounded hover:bg-[oklch(0.72_0.25_330/20%)] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="text-xs text-[oklch(0.5_0.04_265)] mt-3 font-mono">クリックで個別コピー</p>
        </div>
      </div>
    </section>
  );
}

function AutomationSection() {
  return (
    <section id="automation" className="py-24 bg-[oklch(0.13_0.025_265)] relative overflow-hidden">
      <div className="absolute inset-0 pixel-grid opacity-15" />
      <div className="container relative z-10">
        <SectionTitle
          label="// Section 06"
          title="半自動化パイプライン設計"
          sub="n8nを活用した「素材アップロード → 動画生成 → 投稿予約」の自動化構想。慣れてきたら段階的に導入できます。"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Pipeline diagram */}
          <div className="neon-card rounded-lg p-6 border border-[oklch(0.85_0.18_195/30%)]">
            <h3 className="text-white font-bold mb-6 font-mono text-sm">// 自動化フロー概念図</h3>
            <div className="space-y-3">
              {[
                { icon: <Upload className="w-4 h-4" />, label: "Google Drive / Airtable", sub: "撮影素材をアップロード（トリガー）", color: "cyan", arrow: true },
                { icon: <Workflow className="w-4 h-4" />, label: "n8n / Zapier Workflow", sub: "ワークフロー自動起動", color: "magenta", arrow: true },
                { icon: <Film className="w-4 h-4" />, label: "動画編集 AI API", sub: "RunwayML / Synthesia で字幕・ナレーション付き動画を生成", color: "amber", arrow: false },
                { icon: <Bot className="w-4 h-4" />, label: "ChatGPT API", sub: "キャプション・ハッシュタグを自動生成", color: "green", arrow: false },
                { icon: <Instagram className="w-4 h-4" />, label: "Instagram Graph API", sub: "指定日時にリールを自動投稿予約", color: "cyan", arrow: false },
              ].map((node, i) => {
                const c = colorMap[node.color];
                return (
                  <div key={i}>
                    <div className={`flex items-center gap-3 p-3 rounded border ${c.border} ${c.bg}`}>
                      <div className={`${c.text}`}>{node.icon}</div>
                      <div>
                        <p className={`text-sm font-bold ${c.text}`}>{node.label}</p>
                        <p className="text-xs text-[oklch(0.55_0.04_265)]">{node.sub}</p>
                      </div>
                    </div>
                    {node.arrow && (
                      <div className="flex justify-center py-1">
                        <div className="w-px h-4 bg-[oklch(0.85_0.18_195/40%)]" />
                      </div>
                    )}
                    {!node.arrow && i < 4 && (
                      <div className="flex justify-center py-1">
                        <div className="w-px h-4 bg-[oklch(0.85_0.18_195/40%)]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            <div className="neon-card rounded-lg p-5 border border-[oklch(0.28_0.05_265/60%)]">
              <h3 className="text-white font-bold mb-4">現状のワークフロー（手動）</h3>
              <div className="flex flex-wrap gap-2 items-center text-sm font-mono">
                {["撮影", "CapCut編集", "ElevenLabs音声", "CapCut結合", "ChatGPT投稿文", "手動投稿"].map((step, i, arr) => (
                  <>
                    <span key={step} className="text-[oklch(0.6_0.04_265)] bg-[oklch(0.22_0.03_265)] px-2 py-1 rounded text-xs">{step}</span>
                    {i < arr.length - 1 && <ArrowRight key={`arrow-${i}`} className="w-3 h-3 text-[oklch(0.4_0.04_265)]" />}
                  </>
                ))}
              </div>
            </div>

            <div className="neon-card rounded-lg p-5 border border-[oklch(0.85_0.18_195/40%)] shadow-[0_0_20px_oklch(0.85_0.18_195/15%)]">
              <h3 className="text-white font-bold mb-4">半自動化後のワークフロー</h3>
              <div className="flex flex-wrap gap-2 items-center text-sm font-mono">
                {["撮影", "Google Driveアップロード"].map((step, i, arr) => (
                  <>
                    <span key={step} className="text-[oklch(0.85_0.18_195)] bg-[oklch(0.85_0.18_195/10%)] border border-[oklch(0.85_0.18_195/40%)] px-2 py-1 rounded text-xs">{step}</span>
                    {i < arr.length - 1 && <ArrowRight key={`arrow-${i}`} className="w-3 h-3 text-[oklch(0.85_0.18_195)]" />}
                  </>
                ))}
                <ArrowRight className="w-3 h-3 text-[oklch(0.85_0.18_195)]" />
                <span className="text-[oklch(0.82_0.18_65)] bg-[oklch(0.82_0.18_65/10%)] border border-[oklch(0.82_0.18_65/40%)] px-3 py-1 rounded text-xs font-bold">🤖 あとは全自動</span>
              </div>
              <p className="text-xs text-[oklch(0.5_0.04_265)] mt-3">素材をアップロードするだけで、編集から投稿予約まで自動完了</p>
            </div>

            <div className="space-y-3">
              {[
                { step: "Step 1", title: "n8nを導入", desc: "クラウド版（n8n.io）またはセルフホスト版を選択。無料プランで試せます。", color: "cyan" },
                { step: "Step 2", title: "Google Drive連携", desc: "特定フォルダへのアップロードをトリガーとして設定。", color: "magenta" },
                { step: "Step 3", title: "AI API連携", desc: "ElevenLabs・ChatGPT APIキーを取得してn8nに設定。", color: "amber" },
                { step: "Step 4", title: "Instagram API設定", desc: "Meta for Developersでアプリを作成し、Graph APIを有効化。", color: "green" },
              ].map((item, i) => {
                const c = colorMap[item.color];
                return (
                  <div key={i} className={`flex gap-3 p-3 rounded border ${c.border} ${c.bg}`}>
                    <span className={`text-xs font-mono font-bold ${c.text} flex-shrink-0 mt-0.5`}>{item.step}</span>
                    <div>
                      <p className="text-white text-sm font-bold">{item.title}</p>
                      <p className="text-[oklch(0.6_0.04_265)] text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[oklch(0.28_0.05_265/60%)] py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-black text-xl mb-1">Akihabara Reels Studio</h3>
            <p className="text-[oklch(0.5_0.04_265)] text-sm font-mono">AI-Powered Instagram Reels Workflow Guide</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[oklch(0.5_0.04_265)]">
            <a href="#tools" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">AIツール</a>
            <a href="#templates" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">テンプレート</a>
            <a href="#workflow" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">ワークフロー</a>
            <a href="#script" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">台本サンプル</a>
            <a href="#catchphrases" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">コピー集</a>
            <a href="#automation" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">自動化</a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[oklch(0.28_0.05_265/30%)] text-center">
          <p className="text-[oklch(0.35_0.04_265)] text-xs font-mono">
            © 2026 Akihabara Reels Studio — Built for Akihabara Tour Marketing
          </p>
        </div>
      </div>
    </footer>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[oklch(0.1_0.025_265/90%)] backdrop-blur-md border-b border-[oklch(0.28_0.05_265/60%)]" : ""}`}>
      <div className="container py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[oklch(0.85_0.18_195)]" />
          <span className="font-black text-white text-sm tracking-wide">AKIHABARA REELS STUDIO</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-[oklch(0.6_0.04_265)]">
          <a href="#tools" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">TOOLS</a>
          <a href="#templates" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">TEMPLATES</a>
          <a href="#workflow" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">WORKFLOW</a>
          <a href="#script" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">SCRIPT</a>
          <a href="#automation" className="hover:text-[oklch(0.85_0.18_195)] transition-colors">AUTOMATION</a>
        </div>
      </div>
    </nav>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.1_0.025_265)]">
      <NavBar />
      <HeroSection />
      <ToolsSection />
      <TemplatesSection />
      <WorkflowSection />
      <ScriptSection />
      <CatchphraseSection />
      <AutomationSection />
      <Footer />
    </div>
  );
}
