"use client";

import { useState, useEffect, useCallback } from "react";
import { Campaign, getCampaign, saveCampaign } from "@/lib/storage";
import { ChecklistPhase } from "@/data/facebook-checklist";

export function useChecklist(campaignId: string, phases: ChecklistPhase[]) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const c = getCampaign(campaignId);
    if (c) setCampaign(c);
  }, [campaignId]);

  const toggleItem = useCallback(
    (itemId: string) => {
      if (!campaign) return;
      const updated = {
        ...campaign,
        checkedItems: {
          ...campaign.checkedItems,
          [itemId]: !campaign.checkedItems[itemId],
        },
      };
      setCampaign(updated);
      saveCampaign(updated);
    },
    [campaign]
  );

  const setNote = useCallback(
    (itemId: string, note: string) => {
      if (!campaign) return;
      const updated = {
        ...campaign,
        notes: {
          ...campaign.notes,
          [itemId]: note,
        },
      };
      setCampaign(updated);
      saveCampaign(updated);
    },
    [campaign]
  );

  const totalItems = phases.reduce((sum, p) => sum + p.items.length, 0);
  const checkedCount = campaign
    ? Object.values(campaign.checkedItems).filter(Boolean).length
    : 0;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const getPhaseProgress = useCallback(
    (phase: ChecklistPhase) => {
      if (!campaign) return { checked: 0, total: phase.items.length };
      const checked = phase.items.filter(
        (item) => campaign.checkedItems[item.id]
      ).length;
      return { checked, total: phase.items.length };
    },
    [campaign]
  );

  return {
    campaign,
    toggleItem,
    setNote,
    progress,
    checkedCount,
    totalItems,
    getPhaseProgress,
  };
}
