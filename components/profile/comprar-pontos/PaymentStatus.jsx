"use client";

import React from "react";
import { Button } from "../../ui/button";

export default function PaymentStatus({
  message,
  pixStatus,
  lastCheck,
  paid,
  credited,
  creditError,
  pixData,
  onNewPix,
}) {
  const messageClass =
    message?.type === "error"
      ? "bg-destructive/10 text-destructive border border-destructive/30"
      : "bg-muted/50 text-muted-foreground border border-muted";

  const hasQr = !!pixData?.txid && !credited;

  return (
    <div className="flex flex-col gap-2">
      {message && message.type !== "success" && (
        <div role="alert" className={`rounded-md p-3 text-sm ${messageClass}`}>
          {message.text}
        </div>
      )}

      {pixData?.txid && (
        <div className="text-xs text-muted-foreground">
          Status: <span className="font-semibold">{pixStatus || "—"}</span>
          {lastCheck && (
            <>
              {" "}
              • última verificação: <span className="font-semibold">{lastCheck}</span>
            </>
          )}
        </div>
      )}

      {paid && !credited && (
        <div className="text-xs text-amber-700 font-semibold">
          Pagamento confirmado. Tentando creditar NightCoins...
        </div>
      )}

      {creditError && (
        <div className="text-xs text-destructive font-semibold">
          Falha ao creditar: {creditError}
        </div>
      )}

      {hasQr && (
        <Button type="button" variant="outline" onClick={onNewPix}>
          Gerar novo PIX
        </Button>
      )}
    </div>
  );
}
