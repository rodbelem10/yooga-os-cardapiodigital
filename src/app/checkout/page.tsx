import { redirect } from "next/navigation";

// O checkout agora é um bottom-sheet aberto a partir da sacola.
// Esta rota existe só para não quebrar links diretos.
export default function CheckoutPage() {
  redirect("/");
}
