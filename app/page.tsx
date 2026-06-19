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

const recordsStorageKey = "rakumon-sns-studio-post-records";
const todayIso = () => new Date().toISOString().slice(0, 10);

const statusOptions = ["Idea", "Draft", "Image Ready", "Scheduled", "Posted"] as const;
type PostStatus = (typeof statusOptions)[number];
type DateFilter = "This Week" | "This Month" | "All";

type DraftForm = {
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

type PostRecord = DraftForm & {
  id: string;
  createdAt: string;
  title: string;
  instagramCaption: string;
  xPost: string;
  hashtags: string;
  imagePrompt: string;
};

const emptyGenerated: GeneratedContent = {
  imageTitle: "",
  imageSubtitle: "",
  instagramCaption: "",
  xPost: "",
  hashtags: "",
  imagePrompt: "",
  recommendedIpAction: ""
};

const defaultForm: DraftForm = {
  postDate: todayIso(),
  platform: "Instagram",
  category: "Study Tips",
  theme: "定期テスト前の5分スタート",
  mainIp: "Rakumon Owl",
  targetAudience: "生徒",
  objective: "勉強開始の心理的ハードルを下げる",
  status: "Idea"
};

const quickTemplates = [
  { name: "Study Tips", tone: "すぐ試せる", category: "Study Tips", audience: "生徒", objective: "今日の勉強を始めやすくする" },
  { name: "質問力", tone: "思考を深める", category: "質問力", audience: "生徒", objective: "わからないことを整理して質問できるようにする" },
  { name: "受験リアル", tone: "共感", category: "受験リアル", audience: "生徒", objective: "不安を抱える受験生を励ます" },
  { name: "保護者向け", tone: "安心", category: "保護者向け", audience: "保護者", objective: "家庭での前向きなサポートを提案する" },
  { name: "塾運営ノート", tone: "実務", category: "塾運営ノート", audience: "塾長", objective: "塾の現場で使える改善メモを共有する" },
  { name: "AI時代", tone: "未来志向", category: "AI時代", audience: "教育関係者", objective: "AI活用と自分で考える力の両立を伝える" }
];

function generateMockContent(form: DraftForm): GeneratedContent {
  const theme = form.theme.trim() || "今日の学び";
  const category = form.category.trim() || "SNS Post";
  const platform = form.platform.trim() || "SNS";
  const audience = form.targetAudience.trim() || "フォロワー";
  const objective = form.objective.trim() || "次の一歩を踏み出す";
  const mainIp = form.mainIp.trim() || "Rakumon Owl";
  const tagBase = category.replace(/\s+/g, "");

  return {
    imageTitle: `${theme}を味方にする`,
    imageSubtitle: `${audience}へ。${objective}ための小さな一歩`,
    instagramCaption: `【${theme}】\n\n${audience}に向けた${category}投稿です。\n\n${objective}には、完璧に整えるより「今日できる1つ」を決めることが大切。${platform}で見返しやすいように、ポイントを短く残しましょう。\n\n保存して、次の行動前にもう一度チェックしてみてください。`,
    xPost: `${theme}。${audience}が${objective}には、今日できる一歩を具体化することが大切。${category}として、迷ったら「まず1つだけ」を合言葉に。`,
    hashtags: `#ラクモン #Rakumon #${tagBase} #${platform}運用 #学習習慣`,
    imagePrompt: `${mainIp}を親しみやすく配置した、${theme}がテーマの${platform}向け教育SNS画像。明るい余白、読みやすい大きな日本語タイトル、${category}らしい落ち着いた配色。`,
    recommendedIpAction: `${mainIp}に「${objective}」を象徴する小物やポーズを加え、${audience}が自分ごと化できる表情にする。`
  };
}

function isWithinFilter(dateValue: string, filter: DateFilter) {
  if (filter === "All") return true;
  const target = new Date(`${dateValue}T00:00:00`);
  const now = new Date();
  if (filter === "This Month") return target.getFullYear() === now.getFullYear() && target.getMonth() === now.getMonth();

  const start = new Date(now);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return target >= start && target < end;
}

export default function Home() {
  const [form, setForm] = useState<DraftForm>(defaultForm);
  const [generated, setGenerated] = useState<GeneratedContent>(() => generateMockContent(defaultForm));
  const [records, setRecords] = useState<PostRecord[]>([]);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("This Month");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    const savedRecords = window.localStorage.getItem(recordsStorageKey);
    if (!savedRecords) return;
    try {
      setRecords(JSON.parse(savedRecords) as PostRecord[]);
    } catch {
      setRecords([]);
    }
  }, []);

  const filteredRecords = useMemo(
    () => records.filter((record) => isWithinFilter(record.postDate, dateFilter)).sort((a, b) => b.postDate.localeCompare(a.postDate)),
    [records, dateFilter]
  );

  function updateField(field: keyof DraftForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function useTemplate(template: (typeof quickTemplates)[number]) {
    setForm((current) => ({
      ...current,
      category: template.category,
      targetAudience: template.audience,
      objective: template.objective,
      status: current.status === "Posted" ? "Draft" : current.status
    }));
    setSavedAt("");
  }

  function generateContent() {
    setGenerated(generateMockContent(form));
  }

  function persistRecords(nextRecords: PostRecord[]) {
    setRecords(nextRecords);
    window.localStorage.setItem(recordsStorageKey, JSON.stringify(nextRecords));
  }

  function saveDraft() {
    const now = new Date().toISOString();
    const id = activeRecordId ?? `post-${Date.now()}`;
    const record: PostRecord = {
      ...form,
      id,
      createdAt: records.find((item) => item.id === id)?.createdAt ?? now,
      title: generated.imageTitle,
      instagramCaption: generated.instagramCaption,
      xPost: generated.xPost,
      hashtags: generated.hashtags,
      imagePrompt: generated.imagePrompt
    };
    persistRecords([record, ...records.filter((item) => item.id !== id)]);
    setActiveRecordId(id);
    setSavedAt(new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
  }

  function loadRecord(record: PostRecord) {
    setActiveRecordId(record.id);
    setForm({
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
      imageTitle: record.title,
      imageSubtitle: generateMockContent(record).imageSubtitle,
      instagramCaption: record.instagramCaption,
      xPost: record.xPost,
      hashtags: record.hashtags,
      imagePrompt: record.imagePrompt,
      recommendedIpAction: generateMockContent(record).recommendedIpAction
    });
    setSavedAt("");
  }

  function startNewPost() {
    const nextForm = { ...defaultForm, postDate: todayIso(), theme: "", status: "Idea" as PostStatus };
    setForm(nextForm);
    setGenerated(emptyGenerated);
    setActiveRecordId(null);
    setSavedAt("");
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <RakumonLogo />
          <div>
            <Badge className="bg-emerald-50 text-emerald-700">Creation + Archive</Badge>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Rakumon SNS Studio</h1>
            <p className="text-sm text-slate-500">テーマから投稿ドラフトを作り、日付付きレコードとして保存・レビューします。</p>
          </div>
        </div>
        <div className="flex gap-3"><Button variant="secondary" onClick={saveDraft}><Icon>💾</Icon> Save Draft</Button><Button onClick={startNewPost}><Icon>✍️</Icon> New Post</Button></div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-5">
          <Card><CardHeader><CardTitle>Quick Templates</CardTitle><CardDescription>カテゴリ・対象・目的だけを提案します。テーマと生成内容は置き換えません。</CardDescription></CardHeader><CardContent className="grid gap-2">{quickTemplates.map((template) => <button key={template.name} type="button" onClick={() => useTemplate(template)} className="rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"><div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-900">{template.name}</span><Badge className="bg-slate-100 text-slate-600">{template.tone}</Badge></div><p className="mt-2 text-xs leading-5 text-slate-500">{template.audience} · {template.objective}</p></button>)}</CardContent></Card>
        </aside>

        <section className="space-y-5">
          <Card><CardHeader className="flex-row items-start justify-between gap-4"><div><CardTitle>Content Editor</CardTitle><CardDescription>Themeを入力してGenerate。出力はすべて編集できます。</CardDescription></div>{savedAt && <Badge className="bg-emerald-50 text-emerald-700">Saved {savedAt}</Badge>}</CardHeader><CardContent className="space-y-5"><div className="grid gap-3 md:grid-cols-2"><div><Label htmlFor="postDate">Post Date</Label><Input id="postDate" type="date" className="mt-2" value={form.postDate} onChange={(event) => updateField("postDate", event.target.value)} /></div><div><Label htmlFor="platform">Platform</Label><Input id="platform" className="mt-2" value={form.platform} onChange={(event) => updateField("platform", event.target.value)} placeholder="Instagram / X / TikTok" /></div><div className="md:col-span-2"><Label htmlFor="theme">Theme</Label><Input id="theme" className="mt-2" value={form.theme} onChange={(event) => updateField("theme", event.target.value)} placeholder="例: 5分だけ始める勉強法" /></div><div><Label htmlFor="category">Category</Label><Input id="category" className="mt-2" value={form.category} onChange={(event) => updateField("category", event.target.value)} /></div><div><Label htmlFor="mainIp">Main IP</Label><Input id="mainIp" className="mt-2" value={form.mainIp} onChange={(event) => updateField("mainIp", event.target.value)} placeholder="Rakumon Owl" /></div><div><Label htmlFor="audience">Target Audience</Label><Input id="audience" className="mt-2" value={form.targetAudience} onChange={(event) => updateField("targetAudience", event.target.value)} /></div><div><Label htmlFor="status">Status</Label><select id="status" className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(event) => updateField("status", event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></div><div className="md:col-span-2"><Label htmlFor="objective">Objective</Label><Input id="objective" className="mt-2" value={form.objective} onChange={(event) => updateField("objective", event.target.value)} /></div></div><div className="flex flex-wrap gap-2"><Button onClick={generateContent}><Icon>✨</Icon> Generate</Button><Button variant="secondary" onClick={saveDraft}><Icon>💾</Icon> Save Draft</Button></div></CardContent></Card>

          <Card><CardHeader><CardTitle>Editable Mock Output</CardTitle><CardDescription>OpenAI接続前のモック生成です。保存するとアーカイブに記録されます。</CardDescription></CardHeader><CardContent className="grid gap-4"><div><Label>Image Title</Label><Input className="mt-2" value={generated.imageTitle} onChange={(event) => setGenerated((current) => ({ ...current, imageTitle: event.target.value }))} /></div><div><Label>Image Subtitle</Label><Input className="mt-2" value={generated.imageSubtitle} onChange={(event) => setGenerated((current) => ({ ...current, imageSubtitle: event.target.value }))} /></div><div><Label>Instagram Caption</Label><Textarea className="mt-2 min-h-32" value={generated.instagramCaption} onChange={(event) => setGenerated((current) => ({ ...current, instagramCaption: event.target.value }))} /></div><div><Label>X Post</Label><Textarea className="mt-2" value={generated.xPost} onChange={(event) => setGenerated((current) => ({ ...current, xPost: event.target.value }))} /></div><div><Label>Hashtags</Label><Input className="mt-2" value={generated.hashtags} onChange={(event) => setGenerated((current) => ({ ...current, hashtags: event.target.value }))} /></div><div><Label>Image Prompt</Label><Textarea className="mt-2" value={generated.imagePrompt} onChange={(event) => setGenerated((current) => ({ ...current, imagePrompt: event.target.value }))} /></div><div><Label>Recommended IP Action</Label><Textarea className="mt-2" value={generated.recommendedIpAction} onChange={(event) => setGenerated((current) => ({ ...current, recommendedIpAction: event.target.value }))} /></div></CardContent></Card>

          <Card><CardHeader className="flex-row items-start justify-between gap-4"><div><CardTitle>Post Record Archive</CardTitle><CardDescription>保存済みレコードを日付でレビュー。行をクリックするとエディタに戻せます。</CardDescription></div><div className="flex gap-2">{(["This Week", "This Month", "All"] as DateFilter[]).map((filter) => <Button key={filter} size="sm" variant={dateFilter === filter ? "default" : "secondary"} onClick={() => setDateFilter(filter)}>{filter}</Button>)}</div></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="border-b text-xs uppercase tracking-wide text-slate-500"><tr><th className="py-3">Post Date</th><th>Platform</th><th>Category</th><th>Theme</th><th>Title</th><th>Main IP</th><th>Audience</th><th>Objective</th><th>Status</th></tr></thead><tbody>{filteredRecords.map((record) => <tr key={record.id} onClick={() => loadRecord(record)} className="cursor-pointer border-b last:border-0 hover:bg-emerald-50/60"><td className="py-3 font-medium">{record.postDate}</td><td>{record.platform}</td><td>{record.category}</td><td>{record.theme}</td><td>{record.title}</td><td>{record.mainIp}</td><td>{record.targetAudience}</td><td>{record.objective}</td><td><Badge className="bg-slate-100 text-slate-700">{record.status}</Badge></td></tr>)}{filteredRecords.length === 0 && <tr><td colSpan={9} className="py-8 text-center text-slate-500">No saved records for this filter.</td></tr>}</tbody></table></div></CardContent></Card>
        </section>
      </section>
    </main>
  );
}
