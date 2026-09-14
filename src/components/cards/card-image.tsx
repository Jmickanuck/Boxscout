'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { Card } from '@/types/catalog';
import { displayableImage } from '@/domain/catalog/images';
export function CardImage({ card, variantId = null }: { card: Pick<Card, 'id'|'playerName'|'cardNumber'|'image'>; variantId?: string|null }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = displayableImage(card.image, card.id, variantId);
  return <div className="card-image">
    {src && src !== failedSrc ? <Image src={src} alt={card.playerName + ' — card ' + card.cardNumber} fill sizes="(max-width: 600px) calc((100vw - 44px) / 4), (max-width: 1040px) calc((100vw - 72px) / 4), 242px" loading="lazy" decoding="async" onError={() => setFailedSrc(src)} /> :
      <div className="image-placeholder" role="img" aria-label={'Image unavailable for ' + card.playerName}>
        <span className="placeholder-mark" aria-hidden="true">◇</span><span>Image<br />pending</span>
      </div>}
  </div>;
}
