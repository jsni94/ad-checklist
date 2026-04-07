export interface Campaign {
  id: string;
  name: string;
  platform: "facebook" | "karrot" | "youtube";
  createdAt: string;
  checkedItems: Record<string, boolean>;
  notes: Record<string, string>;
}

// --- Karrot CPA specific types ---

export interface KarrotMerchant {
  id: string;
  campaignId: string;
  merchantName: string;
  cpaPlat: string;
  cpaAmount: number;
  approvalType: "confirmed" | "approval";
  medium: string;
  status: "active" | "paused" | "ended";
  startDate: string;
  creatives: KarrotCreative[];
}

export interface KarrotCreative {
  id: string;
  name: string;
  active: boolean;
  memo: string;
  ctr?: number;
  cpc?: number;
  clicks?: number;
}

export interface DailyMetric {
  date: string; // YYYY-MM-DD
  campaignId: string;
  adSpend: number;
  dbCount: number;
  approvedCount: number;
  revenue: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
}

// --- Storage keys ---
const STORAGE_KEY = "ad-checklist-campaigns";
const MERCHANTS_KEY = "ad-checklist-merchants";
const METRICS_KEY = "ad-checklist-metrics";

// --- Campaign CRUD ---

export function getCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getCampaign(id: string): Campaign | undefined {
  return getCampaigns().find((c) => c.id === id);
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  const idx = campaigns.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) {
    campaigns[idx] = campaign;
  } else {
    campaigns.push(campaign);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export function createCampaign(
  name: string,
  platform: Campaign["platform"]
): Campaign {
  return {
    id: crypto.randomUUID(),
    name,
    platform,
    createdAt: new Date().toISOString(),
    checkedItems: {},
    notes: {},
  };
}

// --- Merchant CRUD ---

export function getMerchants(campaignId: string): KarrotMerchant[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(MERCHANTS_KEY);
  const all: KarrotMerchant[] = raw ? JSON.parse(raw) : [];
  return all.filter((m) => m.campaignId === campaignId);
}

export function saveMerchant(merchant: KarrotMerchant): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(MERCHANTS_KEY);
  const all: KarrotMerchant[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex((m) => m.id === merchant.id);
  if (idx >= 0) {
    all[idx] = merchant;
  } else {
    all.push(merchant);
  }
  localStorage.setItem(MERCHANTS_KEY, JSON.stringify(all));
}

export function deleteMerchant(id: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(MERCHANTS_KEY);
  const all: KarrotMerchant[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(
    MERCHANTS_KEY,
    JSON.stringify(all.filter((m) => m.id !== id))
  );
}

// --- Daily Metrics CRUD ---

export function getMetrics(campaignId: string): DailyMetric[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(METRICS_KEY);
  const all: DailyMetric[] = raw ? JSON.parse(raw) : [];
  return all.filter((m) => m.campaignId === campaignId);
}

export function getMetricsByMonth(
  campaignId: string,
  year: number,
  month: number
): DailyMetric[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return getMetrics(campaignId).filter((m) => m.date.startsWith(prefix));
}

export function saveMetric(metric: DailyMetric): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(METRICS_KEY);
  const all: DailyMetric[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex(
    (m) => m.date === metric.date && m.campaignId === metric.campaignId
  );
  if (idx >= 0) {
    all[idx] = metric;
  } else {
    all.push(metric);
  }
  localStorage.setItem(METRICS_KEY, JSON.stringify(all));
}
