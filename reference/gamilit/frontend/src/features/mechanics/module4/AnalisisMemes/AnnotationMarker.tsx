import React from 'react';
import { motion } from 'framer-motion';
import { MemeAnnotation } from './analisisMemesTypes';
import { MessageCircle } from 'lucide-react';

export const AnnotationMarker: React.FC<{ annotation: MemeAnnotation }> = ({ annotation }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    style={{ left: annotation.x, top: annotation.y }}
    className="absolute transform -translate-x-1/2 -translate-y-1/2"
  >
    <div className="relative group">
      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
        <MessageCircle className="w-5 h-5 text-white" />
      </div>
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block w-48 bg-white p-3 rounded-lg shadow-lg border-2 border-red-500 z-10">
        <p className="text-sm font-semibold mb-1">{annotation.category}</p>
        <p className="text-xs">{annotation.text}</p>
      </div>
    </div>
  </motion.div>
);
