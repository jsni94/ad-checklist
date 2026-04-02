export interface Campaign {
  id: string;
  name: string;
  platform: "facebook" | "karrot" | "youtube";
  createdAt: string;
  checkedItems: Record<string, boolean>;
  notes: Record<string, string>;
}

const STORAGE_KEY = "ad-checklist-campaigns";

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
