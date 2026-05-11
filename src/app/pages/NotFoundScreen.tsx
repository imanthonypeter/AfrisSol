import React from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Home } from "lucide-react";
import { AnimatedLayout } from "../../components/AnimatedLayout";
import { motion } from "framer-motion";

export const NotFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AnimatedLayout className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
      {/* Brand Icon or Illustration */}
      <motion.div
        className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
      >
        <AlertCircle className="w-12 h-12" style={{ color: "#F47C20" }} />
      </motion.div>

      <motion.h1
        className="text-4xl font-bold mb-4 text-center"
        style={{ color: "#162456" }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        Página não encontrada
      </motion.h1>
      
      <motion.p
        className="text-gray-500 text-center mb-8 max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        A página que está a tentar aceder não existe, foi removida ou o endereço está incorrecto.
      </motion.p>

      <motion.button
        onClick={() => navigate("/home", { replace: true })}
        className="w-full max-w-xs py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
        style={{ backgroundColor: "#162456" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Home className="w-5 h-5" />
        Voltar ao Início
      </motion.button>

      {/* Decorative Brand Element */}
      <div className="absolute bottom-0 w-full overflow-hidden opacity-20 pointer-events-none flex justify-center">
        <div 
          className="w-[150vw] h-[150vw] sm:w-[100vw] sm:h-[100vw] rounded-[100%] translate-y-1/2" 
          style={{ backgroundColor: "#162456" }} 
        />
      </div>
    </AnimatedLayout>
  );
};

