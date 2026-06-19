"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RakumonLogo } from "@/components/rakumon-logo";

function Icon({ children }: { children: string }) {
  return <span aria-hidden="true" className="inline-flex text-base leading-none">{children}</span>;
}

const currentDraftStorageKey = "rakumon-sns-studio-current-draft-v2";
const archiveStorageKey = "rakumon-sns-studio-record-archive-v2";
const legacyDraftStorageKey = "rakumon-sns-studio-daily-draft";
const legacyDraftsStorageKey = "rakumon-sns-studio-saved-drafts";

const statusOptions = ["Idea", "Draft", "Image Ready", "Scheduled", "Posted"] as const;
type PostStatus = (typeof statusOptions)[number];
type DateFilter = "This Week" | "This Month" | "All";

type DraftForm = {
  id: string;
  postDate: string;
  platform: string;
  category: string;
  theme: string;
  mainIp: string;
  targetAudience: string;
  objective: string;
  status: PostStatus;
};

type GeneratedContent = {
  imageTitle: string;
  imageSubtitle: string;
  instagramCaption: string;
  xPost: string;
  hashtags: string;
  imagePrompt: string;
  recommendedIpAction: string;
};

type ContentRecord = DraftForm & GeneratedContent & { createdAt: string; title: string };

type LegacyDraft = {
  theme?: string;
  category?: string;
  audience?: string;
  objective?: string;
  generated?: Partial<GeneratedContent>;
  savedAt?: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);
