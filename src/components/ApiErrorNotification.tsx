"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiErrorNotificationProps {
  show: boolean;
  onClose?: () => void;
}

export default function ApiErrorNotification({ show, onClose }: ApiErrorNotificationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
          className="fixed top-20 right-4 z-50 max-w-sm"
        >
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  API Key Not Found for AI Gen
                </h3>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Using predefined ideas instead. Contact admin to enable AI generation.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:text-yellow-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}