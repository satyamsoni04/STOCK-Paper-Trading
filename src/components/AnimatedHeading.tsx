import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export default function AnimatedHeading({ text, className = '' }: AnimatedHeadingProps) {
  const letters = text.split('');

  return (
    <motion.h1
      className={`text-2xl font-bold text-center relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: i * 0.03,
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
      <motion.div
        className="absolute -bottom-1 left-1/2 h-0.5 bg-primary rounded-full"
        initial={{ width: 0, x: '-50%' }}
        animate={{ width: '60px', x: '-50%' }}
        transition={{ delay: letters.length * 0.03 + 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.h1>
  );
}
