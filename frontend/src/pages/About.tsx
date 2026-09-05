import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">About Us</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Placeholder content for the About page. This will be updated later.
        </p>
      </motion.div>
    </div>
  );
}

