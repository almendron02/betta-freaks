import Image from "next/image";
import Link from "next/link";

const specimens = [
  ["Butterfly longfin","butterfly-longfin"],["Super orange","super-orange"],
  ["Nemo galaxy","nemo-galaxy"],["Super yellow","super-yellow"],["Super red","super-red"],
];
function InlineFish({index}:{index:number}) {
  return <span className="inline-fish" aria-hidden="true">{[0,1,2].map(offset=><Image key={offset} src={'/media/figma/'+specimens[(index+offset)%5][1]+'.png'} width={100} height={100} alt="" style={{animationDelay:offset*3+"s"}}/>)}</span>;
}
export default function Home(){
  return <><section className="intro"><h1>Where <InlineFish index={0}/> betta<br/>people find their<br/>next <InlineFish index={2}/> fish.</h1><p>Explore a collection of bettas, from marbled koi to flowing longfins.</p><div className="actions"><Link className="pill" href="/collection">Explore collection ↗︎</Link><Link className="pill soft" href="/about">Meet Betta Freaks</Link></div></section>
    <section className="wall" aria-label="Betta varieties"><div className="track">{[0,1].map(copy=><div className="strip" key={copy} aria-hidden={copy===1}>{specimens.map(([name,file])=><figure key={file}><Image src={'/media/figma/'+file+'.png'} alt={name} width={320} height={320}/><figcaption>{name}</figcaption></figure>)}</div>)}</div></section>
    <section className="chapter"><h2>A closer look<br/>at every fin.</h2><p>Start with the colors that catch your eye. Explore fish, tanks, and food in one collection.</p><div className="tiles">{[["Bettas","/media/catalog-red-blue-betta-cutout.png"],["Aquariums","/media/catalog/aquarium-1.png"],["Food","/media/catalog/food-1.png"]].map(([label,src])=><Link key={label} href={'/collection?category='+label}><Image src={src} alt="" width={360} height={280}/><strong>{label} ↗︎</strong></Link>)}</div></section></>;
}