const createRecordId = () => `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const emptyGenerated: GeneratedContent = {
  imageTitle: "",
  imageSubtitle: "",
  instagramCaption: "",
  xPost: "",
  hashtags: "",
  imagePrompt: "",
  recommendedIpAction: ""
};

function createEmptyForm(): DraftForm {
  return {
    id: createRecordId(),
    postDate: todayIso(),
    platform: "Instagram",
    category: "Study Tips",
    theme: "",
    mainIp: "Rakumon",
    targetAudience: "生徒",
    objective: "学習を始めるきっかけを作る",
    status: "Idea"
  };
}

const defaultForm: DraftForm = {
  id: createRecordId(),
  postDate: todayIso(),
  platform: "Instagram",
  category: "Study Tips",
  theme: "定期テスト前の5分スタート",
  mainIp: "Rakumon",
  targetAudience: "生徒",
  objective: "勉強開始の心理的ハードルを下げる",
  status: "Draft"
};

const defaultGenerated: GeneratedContent = {
  imageTitle: "今日の小さな積み上げが、春の合格をつくる",
  imageSubtitle: "5分だけ机に向かう習慣づくり",
  instagramCaption: "最初から完璧に集中しようとしなくても大丈夫。まずは5分だけ、机に向かう約束をしてみよう。小さな一歩が、明日の自信につながります。",
  xPost: "勉強は「やる気が出たら始める」より「5分だけ始める」が強い。小さく始めるほど、続ける自分を作りやすい。",
  hashtags: "#ラクモン #勉強垢 #学習習慣 #定期テスト #StudyTips",
  imagePrompt: "Emerald and slate educational carousel cover with a friendly owl motif, a student desk, soft morning light, and clear Japanese headline space.",
  recommendedIpAction: "Use Rakumon owl mascot and learning habit language; avoid implying guaranteed score improvement."
};

const quickTemplates = [
  { name: "Study Tips", tone: "すぐ試せる", theme: "5分だけ始める勉強法", category: "Study Tips", platform: "Instagram", audience: "生徒", objective: "今日の勉強を始めやすくする", mainIp: "Rakumon Study Habit", prompt: "今日の勉強を始めやすくする、小さな学習Tipsを1つ紹介する。" },
  { name: "質問力", tone: "思考を深める", theme: "よい質問を作る3つの型", category: "質問力", platform: "X", audience: "生徒", objective: "わからないことを整理して質問できるようにする", mainIp: "Rakumon Q&A", prompt: "生徒がよい質問を作るための問いかけ例を紹介する。" },
  { name: "受験リアル", tone: "共感", theme: "受験期の不安との向き合い方", category: "受験リアル", platform: "Instagram", audience: "生徒", objective: "不安を抱える受験生を励ます", mainIp: "Owl Motivation", prompt: "受験期にありがちな不安と、その向き合い方を等身大に書く。" },
  { name: "保護者向け", tone: "安心", theme: "子どもを見守る声かけ", category: "保護者向け", platform: "Instagram", audience: "保護者", objective: "家庭での前向きなサポートを提案する", mainIp: "Rakumon Family", prompt: "保護者が子どもを見守るときの声かけをやさしく提案する。" },
  { name: "塾運営ノート", tone: "実務", theme: "面談前チェックリスト", category: "塾運営ノート", platform: "X", audience: "塾長", objective: "塾の現場で使える改善メモを共有する", mainIp: "Rakumon School Ops", prompt: "塾の現場で使える運営改善メモを短くまとめる。" },
  { name: "AI時代", tone: "未来志向", theme: "AI時代に伸ばしたい自学力", category: "AI時代", platform: "TikTok", audience: "教育関係者", objective: "AI活用と自分で考える力の両立を伝える", mainIp: "Rakumon Future Learning", prompt: "AI時代の学び方と、人が伸ばすべき力について投稿する。" },
  { name: "Owl Motivation", tone: "励まし", theme: "今日もう一歩進むための言葉", category: "Owl Motivation", platform: "Instagram", audience: "生徒", objective: "学習を続ける勇気を届ける", mainIp: "Rakumon Owl", prompt: "Owlの視点で、今日もう一歩進むための短い応援文を書く。" }
];

const themeLibrary = [
  { title: "5分だけ始める", platform: "Instagram", format: "Carousel", audience: "生徒", idea: "勉強開始の心理的ハードルを下げる保存型投稿" },
  { title: "質問の型3選", platform: "X", format: "Thread", audience: "生徒", idea: "わからないを整理する質問テンプレート" },
  { title: "親が言わない勇気", platform: "Instagram", format: "Single", audience: "保護者", idea: "見守りと介入のバランスを伝える" },
  { title: "面談前チェック", platform: "X", format: "Checklist", audience: "塾長", idea: "保護者面談前に確認したい学習ログ" },
  { title: "AIと自学力", platform: "TikTok", format: "Short", audience: "教育関係者", idea: "AIを使うほど大切になる自分で考える力" },
  { title: "今週の小さな勝ち", platform: "Instagram", format: "Story", audience: "生徒", idea: "達成を言語化して継続につなげる" }
];

const weekPlan = ["質問力", "Study Tips", "保護者向け", "AI時代", "受験リアル", "Owl Motivation", "塾運営ノート"];

function generateMockContent({ theme, category, platform, targetAudience, objective, mainIp }: DraftForm): GeneratedContent {
  const topic = theme.trim() || "今日の学び";
  const target = targetAudience.trim() || "フォロワー";
  const goal = objective.trim() || "次の一歩を踏み出す";
  const channel = platform.trim() || "SNS";
  const ip = mainIp.trim() || "Rakumon";
  const tagBase = (category || topic).replace(/[\s#.,/\\]+/g, "");

  return {
    imageTitle: `${topic}を味方にする`,
    imageSubtitle: `${target}へ届けたい、${channel}で伝わる小さな一歩`,
    instagramCaption: `【${topic}】\n\n${target}に伝えたいのは、完璧な準備よりも「まず動ける形」を作ること。\n\n${goal}ために、今日できる行動をひとつだけ小さくしてみましょう。\n\n${ip}の視点で、迷ったときに見返せる保存版として届けます。`,
    xPost: `${topic}は、大きく変えようとしなくてOK。${target}が${goal}には、今日できる一歩を具体的に決めることが大切。${ip}らしく、小さく始めて続けられる形へ。`,
    hashtags: `#ラクモン #Rakumon #${tagBase || "学習"} #${channel.replace(/\s+/g, "")} #SNS投稿`,
    imagePrompt: `${channel} post visual about "${topic}" for ${target}. Use emerald, slate, and warm white colors, friendly owl-inspired education branding, clean Japanese headline space, and an encouraging modern study atmosphere.`,
    recommendedIpAction: `${ip}のブランド要素を使い、${category || "教育"}領域の専門性を示す。成果保証・過度な断定は避け、${target}が実行できる表現に調整する。`
  };
}

