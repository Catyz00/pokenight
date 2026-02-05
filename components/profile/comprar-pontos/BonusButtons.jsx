"use client";

import React from "react";
import { getBonus } from "@/lib/payment-utils";

export default function BonusButtons({ amount, setAmount, disabled }) {
  const values = [7, 10, 20, 30, 40, 50];

  return (
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {values.map((v) => {
        const b = getBonus(v);
        const isSelected = Number(amount) === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => setAmount(String(v))}
            disabled={disabled}
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
  );
}
