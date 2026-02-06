"use client";

import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { getBonus } from "@/lib/payment-utils";
import { paymentMethods } from "@/lib/payment-constants";

export default function PaymentForm({
  amount,
  setAmount,
  cupom,
  setCupom,
  cpf,
  setCpf,
  nome,
  setNome,
  method,
  setMethod,
  onSubmit,
  loading,
  disabled,
  parsedAmount,
  nightcoins,
}) {
  function handleAmountChange(e) {
    const raw = e.target.value;
    const cleaned = raw.replace(/\D/g, "");
    setAmount(cleaned);
  }

  function handleCpfChange(e) {
    setCpf(e.target.value.replace(/\D/g, ""));
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
                disabled={disabled}
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

      <Button type="submit" className="mt-2" disabled={loading || disabled}>
        {loading ? "Gerando cobrança..." : "Pagar com PIX"}
      </Button>
    </form>
  );
}