function toRecord(form: DraftForm, generated: GeneratedContent, existingCreatedAt?: string): ContentRecord {
  return { ...form, ...generated, title: generated.imageTitle || form.theme || "Untitled post", createdAt: existingCreatedAt ?? new Date().toISOString() };
}

function getWeekStart(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function isInFilter(postDate: string, filter: DateFilter) {
  if (filter === "All") return true;
  const date = new Date(`${postDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (filter === "This Month") return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  const start = getWeekStart(now);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

export default function Home() {
  const [form, setForm] = useState<DraftForm>(defaultForm);
  const [generated, setGenerated] = useState<GeneratedContent>(defaultGenerated);
  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState<DateFilter>("This Week");

  useEffect(() => {
    const savedCurrent = window.localStorage.getItem(currentDraftStorageKey);
    if (savedCurrent) {
      try {
        const parsed = JSON.parse(savedCurrent) as { form?: DraftForm; generated?: GeneratedContent };
        if (parsed.form) setForm({ ...createEmptyForm(), ...parsed.form, postDate: parsed.form.postDate || todayIso() });
        if (parsed.generated) setGenerated({ ...emptyGenerated, ...parsed.generated });
      } catch {
        setStatusMessage("Could not load the last draft");
      }
    }

    const savedArchive = window.localStorage.getItem(archiveStorageKey);
    if (savedArchive) {
      try {
        const parsedRecords = JSON.parse(savedArchive) as ContentRecord[];
        if (Array.isArray(parsedRecords)) setRecords(parsedRecords);
        return;
      } catch {
        setRecords([]);
      }
    }

    const legacyDraftList = window.localStorage.getItem(legacyDraftsStorageKey);
    const legacySingleDraft = window.localStorage.getItem(legacyDraftStorageKey);
    const legacySource = legacyDraftList ?? (legacySingleDraft ? `[${legacySingleDraft}]` : "");
    if (!legacySource) return;

    try {
      const legacyRecords = (JSON.parse(legacySource) as LegacyDraft[]).map((legacy) => {
        const legacyForm: DraftForm = {
          ...createEmptyForm(),
          theme: legacy.theme ?? "",
          category: legacy.category ?? "Study Tips",
          targetAudience: legacy.audience ?? "生徒",
          objective: legacy.objective ?? "学習を始めるきっかけを作る",
          status: "Draft"
        };
        const legacyGenerated = { ...emptyGenerated, ...legacy.generated };
        return toRecord(legacyForm, legacyGenerated, legacy.savedAt ? new Date().toISOString() : undefined);
      });
      setRecords(legacyRecords);
      window.localStorage.setItem(archiveStorageKey, JSON.stringify(legacyRecords));
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(currentDraftStorageKey, JSON.stringify({ form, generated }));
  }, [form, generated]);

  const selectedTemplate = useMemo(
    () => quickTemplates.find((template) => form.category === template.category) ?? quickTemplates[0],
    [form.category]
  );

  const filteredRecords = useMemo(
    () => records.filter((record) => isInFilter(record.postDate, activeFilter)),
    [records, activeFilter]
  );

  function updateField<K extends keyof DraftForm>(field: K, value: DraftForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function useTemplate(template: (typeof quickTemplates)[number]) {
    const nextForm: DraftForm = {
      ...form,
      platform: template.platform,
      theme: template.theme,
      category: template.category,
      targetAudience: template.audience,
      objective: template.objective,
      mainIp: template.mainIp,
      status: "Idea"
    };
    setForm(nextForm);
    setGenerated(generateMockContent(nextForm));
    setStatusMessage(`${template.name} template selected`);
  }

  function generateContent() {
    setGenerated(generateMockContent(form));
    setStatusMessage("Content generated from the current theme, category, platform, audience, and objective");
  }

  function saveDraft() {
    const existing = records.find((record) => record.id === form.id);
    const nextRecord = toRecord(form, generated, existing?.createdAt);
    const nextRecords = existing
      ? records.map((record) => (record.id === nextRecord.id ? nextRecord : record))
      : [nextRecord, ...records];

    setRecords(nextRecords);
    window.localStorage.setItem(archiveStorageKey, JSON.stringify(nextRecords));
    window.localStorage.setItem(currentDraftStorageKey, JSON.stringify({ form, generated }));
    setStatusMessage("Draft saved to the content archive");
  }

  function loadRecord(record: ContentRecord) {
    setForm({
      id: record.id,
      postDate: record.postDate,
      platform: record.platform,
      category: record.category,
      theme: record.theme,
      mainIp: record.mainIp,
      targetAudience: record.targetAudience,
      objective: record.objective,
      status: record.status
    });
    setGenerated({
      imageTitle: record.imageTitle,
      imageSubtitle: record.imageSubtitle,
      instagramCaption: record.instagramCaption,
      xPost: record.xPost,
      hashtags: record.hashtags,
      imagePrompt: record.imagePrompt,
      recommendedIpAction: record.recommendedIpAction
    });
    setStatusMessage(`Loaded "${record.title}" into the editor`);
  }

  function startNewPost() {
    setForm(createEmptyForm());
    setGenerated(emptyGenerated);
    window.localStorage.removeItem(currentDraftStorageKey);
    setStatusMessage("New post started");
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1500px] px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-emerald-100/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <RakumonLogo />
          <div>
            <Badge className="bg-emerald-50 text-emerald-700">Content Creation Workspace</Badge>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Rakumon SNS Studio</h1>
            <p className="text-sm text-slate-500">Content ArchiveとSNS Review Toolを兼ねた投稿制作スペース。</p>
          </div>
        </div>
        <div className="flex gap-3"><Button variant="secondary" onClick={saveDraft}><Icon>💾</Icon> Save Draft</Button><Button onClick={startNewPost}><Icon>✍️</Icon> New Post</Button></div>
      </header>

      {statusMessage && <div role="status" aria-live="polite" className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm">{statusMessage}</div>}

      <section className="grid gap-5 xl:grid-cols-[310px_minmax(460px,1fr)_380px]">
        <aside className="space-y-5 xl:sticky xl:top-6 xl:h-[calc(100vh-8rem)] xl:overflow-auto">
          <Card><CardHeader><CardTitle>Quick Templates</CardTitle><CardDescription>今日の投稿タイプを選んで書き始めます。</CardDescription></CardHeader><CardContent className="grid gap-2">{quickTemplates.map((template) => <button key={template.name} type="button" onClick={() => useTemplate(template)} className="rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50 focus:outline-none focus:ring-4 focus:ring-emerald-100"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-900">{template.name}</span><Badge className="bg-slate-100 text-slate-600">{template.tone}</Badge></div><p className="mt-2 text-xs leading-5 text-slate-500">{template.prompt}</p></button>)}</CardContent></Card>
          <Card><CardHeader><CardTitle>Today&apos;s Suggestion</CardTitle><CardDescription>保存されやすいテーマから毎日の起点を提案。</CardDescription></CardHeader><CardContent><div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-lime-50 p-4"><Badge className="bg-white text-emerald-700">{selectedTemplate.name}</Badge><h2 className="mt-4 text-xl font-bold text-slate-950">「{form.theme || "テーマ未設定"}」を今日の合言葉に</h2><p className="mt-3 text-sm leading-6 text-slate-600">{form.objective || "テーマを入力して、投稿の目的を決めましょう。"}</p></div></CardContent></Card>
        </aside>

        <section className="space-y-5">
          <Card><CardHeader><CardTitle>Writing Desk</CardTitle><CardDescription>Theme、Category、Platform、Audience、Objectiveから投稿案を生成します。</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4"><div className="grid gap-3 md:grid-cols-2"><div className="md:col-span-2"><Label htmlFor="theme" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Theme</Label><Input id="theme" className="mt-2" value={form.theme} onChange={(event) => updateField("theme", event.target.value)} placeholder="例: 5分だけ始める勉強法" /></div><div><Label htmlFor="postDate" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Post Date</Label><Input id="postDate" type="date" className="mt-2" value={form.postDate} onChange={(event) => updateField("postDate", event.target.value)} /></div><div><Label htmlFor="platform" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Platform</Label><Input id="platform" className="mt-2" value={form.platform} onChange={(event) => updateField("platform", event.target.value)} placeholder="Instagram / X / TikTok" /></div><div><Label htmlFor="category" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Category</Label><Input id="category" className="mt-2" value={form.category} onChange={(event) => updateField("category", event.target.value)} placeholder="Study Tips" /></div><div><Label htmlFor="mainIp" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Main IP</Label><Input id="mainIp" className="mt-2" value={form.mainIp} onChange={(event) => updateField("mainIp", event.target.value)} placeholder="Rakumon Owl" /></div><div><Label htmlFor="audience" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Target Audience</Label><Input id="audience" className="mt-2" value={form.targetAudience} onChange={(event) => updateField("targetAudience", event.target.value)} placeholder="生徒 / 保護者 / 塾長" /></div><div><Label htmlFor="status" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Status</Label><select id="status" className="mt-2 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" value={form.status} onChange={(event) => updateField("status", event.target.value as PostStatus)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div><div className="md:col-span-2"><Label htmlFor="objective" className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Objective</Label><Input id="objective" className="mt-2" value={form.objective} onChange={(event) => updateField("objective", event.target.value)} placeholder="投稿で達成したいこと" /></div></div><div className="mt-3 flex flex-wrap gap-2"><Button onClick={generateContent}><Icon>✨</Icon> Generate</Button><Button variant="secondary" onClick={saveDraft}><Icon>💾</Icon> Save Draft</Button></div></div><div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-800 to-emerald-900 p-6 text-white"><div className="mb-16 flex items-center justify-between"><Badge className="bg-white/15 text-white">{form.platform || "SNS"} Review</Badge><RakumonLogo className="h-10 w-10" /></div><h2 className="max-w-md text-4xl font-bold leading-tight">{generated.imageTitle || "Generateで画像タイトルを作成"}</h2><p className="mt-4 text-white/72">{generated.imageSubtitle || "テーマを入力して投稿案を生成しましょう"}</p></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Generated Output</CardTitle><CardDescription>生成後も保存前にすべて編集できます。</CardDescription></CardHeader><CardContent className="grid gap-4"><div><Label>Image Title</Label><Input className="mt-2" value={generated.imageTitle} onChange={(event) => setGenerated((current) => ({ ...current, imageTitle: event.target.value }))} /></div><div><Label>Image Subtitle</Label><Input className="mt-2" value={generated.imageSubtitle} onChange={(event) => setGenerated((current) => ({ ...current, imageSubtitle: event.target.value }))} /></div><div><Label>Instagram Caption</Label><Textarea className="mt-2 min-h-36" value={generated.instagramCaption} onChange={(event) => setGenerated((current) => ({ ...current, instagramCaption: event.target.value }))} /></div><div><Label>X Post</Label><Textarea className="mt-2" value={generated.xPost} onChange={(event) => setGenerated((current) => ({ ...current, xPost: event.target.value }))} /></div><div><Label>Hashtags</Label><Input className="mt-2" value={generated.hashtags} onChange={(event) => setGenerated((current) => ({ ...current, hashtags: event.target.value }))} /></div><div><Label>Image Prompt</Label><Textarea className="mt-2" value={generated.imagePrompt} onChange={(event) => setGenerated((current) => ({ ...current, imagePrompt: event.target.value }))} /></div><div><Label>Recommended IP Action</Label><Textarea className="mt-2" value={generated.recommendedIpAction} onChange={(event) => setGenerated((current) => ({ ...current, recommendedIpAction: event.target.value }))} /></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Content Archive</CardTitle><CardDescription>保存したレコードをクリックするとエディターに戻せます。</CardDescription></CardHeader><CardContent><div className="mb-4 flex flex-wrap gap-2">{(["This Week", "This Month", "All"] as DateFilter[]).map((filter) => <Button key={filter} variant={activeFilter === filter ? "default" : "secondary"} onClick={() => { setActiveFilter(filter); setStatusMessage(`${filter} records shown`); }}>{filter}</Button>)}</div><div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-3 py-3">Post Date</th><th className="px-3 py-3">Platform</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Theme</th><th className="px-3 py-3">Title</th><th className="px-3 py-3">Main IP</th><th className="px-3 py-3">Audience</th><th className="px-3 py-3">Objective</th><th className="px-3 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{filteredRecords.length === 0 ? <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={9}>No saved records for this filter yet.</td></tr> : filteredRecords.map((record) => <tr key={record.id} onClick={() => loadRecord(record)} className="cursor-pointer transition hover:bg-emerald-50/60"><td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">{record.postDate}</td><td className="px-3 py-3">{record.platform}</td><td className="px-3 py-3">{record.category}</td><td className="min-w-44 px-3 py-3 font-semibold text-slate-900">{record.theme || "Untitled theme"}</td><td className="min-w-48 px-3 py-3">{record.title}</td><td className="px-3 py-3">{record.mainIp}</td><td className="px-3 py-3">{record.targetAudience}</td><td className="min-w-52 px-3 py-3 text-slate-600">{record.objective}</td><td className="px-3 py-3"><Badge className="bg-emerald-50 text-emerald-700">{record.status}</Badge></td></tr>)}</tbody></table></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Theme Library</CardTitle><CardDescription>繰り返し使えるSNSテーマをストック。</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{themeLibrary.map((theme) => <article key={theme.title} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-slate-950">{theme.title}</h3><Badge className="bg-emerald-50 text-emerald-700">{theme.platform}</Badge></div><p className="mt-2 text-sm leading-6 text-slate-600">{theme.idea}</p><p className="mt-3 text-xs font-semibold text-slate-400">{theme.format} · {theme.audience}</p></article>)}</CardContent></Card>
        </section>

        <aside className="space-y-5">
          <Card><CardHeader><CardTitle>Archive Snapshot</CardTitle><CardDescription>ステータス別に保存済み投稿を確認。</CardDescription></CardHeader><CardContent className="grid gap-3">{statusOptions.map((status) => {
              const items = records.filter((record) => record.status === status);
              return <div key={status} className="rounded-3xl bg-slate-100/70 p-3"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-slate-800">{status}</h3><Badge className="bg-white text-slate-600">{items.length}</Badge></div><div className="space-y-2">{items.slice(0, 4).map((item) => <button key={item.id} type="button" onClick={() => loadRecord(item)} className="block w-full rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"><p className="text-sm font-semibold text-slate-900">{item.theme || item.title}</p><p className="mt-1 text-xs text-slate-500">{item.platform} · {item.postDate}</p></button>)}{items.length === 0 && <p className="rounded-2xl bg-white p-3 text-xs text-slate-500">No records yet</p>}</div></div>;
            })}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Icon>🗓️</Icon> Weekly Rhythm</CardTitle></CardHeader><CardContent><div className="grid grid-cols-7 gap-2">{weekPlan.map((day, index) => <div key={day} className="min-h-24 rounded-2xl border border-slate-200 bg-white p-2"><p className="text-xs font-bold text-slate-400">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</p><div className="mt-3 rounded-xl bg-emerald-50 p-2 text-[11px] font-semibold text-emerald-800">{day}</div></div>)}</div></CardContent></Card>
        </aside>
      </section>
    </main>
  );
}
