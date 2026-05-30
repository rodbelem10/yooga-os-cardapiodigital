"use client";

import { TextField } from "@/components/ui/TextField";
import { useStore } from "@/store/useStore";
import { maskPhone } from "@/lib/format";

export function CustomerForm({
  errors,
}: {
  errors: { name?: string; phone?: string };
}) {
  const customer = useStore((s) => s.customer);
  const setCustomer = useStore((s) => s.setCustomer);

  return (
    <div className="space-y-3">
      <TextField
        name="name"
        label="Seu nome"
        placeholder="Como podemos te chamar?"
        autoComplete="name"
        value={customer.name}
        onChange={(e) => setCustomer({ name: e.target.value })}
        error={errors.name}
      />
      <TextField
        name="phone"
        label="WhatsApp"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="(27) 99999-0000"
        value={customer.phone}
        onChange={(e) => setCustomer({ phone: maskPhone(e.target.value) })}
        error={errors.phone}
        hint="É por aqui que confirmamos seu pedido"
      />
    </div>
  );
}
