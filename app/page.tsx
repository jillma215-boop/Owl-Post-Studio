"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RakumonLogo } from "@/components/rakumon-logo";

function Icon({ children }: { children: string }) {
  return <span aria-hidden="true" className="inline-flex text-base leading-none">{children}</span>;
}

const draftStorageKey = "rakumon-sns-studio-daily-draft";

const quickTemplates = [
  { name: "Study Tips", tone: "すぐ試せる", prompt: "今日の勉強を始めやすくする、小さな学習Tipsを1つ紹介する。" },
  { name: "質問力", tone: "思考を深める", prompt: "生徒がよい質問を作るための問いかけ例を紹介する。" },
  { name: "受験リアル", tone: "共感", prompt: "受験期にありがちな不安と、その向き合い方を等身大に書く。" },
  { name: "保護者向け", tone: "安心", prompt: "保護者が子どもを見守るときの声かけをやさしく提案する。" },
  { name: "塾運営ノート", tone: "実務", prompt: "塾の現場で使える運営改善メモを短くまとめる。" },
  { name: "AI時代", tone: "未来志向", prompt: "AI時代の学び方と、人が伸ばすべき力について投稿する。" },
  { name: "Owl Motivation", tone: "励まし", prompt: "Owlの視点で、今日もう一歩進むための短い応援文を書く。" }
];

const themeLibrary = [
  { title: "5分だけ始める", platform: "Instagram", format: "Carousel", audience: "生徒", idea: "勉強開始の心理的ハードルを下げる保存型投稿" },
  { title: "質問の型3選", platform: "X", format: "Thread", audience: "生徒", idea: "わからないを整理する質問テンプレート" },
  { title: "親が言わない勇気", platform: "Instagram", format: "Single", audience: "保護者", idea: "見守りと介入のバランスを伝える" },
  { title: "面談前チェック", platform: "X", format: "Checklist", audience: "塾長", idea: "保護者面談前に確認したい学習ログ" },
  { title: "AIと自学力", platform: "TikTok", format: "Short", audience: "教育関係者", idea: "AIを使うほど大切になる自分で考える力" },
  { title: "今週の小さな勝ち", platform: "Instagram", format: "Story", audience: "生徒", idea: "達成を言語化して継続につなげる" }
];

const kanbanColumns = [
  { title: "Ideas", items: [{ title: "AI時代のノート術", meta: "TikTok · 教育関係者" }, { title: "質問力を育てる一言", meta: "X · 生徒" }] },
  { title: "Drafts", items: [{ title: "保護者向け声かけ集", meta: "Instagram · 保護者" }, { title: "受験リアル：眠れない夜", meta: "Instagram · 生徒" }] },
  { title: "Ready", items: [{ title: "5分スタート Study Tips", meta: "Carousel · 6/22" }] },
  { title: "Posted", items: [{ title: "塾運営ノート：面談ログ", meta: "X · 6/18" }] }
];

const weekPlan = ["質問力", "Study Tips", "保護者向け", "AI時代", "受験リアル", "Owl Motivation", "塾運営ノート"];

