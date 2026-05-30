"use client";

import { useState } from "react";
import { Loader2, MapPin, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { TextField } from "@/components/ui/TextField";
import { useStore } from "@/store/useStore";
import { maskCep, onlyDigits } from "@/lib/format";
import { lookupCep } from "@/lib/cep";

interface Errors {
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
}

export function AddressForm({ errors }: { errors: Errors }) {
  const customer = useStore((s) => s.customer);
  const setCustomer = useStore((s) => s.setCustomer);
  const [loadingCep, setLoadingCep] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleCep = async (raw: string) => {
    const masked = maskCep(raw);
    setCustomer({ cep: masked });
    if (onlyDigits(masked).length === 8) {
      setLoadingCep(true);
      const res = await lookupCep(masked);
      setLoadingCep(false);
      if (res) {
        setCustomer({ street: res.street, neighborhood: res.neighborhood, city: res.city });
        toast.success("Endereço preenchido ✨");
      } else {
        toast.error("CEP não encontrado");
      }
    }
  };

  const useLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      setCustomer({
        cep: "29101-000",
        street: "Av. Hugo Musso",
        neighborhood: "Praia da Costa",
        city: "Vila Velha, ES",
      });
      toast.success("Localização aplicada 📍");
    }, 800);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={useLocation}
        disabled={locating}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-brasa-ring bg-brasa-soft py-2.5 text-sm font-bold text-brasa-700 transition active:scale-[0.99] disabled:opacity-60"
      >
        {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
        Usar minha localização atual
      </button>

      <TextField
        name="cep"
        label="CEP"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="29100-000"
        value={customer.cep}
        onChange={(e) => handleCep(e.target.value)}
        error={errors.cep}
        rightSlot={
          loadingCep ? (
            <Loader2 size={18} className="animate-spin text-brasa" />
          ) : (
            <MapPin size={18} className="text-muted" />
          )
        }
      />
      <TextField
        name="street"
        label="Rua / Avenida"
        autoComplete="address-line1"
        placeholder="Nome da rua"
        value={customer.street}
        onChange={(e) => setCustomer({ street: e.target.value })}
        error={errors.street}
      />
      <div className="grid grid-cols-[1fr_1.5fr] gap-3">
        <TextField
          name="number"
          label="Número"
          inputMode="numeric"
          placeholder="123"
          value={customer.number}
          onChange={(e) => setCustomer({ number: e.target.value })}
          error={errors.number}
        />
        <TextField
          name="complement"
          label="Complemento"
          optional
          placeholder="Apto, bloco…"
          value={customer.complement}
          onChange={(e) => setCustomer({ complement: e.target.value })}
        />
      </div>
      <TextField
        name="neighborhood"
        label="Bairro"
        placeholder="Bairro"
        value={customer.neighborhood}
        onChange={(e) => setCustomer({ neighborhood: e.target.value })}
        error={errors.neighborhood}
      />
      <TextField
        name="reference"
        label="Ponto de referência"
        optional
        placeholder="Ex.: portão azul, ao lado da farmácia"
        value={customer.reference}
        onChange={(e) => setCustomer({ reference: e.target.value })}
      />
    </div>
  );
}
