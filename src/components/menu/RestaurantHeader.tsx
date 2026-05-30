"use client";

import Image from "next/image";
import { Bike, Clock, Share2, Receipt, MapPin } from "lucide-react";
import { restaurant } from "@/data/restaurant";
import { Stars } from "@/components/ui/Stars";
import { brl } from "@/lib/format";
import { ModeToggle } from "./ModeToggle";

function InfoChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink-2 shadow-card">
      <span className="text-brasa">{icon}</span>
      {children}
    </div>
  );
}

export function RestaurantHeader() {
  return (
    <header className="relative">
      {/* Capa */}
      <div className="relative h-40 w-full sm:h-56">
        <Image
          src={restaurant.cover}
          alt={`Capa ${restaurant.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-charcoal/30" />
        <button
          aria-label="Compartilhar"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/40 text-white backdrop-blur-md transition active:scale-90"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Cartão de info */}
      <div className="relative -mt-7 rounded-t-3xl bg-cream px-4 pt-2">
        <div className="flex items-end gap-3">
          <div className="relative -mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-cream bg-surface shadow-pop">
            <Image
              src={restaurant.logo}
              alt={restaurant.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 pb-1">
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-bold text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Aberto agora
            </div>
          </div>
        </div>

        <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink">
          {restaurant.name}
        </h1>
        <p className="mt-0.5 text-sm font-medium text-ink-2">{restaurant.tagline}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Stars rating={restaurant.rating} count={restaurant.reviewCount} />
          <span className="text-line-2">•</span>
          <span className="font-medium text-ink-2">{restaurant.cuisine}</span>
          <span className="text-line-2">•</span>
          <span className="inline-flex items-center gap-1 font-medium text-ink-2">
            <MapPin size={13} /> {restaurant.distanceKm} km
          </span>
        </div>

        {/* Chips de info */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          <InfoChip icon={<Clock size={14} />}>
            {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
          </InfoChip>
          <InfoChip icon={<Bike size={14} />}>
            Entrega {brl(restaurant.deliveryFee)}
          </InfoChip>
          <InfoChip icon={<Receipt size={14} />}>Mín. {brl(restaurant.minOrder)}</InfoChip>
        </div>

        <div className="mt-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