export default function Home() {
  const [draft, setDraft] = useState("定期テスト前、なかなか机に向かえない生徒へ。小さな開始ハードルを下げる投稿。");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);
    if (savedDraft) setDraft(savedDraft);
  }, []);

  const selectedTemplate = useMemo(
    () => quickTemplates.find((template) => draft.includes(template.name) || draft.includes(template.prompt)) ?? quickTemplates[0],
    [draft]
  );

  function useTemplate(prompt: string) {
    setDraft(prompt);
  }

  function saveDraft() {
    window.localStorage.setItem(draftStorageKey, draft);
    setSavedAt(new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1500px] px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-emerald-100/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <RakumonLogo />
          <div>
            <Badge className="bg-emerald-50 text-emerald-700">Daily Content Workspace</Badge>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Rakumon SNS Studio</h1>
            <p className="text-sm text-slate-500">Notionのように書き、Bufferのように整え、Trelloのように進める投稿制作スペース。</p>
          </div>
        </div>
        <div className="flex gap-3"><Button variant="secondary" onClick={saveDraft}><Icon>💾</Icon> Save Draft</Button><Button><Icon>✍️</Icon> New Post</Button></div>
      </header>

      <section className="grid gap-5 xl:grid-cols-[310px_minmax(460px,1fr)_380px]">
        <aside className="space-y-5 xl:sticky xl:top-6 xl:h-[calc(100vh-8rem)] xl:overflow-auto">
          <Card><CardHeader><CardTitle>Quick Templates</CardTitle><CardDescription>今日の投稿タイプを選んで書き始めます。</CardDescription></CardHeader><CardContent className="grid gap-2">{quickTemplates.map((template) => <button key={template.name} onClick={() => useTemplate(`${template.name}: ${template.prompt}`)} className="rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-900">{template.name}</span><Badge className="bg-slate-100 text-slate-600">{template.tone}</Badge></div><p className="mt-2 text-xs leading-5 text-slate-500">{template.prompt}</p></button>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Today&apos;s Suggestion</CardTitle><CardDescription>保存されやすいテーマから毎日の起点を提案。</CardDescription></CardHeader><CardContent><div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-50 p-4"><Badge className="bg-white text-emerald-700">{selectedTemplate.name}</Badge><h2 className="mt-4 text-xl font-bold text-slate-950">「5分だけ始める」を今日の合言葉に</h2><p className="mt-3 text-sm leading-6 text-slate-600">最初の行動を小さくすると、学習習慣は続きやすくなります。投稿では具体的な机に向かう儀式を1つ提案しましょう。</p></div></CardContent></Card>
        </aside>

        <section className="space-y-5">
          <Card><CardHeader className="flex-row items-start justify-between gap-4"><div><CardTitle>Writing Desk</CardTitle><CardDescription>AI連携はまだ使わず、モックデータと手書きで投稿案を育てます。</CardDescription></div>{savedAt && <Badge className="bg-emerald-50 text-emerald-700">Saved {savedAt}</Badge>}</CardHeader><CardContent className="space-y-4"><div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4"><Label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Draft Canvas</Label><Textarea className="mt-3 min-h-44 border-0 bg-white text-base leading-7 shadow-inner" value={draft} onChange={(event) => setDraft(event.target.value)} /><div className="mt-3 flex flex-wrap gap-2"><Button onClick={saveDraft}><Icon>💾</Icon> Save Draft</Button><Button variant="secondary"><Icon>🧩</Icon> Mock Preview</Button></div></div><div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-900 p-6 text-white"><div className="mb-16 flex items-center justify-between"><Badge className="bg-white/15 text-white">Instagram Carousel</Badge><RakumonLogo className="h-10 w-10" /></div><h2 className="max-w-md text-4xl font-bold leading-tight">今日の小さな積み上げが、春の合格をつくる</h2><p className="mt-4 text-white/72">5分だけ机に向かう習慣づくり</p></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Theme Library</CardTitle><CardDescription>繰り返し使えるSNSテーマをストック。</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{themeLibrary.map((theme) => <article key={theme.title} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-slate-950">{theme.title}</h3><Badge className="bg-emerald-50 text-emerald-700">{theme.platform}</Badge></div><p className="mt-2 text-sm leading-6 text-slate-600">{theme.idea}</p><p className="mt-3 text-xs font-semibold text-slate-400">{theme.format} · {theme.audience}</p></article>)}</CardContent></Card>
        </section>

        <aside className="space-y-5">
          <Card><CardHeader><CardTitle>Kanban</CardTitle><CardDescription>企画から投稿完了までを軽く動かせる一覧に。</CardDescription></CardHeader><CardContent className="grid gap-3">{kanbanColumns.map((column) => <div key={column.title} className="rounded-3xl bg-slate-100/70 p-3"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-slate-800">{column.title}</h3><Badge className="bg-white text-slate-600">{column.items.length}</Badge></div><div className="space-y-2">{column.items.map((item) => <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><p className="text-sm font-semibold text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.meta}</p></div>)}</div></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon>🗓️</Icon> Weekly Rhythm</CardTitle></CardHeader><CardContent><div className="grid grid-cols-7 gap-2">{weekPlan.map((day, index) => <div key={day} className="min-h-24 rounded-2xl border border-slate-200 bg-white p-2"><p className="text-xs font-bold text-slate-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</p><div className="mt-3 rounded-xl bg-emerald-50 p-2 text-[11px] font-semibold text-emerald-800">{day}</div></div>)}</div></CardContent></Card>
        </aside>
      </section>
    </main>
  );
}
