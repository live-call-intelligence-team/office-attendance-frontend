// src/components/common/Footer.jsx

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">
                        © {currentYear} Office Attendance System. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;