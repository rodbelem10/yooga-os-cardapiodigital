// Mock de consulta de CEP (simula ViaCEP) — autofill do endereço sem backend.

export interface CepResult {
  street: string;
  neighborhood: string;
  city: string;
}

const KNOWN: Record<string, CepResult> = {
  "29101000": { street: "Av. Hugo Musso", neighborhood: "Praia da Costa", city: "Vila Velha, ES" },
  "29100000": { street: "Rua Henrique Moscoso", neighborhood: "Centro", city: "Vila Velha, ES" },
  "29102000": { street: "Av. Antônio Gil Veloso", neighborhood: "Praia da Costa", city: "Vila Velha, ES" },
  "29111000": { street: "Rua Itabira", neighborhood: "Itapuã", city: "Vila Velha, ES" },
};

const BAIRROS = ["Praia da Costa", "Itapuã", "Centro", "Coqueiral de Itaparica", "Glória", "Itaparica"];
const RUAS = ["Rua das Palmeiras", "Av. Central", "Rua Espírito Santo", "Rua dos Coqueiros", "Av. Beira-Mar"];

/** Simula latência + retorno do ViaCEP. CEP de Vila Velha (29xxx) sempre resolve. */
export function lookupCep(cep: string): Promise<CepResult | null> {
  const digits = cep.replace(/\D/g, "");
  return new Promise((resolve) => {
    setTimeout(() => {
      if (digits.length !== 8) return resolve(null);
      if (KNOWN[digits]) return resolve(KNOWN[digits]);
      // gera determinístico a partir dos dígitos
      const seed = Number(digits.slice(3, 6));
      resolve({
        street: RUAS[seed % RUAS.length],
        neighborhood: BAIRROS[seed % BAIRROS.length],
        city: "Vila Velha, ES",
      });
    }, 550);
  });
}
