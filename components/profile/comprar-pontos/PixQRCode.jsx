"use client";

import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export default function PixQRCode({ pixData, onCheckStatus, checking }) {
  if (!pixData?.txid) return null;

  return (
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
        onClick={() => onCheckStatus(pixData.txid)}
        disabled={checking}
      >
        {checking ? "Verificando..." : "Verificar pagamento"}
      </Button>
    </div>
  );
}
