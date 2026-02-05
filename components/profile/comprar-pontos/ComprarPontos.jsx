"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardDescription } from "../../ui/card";
import BonusButtons from "./BonusButtons";
import PaymentForm from "./PaymentForm";
import PixQRCode from "./PixQRCode";
import PaymentStatus from "./PaymentStatus";
import { usePaymentLogic } from "@/lib/use-payment-logic";

export default function ComprarPontos() {
  const {
    amount,
    setAmount,
    method,
    setMethod,
    loading,
    message,
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
  } = usePaymentLogic();

  const hasQr = !!pixData?.txid && !credited;
  const disableForm = loading || hasQr;

  return (
    <Card className="w-full max-w-none mt-6">
      <CardHeader>
        <CardDescription>
          1 R$ = 1 NightCoin
          <BonusButtons amount={amount} setAmount={setAmount} disabled={disableForm} />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className={hasQr ? "grid gap-6 md:grid-cols-2" : ""}>
          <div className="flex flex-col gap-4">
            <PaymentForm
              amount={amount}
              setAmount={setAmount}
              cupom={cupom}
              setCupom={setCupom}
              cpf={cpf}
              setCpf={setCpf}
              nome={nome}
              setNome={setNome}
              method={method}
              setMethod={setMethod}
              onSubmit={handleSubmit}
              loading={loading}
              disabled={disableForm}
              parsedAmount={parsedAmount}
              nightcoins={nightcoins}
            />

            <PaymentStatus
              message={message}
              pixStatus={pixStatus}
              lastCheck={lastCheck}
              paid={paid}
              credited={credited}
              creditError={creditError}
              pixData={pixData}
              onNewPix={resetPayment}
            />
          </div>

          {hasQr && <PixQRCode pixData={pixData} onCheckStatus={checkPixStatus} checking={checking} />}
        </div>
      </CardContent>
    </Card>
  );
}
