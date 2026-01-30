"use client";
import React from "react";
import Image from "next/image";
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
    const [cpf, setCpf] = React.useState("");
    const [nome, setNome] = React.useState("");
    const [pixData, setPixData] = React.useState(null);

    const parsedAmount = Math.max(0, Math.floor(Number(amount) || 0));
    const nightcoins = parsedAmount;

    function handleAmountChange(e) {
        const raw = e.target.value;
        const cleaned = raw.replace(/[^\d.,]/g, "").replace(",", ".");
        setAmount(cleaned);
        setMessage(null);
    }

    function handleCpfChange(e) {
        // Aceita apenas números
        setCpf(e.target.value.replace(/\D/g, ""));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage(null);
        setPixData(null);
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
            // Gera referência e dados do pedido
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
                webhookUrl: "https://www.sualoja.com.br/webhook"
            };

            // Chama o endpoint PHP backend (sem Api-Key no header)
            const res = await fetch("http://localhost/api/pix.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Erro ao gerar cobrança PIX.");
            }
            const data = await res.json();
            setPixData(data);
            setMessage({ type: "success", text: "Cobrança PIX gerada! Pague usando o QR Code ou copia e cola." });
            setAmount("");
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Erro ao processar pagamento. Tente novamente." });
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
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nome">Nome completo do pagador</Label>
                        <Input
                            id="nome"
                            type="text"
                            placeholder="Nome completo"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
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
                                        disabled={p.id !== "pix"}
                                    />
                                    {p.label}
                                    {p.id !== "pix" && (
                                        <span className="text-xs text-muted-foreground">(em breve)</span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <div className="bg-muted rounded-md border p-3 text-sm flex flex-col gap-1">
                        <div>Você vai pagar: <span className="font-semibold">R$ {parsedAmount}</span></div>
                        <div>Receberá: <span className="font-semibold">{nightcoins} NightCoin(s)</span></div>
                    </div>

                    <Button type="submit" className="mt-2" disabled={loading}>
                        {loading ? "Gerando cobrança..." : "Pagar com PIX"}
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

                    {pixData && (
                        <div className="flex flex-col items-center gap-3 mt-4">
                            <div className="text-center">
                                <div className="font-semibold mb-1">Escaneie o QR Code abaixo:</div>
                                <img
                                    src={`data:image/png;base64,${pixData.qrcodeBase64}`}
                                    alt="QR Code PIX"
                                    className="mx-auto border rounded-md"
                                    width={220}
                                    height={220}
                                />
                                <div className="mt-2">
                                    <Label htmlFor="pix-copia">Copia e Cola:</Label>
                                    <Input
                                        id="pix-copia"
                                        value={pixData.pixCopiaECola}
                                        readOnly
                                        className="mt-1 text-xs"
                                        onFocus={e => e.target.select()}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}