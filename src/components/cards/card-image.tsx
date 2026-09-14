'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { Card } from '@/types/catalog';
import { displayableImage } from '@/domain/catalog/images';
export function CardImage({ card }: { card: Card }) {
  const [failed, setFailed] = useState(false);
  const src = displayableImage(card.image);
  return <div className="card-image">
    {src && !failed ? <Image src={src} alt={card.playerName + ' — card ' + card.cardNumber} fill sizes="(max-width: 600px) 23vw, 180px" onError={() => setFailed(true)} /> :
      <div className="image-placeholder" role="img" aria-label={'Image unavailable for ' + card.playerName}>
        <span className="placeholder-mark" aria-hidden="true">◇</span><span>Image<br />pending</span>
      </div>}
  </div>;
}
