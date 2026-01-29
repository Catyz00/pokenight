"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const paymentMethods = [
    { id: "pix", label: "PIX" },
    { id: "card", label: "Cartão de Crédito" },
    { id: "boleto", label: "Boleto" },
];

export default function ComprarPontos() {
    const [amount, setAmount] = React.useState("");
    const [method, setMethod] = React.useState(paymentMethods[0].id);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState(null);

    const parsedAmount = Math.max(0, Math.floor(Number(amount) || 0));
    const nightcoins = parsedAmount;

    function handleAmountChange(e) {
        const raw = e.target.value;
        const cleaned = raw.replace(/[^\d.,]/g, "").replace(",", ".");
        setAmount(cleaned);
        setMessage(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        if (parsedAmount <= 0) {
            setMessage({ type: "error", text: "Informe um valor maior que 0." });
            return;
        }
        setLoading(true);
        try {
            await new Promise((res) => setTimeout(res, 1200));
            setMessage({
                type: "success",
                text: `Pedido gerado: R$ ${parsedAmount} → ${nightcoins} NightCoin(s). Método: ${method}.`,
            });
            setAmount("");
        } catch (err) {
            setMessage({ type: "error", text: "Erro ao processar pagamento. Tente novamente." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-lg mx-auto mt-6">
            <CardHeader>
                <CardTitle>Comprar NightCoins</CardTitle>
                <CardDescription>1 R$ = 1 NightCoin</CardDescription>
            </CardHeader>
            <CardContent>
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
                            aria-label="Valor em reais"
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {[5, 10, 20, 50, 100].map((v) => (
                            <Button
                                type="button"
                                key={v}
                                variant="outline"
                                size="sm"
                                onClick={() => setAmount(String(v))}
                            >
                                R$ {v}
                            </Button>
                        ))}
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
                                    />
                                    {p.label}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="bg-muted rounded-md border p-3 text-sm flex flex-col gap-1">
                        <div>Você vai pagar: <span className="font-semibold">R$ {parsedAmount}</span></div>
                        <div>Receberá: <span className="font-semibold">{nightcoins} NightCoin(s)</span></div>
                    </div>

                    <Button type="submit" className="mt-2" disabled={loading}>
                        {loading ? "Processando..." : "Finalizar compra"}
                    </Button>

                    {message && (
                        <div
                            role="alert"
                            className={`mt-2 rounded-md p-3 text-sm ${
                                message.type === "error"
                                    ? "bg-destructive/10 text-destructive border border-destructive/30"
                                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}