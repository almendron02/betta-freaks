import Image from "next/image";
import Link from "next/link";

import { CategoryShowcase } from "@/components/storefront/category-showcase";

const specimens = [
  ["Butterfly longfin","butterfly-longfin"],["Super orange","super-orange"],
  ["Nemo galaxy","nemo-galaxy"],["Super yellow","super-yellow"],["Super red","super-red"],
];
function InlineFish({index}:{index:number}) {
  return <span className="inline-fish" aria-hidden="true">{[0,1,2].map(offset=><Image key={offset} src={'/media/figma/'+specimens[(index+offset)%5][1]+'.png'} width={100} height={100} alt="" style={{animationDelay:offset*3+"s"}}/>)}</span>;
}
export default function Home(){
  return <><section className="intro"><h1>Where <InlineFish index={0}/> betta<br/>people find their<br/>next <InlineFish index={2}/> fish.</h1><p>Explore a collection of bettas, from marbled koi to flowing longfins.</p><div className="actions"><Link className="pill" href="/collection">Explore collection ↗︎</Link><Link className="pill soft" href="/about">Meet Betta Freaks</Link></div></section>
    <CategoryShowcase/>
    <section className="keeper-note" aria-label="Testimonials preview">
      <small>Keeper stories · Sample testimonial</small>
      <blockquote>“I came for the bright orange betta. Then I spotted the blue along the edge of a butterfly’s tail and had to take another look.”</blockquote>
      <p>Illustrative keeper story</p>
    </section>
    <section id="faq" className="home-faq"><h2>Frequently asked questions</h2><div>{[
      ["What can I find in the collection?", "Browse individual bettas, aquariums, and food. Use the category filters to narrow your search."],
      ["What does Preview mean?", "Preview listings show sample products and prices while the live catalog is being prepared."],
      ["Can I place an order online?", "You can add items to your bag and review them at checkout. For now, contact Betta Freaks about purchasing."],
      ["How do I ask about a particular fish?", "Use the Contact page to reach our channel. Include the listing name so we can identify the specimen."],
    ].map(([question,answer])=><details key={question} name="home-faq"><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    <section className="chapter final-invite"><h2>Which fish caught your eye?</h2><p>Take another look at the collection, or get in touch about a specimen.</p><div className="actions"><Link className="pill" href="/collection">Explore collection</Link><Link className="pill soft" href="/contact">Contact us</Link></div></section></>;
}
