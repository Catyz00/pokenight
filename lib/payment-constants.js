export const paymentMethods = [{ id: "pix", label: "PIX" }];

// URLs da API de pagamento - usa variáveis de ambiente com fallback para desenvolvimento
export const API_BASE = process.env.NEXT_PUBLIC_PAYMENT_API_URL || "http://localhost/api";
export const PIX_CREATE_URL = `${API_BASE}/pix.php`;
export const PIX_CHECK_URL = `${API_BASE}/check-pix.php`;
export const ADD_POINTS_URL = `${API_BASE}/add-premium-points.php`;

// URL do webhook para notificações de pagamento
export const PAYMENT_WEBHOOK_URL = process.env.NEXT_PUBLIC_PAYMENT_WEBHOOK_URL || "https://seu-dominio.com.br/webhook";

export const bonusTable = [
  { value: 7, bonus: 3 },
  { value: 10, bonus: 5 },
  { value: 20, bonus: 10 },
  { value: 30, bonus: 12 },
  { value: 40, bonus: 15 },
  { value: 50, bonus: 20 },
  { value: 60, bonus: 22 },
  { value: 70, bonus: 25 },
  { value: 80, bonus: 30 },
  { value: 90, bonus: 35 },
  { value: 100, bonus: 40 },
  { value: 500, bonus: 200 },
  { value: 1000, bonus: 500 },
  { value: 2000, bonus: 1000 },
];
