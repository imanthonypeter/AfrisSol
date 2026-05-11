import { motion } from 'framer-motion'
import { CSSProperties, ReactNode } from 'react'

export function AnimatedLayout({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-full w-full ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  )
}
