import { bonusTable } from './payment-constants';

export function normalizeStatus(data) {
  const raw =
    data?.status ??
    data?.cobranca?.status ??
    data?.cob?.status ??
    data?.pix?.status ??
    data?.data?.status ??
    "";
  return String(raw).trim().toLowerCase();
}

export function isPaidStatus(status) {
  return (
    status.includes("aprov") ||
    status.includes("approved") ||
    status.includes("conclu") ||
    status.includes("completed") ||
    status.includes("paid") ||
    status.includes("liquid") ||
    status.includes("confirm") ||
    status.includes("recebid") ||
    status.includes("success")
  );
}

export function isExpiredOrCanceled(status) {
  return (
    status.includes("expir") ||
    status.includes("expired") ||
    status.includes("cancel") ||
    status.includes("canceled") ||
    status.includes("rejeit") ||
    status.includes("failed")
  );
}

export function getBonus(val) {
  if (!val || isNaN(val)) return 0;
  const found = bonusTable.find((b) => b.value === val);
  return found ? found.bonus : 0;
}

export function getAccountIdFromStorage() {
  if (typeof window === "undefined") return null;

  const directKeys = ["accountId", "account_id", "id", "userId"];
  for (const k of directKeys) {
    const v = localStorage.getItem(k);
    if (v && v !== "undefined" && v !== "null") {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  }

  const jsonKeys = ["profile", "user", "me", "session"];
  for (const k of jsonKeys) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw);
      const cand =
        obj?.accountId ??
        obj?.account_id ??
        obj?.id ??
        obj?.account?.id ??
        obj?.user?.id ??
        obj?.data?.id;
      const n = parseInt(String(cand || ""), 10);
      if (!Number.isNaN(n) && n > 0) return n;
    } catch (_) {}
  }

  return null;
}
