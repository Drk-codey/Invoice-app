import React from 'react';
import { ThemeProvider } from '../context/ThemeProvider';

import Sidebar from '../components/Sidebar';
import InvoiceList from '../components/InvoiceList';
import InvoiceDetail from '../components/InvoiceDetail';
import InvoiceForm from '../components/InvoiceForm';
import { InvoiceProvider, useInvoices } from '../context/InvoiceContext';

const HomeContent: React.FC = () => {
    const { currentInvoiceId } = useInvoices();
    return (
        <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] transition-colors duration-200 flex flex-col md:flex-row">
            <Sidebar />

            {/* Main content — offset for sidebar */}
            <div className="flex-1 flex flex-col pt-[72px] md:pt-0 md:ml-[103px] min-h-screen">
                {currentInvoiceId ? <InvoiceDetail /> : <InvoiceList />}
            </div>

            {/* Form overlay */}
            <InvoiceForm />
        </div>
    );
};

const Home: React.FC = () => {
    return (
        <ThemeProvider>
          <InvoiceProvider>
            <HomeContent />
          </InvoiceProvider>
        </ThemeProvider>
    );
}

export default Home;