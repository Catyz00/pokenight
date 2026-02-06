"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  PIX_CREATE_URL,
  PIX_CHECK_URL,
  ADD_POINTS_URL,
  PAYMENT_WEBHOOK_URL,
  paymentMethods,
} from "./payment-constants";
import {
  normalizeStatus,
  isPaidStatus,
  isExpiredOrCanceled,
  getBonus,
  getAccountIdFromStorage,
} from "./payment-utils";

export function usePaymentLogic() {
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

  const [accountId, setAccountId] = React.useState(null);

  const paidRef = React.useRef(false);
  const creditedRef = React.useRef(false);
  const toastOnceRef = React.useRef(false);

  const parsedAmount = Math.max(0, Math.floor(Number(String(amount).replace(/\D/g, "")) || 0));
  const nightcoins = parsedAmount + getBonus(parsedAmount);

  React.useEffect(() => {
    const id = getAccountIdFromStorage();
    setAccountId(id);
  }, []);

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

  const checkPixStatus = React.useCallback(
    async (txid, { silent = false } = {}) => {
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
    },
    [pixData, fireSuccessToast, creditNightCoins]
  );

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
  }, [pixData?.txid, checkPixStatus]);

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
        webhookUrl: PAYMENT_WEBHOOK_URL,
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

  const resetPayment = () => {
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
  };

  return {
    amount,
    setAmount,
    method,
    setMethod,
    loading,
    message,
    setMessage,
    cpf,
    setCpf,
    nome,
    setNome,
    cupom,
    setCupom,
    pixData,
    checking,
    paid,
    pixStatus,
    lastCheck,
    credited,
    creditError,
    parsedAmount,
    nightcoins,
    handleSubmit,
    checkPixStatus,
    resetPayment,
  };
}
