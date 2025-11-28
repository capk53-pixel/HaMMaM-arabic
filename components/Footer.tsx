import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white mt-12 border-t border-slate-200">
      <div className="container mx-auto px-4 py-4 text-center text-slate-500">
        <p>
          © {currentYear} HaMMaM Fit Hup. تم إنشاؤه بقوة الذكاء الاصطناعي.
        </p>
      </div>
    </footer>
  );
};

export default Footer;