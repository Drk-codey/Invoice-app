import React from 'react';
import  campaign_flatline  from "../assets/campaign_flatline-img.svg"

const EmptyInvoice: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-5 px-6 text-center">
    {/* Illustration */}
    
    <img className="mb-10 w-48 h-48" src={campaign_flatline} alt="Email campaign flatline" />

    <h2 className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-4">
      There is nothing here
    </h2>
    <p className="text-[#888EB0] dark:text-[#DFE3FA] max-w-xs leading-relaxed">
      Create an invoice by clicking the <br /> <strong>New Invoice</strong> button and get started
    </p>
  </div>
);

export default EmptyInvoice;
