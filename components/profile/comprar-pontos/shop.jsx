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

export default function ComprarPontos() {
  const { toast } = useToast();

  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState(paymentMethods[0].id);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  const [cpf, setCpf] = React.useState("");
  const [nome, setNome] = React.useState("");

  const [pixData, setPixData] = React.useState(null);
  const [checking, setChecking] = React.useState(false);
  const [paid, setPaid] = React.useState(false);

  const [pixStatus, setPixStatus] = React.useState("");
  const [lastCheck, setLastCheck] = React.useState(null);

  const paidRef = React.useRef(false);
  const toastOnceRef = React.useRef(false);

  const parsedAmount = Math.max(0, Math.floor(Number(amount) || 0));
  const nightcoins = parsedAmount;

  function handleAmountChange(e) {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d.,]/g, "").replace(",", ".");
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
          setMessage(null); // ✅ tira o alerta inline de sucesso
          fireSuccessToast(); // ✅ toast shadcn
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

  // Auto-check a cada 5s após gerar pix (para quando confirmar)
  React.useEffect(() => {
    if (!pixData?.txid) return;

    paidRef.current = false;
    toastOnceRef.current = false;
    setPaid(false);
    setPixStatus("");
    setLastCheck(null);

    checkPixStatus(pixData.txid, { silent: true });

    const startedAt = Date.now();
    const interval = setInterval(() => {
      if (paidRef.current) {
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
    paidRef.current = false;
    toastOnceRef.current = false;

    setPixStatus("");
    setLastCheck(null);

    if (parsedAmount <= 0) {
      setMessage({ type: "error", text: "Informe um valor maior que 0." });
      return;
    }
    if (!cpf || cpf.length !== 11) {
      setMessage({ type: "error", text: "Informe um CPF válido (11 dígitos)." });
      return;
    }
    if (!nome || nome.length < 3) {
      setMessage({ type: "error", text: "Informe o nome completo do pagador." });
      return;
    }

    setLoading(true);

    try {
      const referencia = Math.floor(Math.random() * 90000 + 10000).toString();

      const body = {
        valor: Number(parsedAmount).toFixed(2),
        calendario: { expiracao: 3600 },
        isDeposit: false,
        referencia,
        solicitacaoPagador: `Pokenight - Pedido ${referencia}`,
        devedor: { cpf, nome },
        infoAdicionais: [
          { nome: "Order", valor: referencia },
          { nome: "NightCoins", valor: `${nightcoins}` },
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

  const hasQr = !!pixData?.txid && !paid;
  const disableForm = loading || hasQr;

  return (
    // ✅ Sem max-w e sem mx-auto (some a “margem”/espaço gigante lateral)
    <Card className="w-full max-w-none mt-6">
      <CardHeader>
        <CardTitle>Comprar NightCoins</CardTitle>
        <CardDescription>1 R$ = 1 NightCoin</CardDescription>
      </CardHeader>

      <CardContent>
        {/* ✅ Quando tem QR: 2 colunas (inputs esquerda / QR direita) */}
        <div className={hasQr ? "grid gap-6 md:grid-cols-2" : ""}>
          {/* LEFT */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="valor-reais">Valor em Reais (R$)</Label>
              <Input
                id="valor-reais"
                type="text"
                inputMode="numeric"
                placeholder="Ex: 50"
                value={amount}
                onChange={handleAmountChange}
                disabled={disableForm}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[5, 10, 20, 50, 100].map((v) => (
                <Button
                  type="button"
                  key={v}
                  variant="outline"
                  size="sm"
                  disabled={disableForm}
                  onClick={() => setAmount(String(v))}
                >
                  R$ {v}
                </Button>
              ))}
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

            {/* ✅ Info/Erro continuam inline; sucesso é toast */}
            {message && message.type !== "success" && (
              <div role="alert" className={`mt-2 rounded-md p-3 text-sm ${messageClass}`}>
                {message.text}
              </div>
            )}

            {/* opcional: botão pra gerar novo pix se quiser */}
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
                  paidRef.current = false;
                  toastOnceRef.current = false;
                }}
              >
                Gerar novo PIX
              </Button>
            )}
          </form>

          {/* RIGHT */}
          {hasQr && (
            <div className="rounded-lg border border-muted bg-muted/20 p-4">
              <div className="text-center">
                <div className="font-semibold mb-1">⏳ Aguardando pagamento</div>

                <div className="text-xs text-muted-foreground mb-3">
                  Status: <b>{pixStatus || "—"}</b>{" "}
                  {lastCheck ? `• Última checagem: ${lastCheck}` : ""}
                </div>

                {pixData.qrcodeBase64 && (
                  <>
                    <div className="font-semibold mb-2">Escaneie o QR Code:</div>
                    <img
                      src={`data:image/png;base64,${pixData.qrcodeBase64}`}
                      alt="QR Code PIX"
                      className="mx-auto border rounded-md bg-background"
                      width={240}
                      height={240}
                    />
                  </>
                )}

                {pixData.pixCopiaECola && (
                  <div className="mt-4 text-left">
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
