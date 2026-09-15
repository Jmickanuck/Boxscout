import Link from 'next/link';
import {megaComparison,versionLabel} from '@/domain/catalog/box-families';
export function MegaVersions({slug}:{slug:string}){

 return <section><h2>One Mega family, different versions</h2><p className="checklist-note">All four formats are listed as 6 packs of 7 cards. Exclusive parallels and average contents can differ. The comparison below is based on published product guides; checklist coverage is still growing.</p><div className="mega-versions">{megaComparison.map(([id,colours,url])=><article className="mega-version" key={id}><h3>{versionLabel(id!)}</h3><p>{colours} Disco parallels</p>{url?<a href={url} target="_blank" rel="noreferrer">View retailer listing ↗</a>:<p>Mastermind · Collectors Emporium · SCHEELS listings below</p>}</article>)}</div><Link className="button" href={'/products/'+slug+'/cards'}>Explore Mega cards →</Link></section>;
}
