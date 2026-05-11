import { motion } from 'framer-motion'

export function SuccessCheckmark({ size = 80, color = '#F47C20' }: { size?: number; color?: string }) {
  return (
    <div className="flex items-center justify-center">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.5, ease: 'easeOut' },
            },
          }}
        />
        <motion.path
          d="M8 12.5l3 3 5-6"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.4, ease: 'easeOut', delay: 0.3 },
            },
          }}
        />
      </motion.svg>
    </div>
  )
}
