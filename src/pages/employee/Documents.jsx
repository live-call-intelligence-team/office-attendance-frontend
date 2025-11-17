import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiFile, FiDownload, FiUpload } from 'react-icons/fi';

const Documents = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Documents
          </h1>
          <p className="text-gray-600 mt-1">View and manage your documents</p>
        </div>
      </motion.div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/50">
        <FiFolder className="mx-auto text-6xl text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-semibold">No documents available</p>
        <p className="text-gray-400 text-sm mt-2">Documents will appear here once uploaded by admin</p>
      </div>
    </div>
  );
};

export default Documents;
