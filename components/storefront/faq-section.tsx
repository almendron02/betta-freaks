"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { motionTokens } from "@/lib/motion-tokens";
import { AnimatedHeading } from "@/components/motion/motion-primitives";

const questions = [
  {
    question: "How do I care for my betta fish?",
    answer: "Keep a Betta splendens in a fully cycled, heated aquarium with gentle filtration, stable water parameters, and enough room to swim and rest. Use smooth decor and live or silk plants so delicate fins are not damaged.",
  },
  {
    question: "What water temperature do bettas need?",
    answer: "Bettas are tropical fish. Use a reliable adjustable heater and thermometer, and keep the temperature stable rather than allowing sharp daily swings.",
  },
  {
    question: "How often should I feed my betta?",
    answer: "Feed a measured portion of quality betta food and watch the individual fish's condition. Avoid leaving uneaten food in the aquarium.",
  },
  {
    question: "Where do you ship?",
    answer: "Available destinations, timing, and weather holds are listed in the current shipping policy before checkout.",
  },
  {
    question: "What happens if a fish does not arrive alive?",
    answer: "Review the live-arrival guarantee before ordering. It explains eligibility, documentation, deadlines, and how approved claims are handled.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  return (
    <section className="showroom-faq" id="faq">
      <div className="showroom-faq-intro">
        <span className="showroom-eyebrow">FAQ</span>
        <AnimatedHeading as="h2" inView text="Frequently asked questions" />
        <p>Essential care guidance and clear links to the store policies that apply to live-fish purchases.</p>
      </div>
      <div className="showroom-faq-list">
        {questions.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.article
              className={`showroom-faq-item${isOpen ? " is-open" : ""}`}
              key={item.question}
              initial={false}
              whileInView={prefersReduced ? undefined : { opacity: [0.76, 1], y: [motionTokens.distance.sm, 0] }}
              viewport={{ once: true }}
              transition={{ duration: motionTokens.duration.normal, delay: prefersReduced ? 0 : index * motionTokens.stagger.tight, ease: motionTokens.easing.smooth }}
            >
              <button type="button" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                <span>{item.question}</span>
                <motion.span animate={{ rotate: isOpen && !prefersReduced ? 180 : 0 }} transition={{ duration: motionTokens.duration.fast }} aria-hidden="true">
                  {isOpen ? <Minus /> : <Plus />}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.p key="answer" initial={prefersReduced ? false : { opacity: 0, y: -motionTokens.distance.xs }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -motionTokens.distance.xs }} transition={{ duration: prefersReduced ? motionTokens.duration.instant : motionTokens.duration.fast }}>{item.answer}</motion.p>
                ) : null}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
