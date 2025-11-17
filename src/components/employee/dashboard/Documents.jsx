import { motion } from 'framer-motion';
import { FiFileText, FiDownload } from 'react-icons/fi';

const Documents = () => {
  const recentDocs = [
    { name: 'Payslip_October_2025.pdf', icon: '📥' },
    { name: 'Offer_Letter.pdf', icon: '📥' },
    { name: 'ID_Card.pdf', icon: '📥' },
  ];

  const quickAccess = [
    { label: '💳 Form 16', action: () => {} },
    { label: '📋 Policies', action: () => {} },
    { label: '🎓 Certificates', action: () => {} },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
      className="bg-background-card rounded-2xl shadow-custom p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl">
            <FiFileText className="text-text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">📄 DOCUMENTS & FILES</h2>
        </div>
        <button className="text-primary-500 hover:text-primary-600 font-medium text-sm">
          View All →
        </button>
      </div>

      {/* Recent Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">RECENT DOCUMENTS:</h3>
        <div className="space-y-3">
          {recentDocs.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-background-secondary rounded-xl hover:bg-primary-50 transition-all cursor-pointer group border border-transparent hover:border-primary-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{doc.icon}</span>
                <span className="text-sm font-medium text-text-primary">{doc.name}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-primary-500 text-text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiDownload />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-4">QUICK ACCESS:</h3>
        <div className="grid grid-cols-3 gap-3">
          {quickAccess.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.action}
              className="px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Documents;
