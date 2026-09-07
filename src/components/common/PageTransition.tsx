import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.9 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
