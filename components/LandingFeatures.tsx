"use client";
import { motion } from 'motion/react';
import { Trophy, Users, RefreshCcw, ShieldCheck, LineChart, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon: Trophy,
    title: 'Session-Based Scoring',
    desc: 'Track scores across multiple sessions or rounds with automatic totals.'
  },
  {
    icon: Users,
    title: 'Up to 10 Teams',
    desc: 'Flexible event design supporting small duels to larger group contests.'
  },
  {
    icon: RefreshCcw,
    title: 'Live Updates',
    desc: 'Spectators see fresh scores every few seconds—no manual refresh needed.'
  },
  {
    icon: ShieldCheck,
    title: 'Managed Editing',
    desc: 'Protect events with a management password (auth integration coming).'
  },
  {
    icon: LineChart,
    title: 'Instant Totals',
    desc: 'Totals recompute automatically as you edit session values.'
  },
  {
    icon: Lock,
    title: 'Future Auth',
    desc: 'Roadmap: creator accounts, roles, and secure ownership.'
  }
];

export function LandingFeatures() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((f,i)=> {
        const Icon = f.icon;
        return (
          <motion.div
            key={f.title}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y:0, opacity:1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i*0.05 }}
            className="rounded-lg border bg-white/60 dark:bg-black/30 backdrop-blur p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center dark:bg-white dark:text-black">
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-base">{f.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
