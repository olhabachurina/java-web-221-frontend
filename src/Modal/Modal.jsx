import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Modal.css"; 

export default function Modal({ isOpen, onClose, onConfirm, theme, title, description }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Бэкдроп */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Модалка */}
          <motion.div
            className={`modal-container ${theme}`}
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <h2>{title || "Підтвердження дії"}</h2>
            <p>{description || "Ви впевнені?"}</p>

            <div className="modal-actions">
              <button className="btn-confirm" onClick={onConfirm}>
                ✅ Підтвердити
              </button>
              <button className="btn-cancel" onClick={onClose}>
                ❌ Скасувати
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}