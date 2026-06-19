import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


function Icon({ children }: { children: string }) { return <span aria-hidden="true" className="inline-flex text-base leading-none">{children}</span>; }

const settings = {
  Category: ["Owl Diary", "Study Tips", "塾運営ノート", "Owl Motivation", "受験リアル"],
  Platform: ["Instagram", "X", "TikTok"],
  "Main IP": ["Mori", "Sen", "Raku", "Gumi", "Yosi"],
  "Target Audience": ["生徒", "保護者", "塾長", "教育関係者"],
  Objective: ["共感獲得", "保存数向上", "ToB認知向上", "導入相談獲得"]
};

const generated = [
  ["Image Title", "今日の小さな積み上げが、春の合格をつくる"],
  ["Image Subtitle", "Rakuと一緒に、5分だけ机に向かう習慣づくり"],
  ["Instagram Caption", "勉強の最初の一歩は、完璧な計画ではなく“今日も始めた”という事実。Rakumonは生徒の小さな達成を見逃さず、次の行動へつなげます。"],
  ["X Post", "合格に近づく生徒ほど、派手な努力より“続けられる仕組み”を持っています。今日の5分を一緒に設計しましょう。#Rakumon"],
  ["Hashtags", "#受験勉強 #学習習慣 #塾運営 #教育DX #Rakumon"],
  ["Image Generation Prompt", "Clean Japanese education SaaS visual, friendly owl mascot Raku, warm desk light, notebooks, soft mint and ivory palette, Apple-like minimal composition"],
  ["Recommended IP Action", "Rakuがノート横でタイマーを持ち、生徒の一歩を応援するポーズ"]
];

const rows = [
  { title: "保護者向け学習習慣カルーセル", platform: "Instagram", ip: "Raku", status: "Draft", date: "6/22" },
  { title: "塾長向け導入事例スレッド", platform: "X", ip: "Mori", status: "Image Ready", date: "6/23" },
  { title: "受験リアル：朝学習ルーティン", platform: "TikTok", ip: "Sen", status: "Scheduled", date: "6/24" },
  { title: "Owl Diary 月曜の一言", platform: "Instagram", ip: "Gumi", status: "Idea", date: "6/25" }
];
const statuses = ["Idea", "Draft", "Image Ready", "Scheduled", "Posted"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function SelectLike({ label, values }: { label: string; values: string[] }) {
  return <div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</Label><select className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70">{values.map((value) => <option key={value}>{value}</option>)}</select></div>;
}

export default function Home() {
  return <main className="mx-auto min-h-screen max-w-[1600px] px-5 py-6 lg:px-8">
    <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white"><Icon>🦉</Icon></div><div><Badge className="bg-teal-50 text-teal-700">Rakumon Marketing Operations</Badge><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Rakumon SNS Studio</h1><p className="text-sm text-slate-500">AI-powered SNS content generation and management platform.</p></div></div>
      <div className="flex gap-3"><Button variant="secondary"><Icon>📊</Icon> Analytics</Button><Button><Icon>✨</Icon> Generate Content</Button></div>
    </header>

    <section className="grid gap-5 xl:grid-cols-[340px_minmax(460px,1fr)_420px]">
      <Card className="xl:sticky xl:top-6 xl:h-[calc(100vh-8rem)] xl:overflow-auto"><CardHeader><CardTitle>Content Settings</CardTitle><CardDescription>投稿の文脈を選び、Rakumonらしい表現へ調整します。</CardDescription></CardHeader><CardContent className="space-y-4">{Object.entries(settings).map(([label, values]) => <SelectLike key={label} label={label} values={values} />)}<div className="space-y-2"><Label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Theme Input</Label><Textarea placeholder="例：定期テスト前に学習計画を立てられない生徒への励まし" defaultValue="定期テスト前、なかなか机に向かえない生徒へ。小さな開始ハードルを下げる投稿。" /></div><Button className="w-full"><Icon>✍️</Icon> AI Draftを作成</Button></CardContent></Card>

      <Card><CardHeader className="flex-row items-start justify-between gap-4"><div><CardTitle>Generated Content</CardTitle><CardDescription>画像・キャプション・投稿文・生成プロンプトを一括生成。</CardDescription></div><Badge className="bg-amber-50 text-amber-700">Mock AI Output</Badge></CardHeader><CardContent className="space-y-4"><div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-800 to-teal-900 p-6 text-white"><div className="mb-16 flex items-center justify-between"><Badge className="bg-white/15 text-white">Instagram Carousel</Badge><Icon>🎨</Icon></div><h2 className="max-w-md text-4xl font-bold leading-tight">今日の小さな積み上げが、春の合格をつくる</h2><p className="mt-4 text-white/72">Rakuと一緒に、5分だけ机に向かう習慣づくり</p></div>{generated.map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500"><Icon>✨</Icon>{label}</div><p className="text-sm leading-6 text-slate-800">{value}</p></div>)}</CardContent></Card>

      <div className="space-y-5"><Card><CardHeader><CardTitle>Content Management</CardTitle><CardDescription>企画から投稿完了までの進行を管理します。</CardDescription></CardHeader><CardContent><div className="space-y-3">{rows.map((row) => <div key={row.title} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-slate-900">{row.title}</p><p className="mt-1 text-xs text-slate-500">{row.platform} · {row.ip} · {row.date}</p></div><Badge className="bg-slate-950 text-white">{row.status}</Badge></div></div>)}</div></CardContent></Card>

      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon>🗓️</Icon>Weekly Calendar</CardTitle></CardHeader><CardContent><div className="grid grid-cols-7 gap-2">{days.map((day, index) => <div key={day} className="min-h-24 rounded-2xl border border-slate-200 bg-white p-2"><p className="text-xs font-bold text-slate-400">{day}</p>{index < rows.length && <div className="mt-3 rounded-xl bg-teal-50 p-2 text-[11px] font-semibold text-teal-800">{rows[index].platform}<br />{rows[index].date}</div>}</div>)}</div></CardContent></Card>

      <Card><CardHeader><CardTitle>Status Management</CardTitle></CardHeader><CardContent className="space-y-3">{statuses.map((status, index) => <div key={status} className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">{index >= 3 ? <Icon>✓</Icon> : <Icon>•</Icon>}</div><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-950" style={{ width: `${(index + 1) * 18}%` }} /></div><span className="w-24 text-sm font-semibold text-slate-700">{status}</span></div>)}</CardContent></Card>
      </div>
    </section>
  </main>;
}
