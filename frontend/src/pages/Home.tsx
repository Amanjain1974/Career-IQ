import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BriefcaseIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-10 bg-slate-50 dark:bg-slate-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] top-[20%] w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 dark:opacity-20"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[10%] top-[10%] w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 dark:opacity-20"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Match with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">dream career.</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Stop scrolling blindly. Our AI-driven platform matches your unique skills with real-time job openings from top companies instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-transform hover:scale-105">
                Get Started Free
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/about" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-slate-200 dark:border-slate-700 text-base font-semibold rounded-full text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                How it works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Simplifying your job hunt</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Three simple steps to connect you with opportunities that actually fit your profile.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              { title: "Create Profile", icon: SparklesIcon, desc: "Tell us about your skills, experience, and what you're looking for in your next role." },
              { title: "Smart Matching", icon: BriefcaseIcon, desc: "Our algorithm scans thousands of real-time listings to find perfect fits." },
              { title: "Apply & Track", icon: CheckCircleIcon, desc: "Apply with one click and track your application status directly from your dashboard." }
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Explore by Category</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Discover roles in top fields tailored to your expertise.</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { title: "Engineering", count: "1,200+ Jobs" },
              { title: "Design", count: "850+ Jobs" },
              { title: "Marketing", count: "600+ Jobs" },
              { title: "Data Science", count: "450+ Jobs" },
              { title: "Product", count: "900+ Jobs" },
              { title: "Sales", count: "1,500+ Jobs" },
              { title: "Finance", count: "300+ Jobs" },
              { title: "Operations", count: "500+ Jobs" }
            ].map((cat, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 cursor-pointer shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{cat.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{cat.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="py-24 bg-indigo-50 dark:bg-slate-800/30 border-y border-indigo-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-indigo-500 mb-6 flex justify-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <blockquote className="text-2xl md:text-4xl font-medium text-slate-900 dark:text-white leading-tight mb-8">
              "CareerIQ completely changed how I look for jobs. Within a week, I was matched with three roles I wouldn't have found on my own."
            </blockquote>
            <figcaption className="font-semibold text-slate-900 dark:text-white">
              Sarah Jenkins <span className="text-slate-500 dark:text-slate-400 font-normal">| Product Designer at TechFlow</span>
            </figcaption>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

