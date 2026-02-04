"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [{ id: "pix", label: "PIX" }];

const API_BASE = "http://localhost/api";
const PIX_CREATE_URL = `${API_BASE}/pix.php`;
const PIX_CHECK_URL = `${API_BASE}/check-pix.php`;
const ADD_POINTS_URL = `${API_BASE}/add-premium-points.php`;

function normalizeStatus(data) {
  const raw =
    data?.status ??
    data?.cobranca?.status ??
    data?.cob?.status ??
    data?.pix?.status ??
    data?.data?.status ??
    "";
  return String(raw).trim().toLowerCase();
}

function isPaidStatus(status) {
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

function isExpiredOrCanceled(status) {
  return (
    status.includes("expir") ||
    status.includes("expired") ||
    status.includes("cancel") ||
    status.includes("canceled") ||
    status.includes("rejeit") ||
    status.includes("failed")
  );
}

// ✅ tenta encontrar o accountId em vários lugares comuns
function getAccountIdFromStorage() {
  if (typeof window === "undefined") return null;

  const directKeys = ["accountId", "account_id", "id", "userId"];
  for (const k of directKeys) {
    const v = localStorage.getItem(k);
    if (v && v !== "undefined" && v !== "null") {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  }

  // tenta achar dentro de JSON salvo no storage
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

export default function ComprarPontos() {
  const bonusTable = [
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

  function getBonus(val) {
    if (!val || isNaN(val)) return 0;
    const found = bonusTable.find((b) => b.value === val);
    return found ? found.bonus : 0;
  }

  const { toast } = useToast();

  const [amount, setAmount] = React.useState("10");
  const [method, setMethod] = React.useState(paymentMethods[0].id);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const [cpf, setCpf] = React.useState("");
  const [nome, setNome] = React.useState("");
  const [cupom, setCupom] = React.useState("");

  const [pixData, setPixData] = React.useState(null);
  const [checking, setChecking] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  const [pixStatus, setPixStatus] = React.useState("");
  const [lastCheck, setLastCheck] = React.useState(null);

  const [credited, setCredited] = React.useState(false);
  const [creditError, setCreditError] = React.useState(null);

  // ✅ pega accountId com fallback inteligente
  const [accountId, setAccountId] = React.useState(null);

  React.useEffect(() => {
    const id = getAccountIdFromStorage();
    setAccountId(id);
  }, []);

  const paidRef = React.useRef(false);
  const creditedRef = React.useRef(false);
  const toastOnceRef = React.useRef(false);

  const parsedAmount = Math.max(0, Math.floor(Number(String(amount).replace(/\D/g, "")) || 0));
  const nightcoins = parsedAmount + getBonus(parsedAmount);

  function handleAmountChange(e) {
    const raw = e.target.value;
    // Remove tudo que não é dígito
    const cleaned = raw.replace(/\D/g, "");
    setAmount(cleaned);
    setMessage(null);
  }

  function handleCpfChange(e) {
    setCpf(e.target.value.replace(/\D/g, ""));
  }

  const fireSuccessToast = React.useCallback(() => {
    if (toastOnceRef.current) return;
    toastOnceRef.current = true;

    toast({
      variant: "success",
      title: "Pagamento confirmado!",
      description: "✅ Seus NightCoins serão creditados em instantes.",
    });
  }, [toast]);

  const creditNightCoins = React.useCallback(
    async ({ accId, points, txid }) => {
      if (creditedRef.current) return { ok: true };
      if (!accId || !points || points <= 0) return { ok: false, error: "Dados inválidos para crédito." };

      try {
        const res = await fetch(ADD_POINTS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId: accId, points, txid }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data?.success !== true) {
          const err = data?.error || data?.message || `Falha ao creditar (HTTP ${res.status})`;
          return { ok: false, error: err };
        }

        creditedRef.current = true;
        setCredited(true);
        setCreditError(null);

        toast({
          variant: "success",
          title: "NightCoins creditados!",
          description: `✅ +${points} NightCoin(s) adicionados na sua conta.`,
        });

        return { ok: true };
      } catch (e) {
        return { ok: false, error: "Erro de rede ao creditar NightCoins (verifique CORS/servidor)." };
      }
    },
    [toast]
  );

  const checkPixStatus = async (txid, { silent = false } = {}) => {
    if (!txid) return;

    if (!silent) {
      setChecking(true);
      setMessage({ type: "info", text: "Verificando status do pagamento..." });
    }

    try {
      const res = await fetch(`${PIX_CHECK_URL}?txid=${encodeURIComponent(txid)}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errText = data?.error || data?.message || `Erro HTTP ${res.status}`;
        setPixStatus(`erro: ${errText}`);
        if (!silent) setMessage({ type: "error", text: `Falha ao verificar: ${errText}` });
        return;
      }

      const status = normalizeStatus(data);
      setPixStatus(status || "(sem status)");
      setLastCheck(new Date().toLocaleTimeString("pt-BR"));

      if (isPaidStatus(status)) {
        if (!paidRef.current) {
          paidRef.current = true;
          setPaid(true);
          setMessage(null);
          fireSuccessToast();
        }

        // ✅ usa o pedido salvo (não depende do input atual)
        const accId = pixData?.accountId;
        const points = Number(pixData?.pontos || 0);

        if (!creditedRef.current && accId && points > 0) {
          const result = await creditNightCoins({ accId, points, txid });
          if (!result.ok) {
            setCreditError(result.error);
            setMessage({
              type: "error",
              text: `Pagamento confirmado, mas falhou ao creditar: ${result.error}`,
            });
          }
        }
      } else if (isExpiredOrCanceled(status)) {
        setMessage({ type: "error", text: "❌ Cobrança expirada/cancelada. Gere um novo PIX." });
      } else {
        if (!silent) setMessage({ type: "info", text: "⏳ Ainda aguardando confirmação do pagamento..." });
      }
    } catch (err) {
      setPixStatus("erro: exception");
      if (!silent) setMessage({ type: "error", text: "Erro ao verificar status do pagamento." });
    } finally {
      if (!silent) setChecking(false);
    }
  };

  React.useEffect(() => {
    if (!pixData?.txid) return;

    paidRef.current = false;
    creditedRef.current = false;
    toastOnceRef.current = false;

    setPaid(false);
    setCredited(false);
    setCreditError(null);

    setPixStatus("");
    setLastCheck(null);

    checkPixStatus(pixData.txid, { silent: true });

    const startedAt = Date.now();
    const interval = setInterval(() => {
      if (creditedRef.current) {
        clearInterval(interval);
        return;
      }
      if (Date.now() - startedAt > 10 * 60 * 1000) {
        clearInterval(interval);
        return;
      }
      checkPixStatus(pixData.txid, { silent: true });
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixData?.txid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(null);
    setPixData(null);

    setPaid(false);
    setCredited(false);

    paidRef.current = false;
    creditedRef.current = false;
    toastOnceRef.current = false;

    setPixStatus("");
    setLastCheck(null);
    setCreditError(null);

    if (!cpf || cpf.length !== 11) {
      setMessage({ type: "error", text: "Informe um CPF válido (11 dígitos)." });
      return;
    }
    if (!nome || nome.length < 3) {
      setMessage({ type: "error", text: "Informe o nome completo do pagador." });
      return;
    }
    if (!accountId || accountId <= 0) {
      setMessage({
        type: "error",
        text:
          "Não encontrei seu accountId no navegador. " +
          "Você precisa salvar o id da conta no localStorage como 'accountId' no login (accounts.id).",
      });
      return;
    }
    if (parsedAmount < 1) {
      setMessage({ type: "error", text: "O valor mínimo é R$ 1." });
      return;
    }

    setLoading(true);

    try {
      const referencia = Math.floor(Math.random() * 90000 + 10000).toString();
      const pontosDoPedido = nightcoins;

      const body = {
        valor: Number(parsedAmount).toFixed(2),
        calendario: { expiracao: 3600 },
        isDeposit: false,
        referencia,
        solicitacaoPagador: `Pokenight - Pedido ${referencia}`,
        devedor: { cpf, nome },
        infoAdicionais: [
          { nome: "Order", valor: referencia },
          { nome: "NightCoins", valor: `${pontosDoPedido}` },
          { nome: "AccountId", valor: `${accountId}` },
        ],
        webhookUrl: "https://www.sualoja.com.br/webhook",
      };

      const res = await fetch(PIX_CREATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erro ao gerar cobrança PIX.");
      }

      const normalized = {
        txid: data?.txid || data?.cobranca?.txid || data?.id || data?.transactionId,
        qrcodeBase64: data?.qrcodeBase64 || data?.qrCodeBase64 || data?.qrcode || data?.qr_code_base64,
        pixCopiaECola: data?.pixCopiaECola || data?.copiaecola || data?.payload || data?.brcode,
        raw: data,

        // ✅ salva dados do pedido pra creditar depois
        pontos: pontosDoPedido,
        valor: parsedAmount,
        accountId,
        referencia,
      };

      if (!normalized.txid) {
        console.log("Resposta PIX (debug):", data);
        throw new Error("PIX gerado, mas não veio txid na resposta. Verifique o retorno da Polopag.");
      }

      setPixData(normalized);
      setMessage({ type: "info", text: "PIX gerado. Após pagar, a confirmação aparece automaticamente." });
      setAmount("");
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Erro ao processar pagamento. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const messageClass =
    message?.type === "error"
      ? "bg-destructive/10 text-destructive border border-destructive/30"
      : "bg-muted/50 text-muted-foreground border border-muted";

  const hasQr = !!pixData?.txid && !credited;
  const disableForm = loading || hasQr;

  return (
    <Card className="w-full max-w-none mt-6">
      <CardHeader>
        <CardDescription>
          1 R$ = 1 NightCoin
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[7, 10, 20, 30, 40, 50].map((v) => {
              const b = getBonus(v);
              const isSelected = Number(amount) === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  disabled={disableForm}
                  className={`flex flex-col items-center rounded-md p-2 text-xs transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted hover:bg-muted/80 hover:cursor-pointer'
                  }`}
                >
                  <span className="font-semibold text-base">R$ {v}</span>
                  <span className={isSelected ? 'font-semibold' : 'text-emerald-700 font-semibold'}>
                    +{b} bônus
                  </span>
                </button>
              );
            })}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className={hasQr ? "grid gap-6 md:grid-cols-2" : ""}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="valor-reais">Valor em Reais (R$) - Apenas números inteiros</Label>
                <Input
                  id="valor-reais"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 50"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={disableForm}
                />
                <span className="text-xs text-muted-foreground">Mínimo: R$ 1</span>
                {(() => {
                  const val = Number(amount);
                  const b = getBonus(val);
                  if (val >= 1 && b > 0) {
                    return (
                      <div className="text-xs text-emerald-700 font-semibold mt-1">
                        Você ganhará +{b} bônus
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cupom">Cupom de desconto (opcional)</Label>
                <Input
                  id="cupom"
                  type="text"
                  placeholder="Digite seu cupom"
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value.toUpperCase())}
                  disabled={disableForm}
                />
                {cupom && (
                  <span className="text-xs text-muted-foreground">
                    Cupom será validado ao processar pagamento
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="cpf">CPF do pagador</Label>
                <Input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  placeholder="Somente números"
                  value={cpf}
                  onChange={handleCpfChange}
                  maxLength={11}
                  disabled={disableForm}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="nome">Nome completo do pagador</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={disableForm}
                />
              </div>
            </div>

            <fieldset className="border border-muted rounded-md p-3 mt-1">
              <legend className="text-xs px-1">Método de pagamento</legend>
              <div className="flex gap-4 flex-wrap mt-1">
                {paymentMethods.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="payment"
                      value={p.id}
                      checked={method === p.id}
                      onChange={() => setMethod(p.id)}
                      className="accent-primary"
                      disabled={disableForm}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="bg-muted rounded-md border p-3 text-sm flex flex-col gap-1">
              <div>
                Você vai pagar: <span className="font-semibold">R$ {parsedAmount}</span>
              </div>
              <div>
                Receberá: <span className="font-semibold">{nightcoins} NightCoin(s)</span>
              </div>
            </div>

            <Button type="submit" className="mt-2" disabled={loading || hasQr}>
              {loading ? "Gerando cobrança..." : "Pagar com PIX"}
            </Button>

            {message && message.type !== "success" && (
              <div role="alert" className={`mt-2 rounded-md p-3 text-sm ${messageClass}`}>
                {message.text}
              </div>
            )}

            {pixData?.txid && (
              <div className="text-xs text-muted-foreground mt-1">
                Status: <span className="font-semibold">{pixStatus || "—"}</span>
                {lastCheck ? (
                  <>
                    {" "}
                    • última verificação: <span className="font-semibold">{lastCheck}</span>
                  </>
                ) : null}
              </div>
            )}

            {paid && !credited && (
              <div className="text-xs text-amber-700 font-semibold mt-1">
                Pagamento confirmado. Tentando creditar NightCoins...
              </div>
            )}

            {creditError && (
              <div className="text-xs text-destructive font-semibold mt-1">
                Falha ao creditar: {creditError}
              </div>
            )}

            {hasQr && (
              <Button
                type="button"
                variant="outline"
                className="mt-1"
                onClick={() => {
                  setPixData(null);
                  setMessage(null);
                  setPixStatus("");
                  setLastCheck(null);

                  setPaid(false);
                  setCredited(false);
                  setCreditError(null);

                  paidRef.current = false;
                  creditedRef.current = false;
                  toastOnceRef.current = false;
                }}
              >
                Gerar novo PIX
              </Button>
            )}
          </form>

          {hasQr && (
            <div className="flex flex-col items-center gap-2">
              <img
                src={`data:image/png;base64,${pixData.qrcodeBase64}`}
                alt="QR Code PIX"
                className="mx-auto border rounded-md bg-background"
                width={240}
                height={240}
              />
              {pixData.pixCopiaECola && (
                <div className="mt-4 text-left w-full">
                  <Label htmlFor="pix-copia">Copia e Cola:</Label>
                  <Input
                    id="pix-copia"
                    value={pixData.pixCopiaECola}
                    readOnly
                    className="mt-1 text-xs"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              )}
              <Button
                type="button"
                className="mt-4 w-full"
                onClick={() => checkPixStatus(pixData.txid)}
                disabled={checking}
              >
                {checking ? "Verificando..." : "Verificar pagamento"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
