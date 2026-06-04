'use client';
import { motion } from 'framer-motion';

export default function About() {
  const steps = [
    { num: "01", title: "Select a Challenge", desc: "Choose a data structure or algorithm from your personalized skill tree." },
    { num: "02", title: "Manipulate & Learn", desc: "Interact with visual elements—drag, click, and link nodes to perform operations." },
    { num: "03", title: "Earn & Progress", desc: "Get instant feedback, earn XP, and unlock more advanced topics." }
  ];

  return (
    <section id="about" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <div className="text-5xl font-black text-indigo-500/20 mb-4">{step.num}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}