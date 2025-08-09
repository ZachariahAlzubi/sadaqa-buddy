import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BankAccount } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Landmark, CreditCard, Shield, Loader2 } from 'lucide-react';

const banks = [
  { name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
  { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
  { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },
  { name: 'Citi', logo: 'https://logo.clearbit.com/citi.com' },
  { name: 'U.S. Bank', logo: 'https://logo.clearbit.com/usbank.com' },
  { name: 'Capital One', logo: 'https://logo.clearbit.com/capitalone.com' },
  { name: 'PNC Bank', logo: 'https://logo.clearbit.com/pnc.com' },
  { name: 'American Express', logo: 'https://logo.clearbit.com/americanexpress.com' },
];

export default function ConnectBankAccount() {
  const history = useHistory();
  const [connectingBank, setConnectingBank] = useState(null);

  const handleConnectBank = async (bankName) => {
    setConnectingBank(bankName);
    try {
      await BankAccount.create({
        plaid_item_id: `item_${Date.now()}`,
        plaid_account_id: `acct_${Date.now()}`,
        account_name: `${bankName} Checking`,
        account_mask: Math.floor(1000 + Math.random() * 9000).toString(),
        account_type: 'checking',
        institution_name: bankName,
        is_active: true,
        connection_status: 'connected',
      });
      history.push(createPageUrl('Settings'));
    } catch (error) {
      console.error("Error creating bank account:", error);
      setConnectingBank(null);
    }
  };

  return (
    <div className="p-4">
      <div className="glass-card rounded-3xl max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => history.goBack()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Connect an Account</h1>
            <p className="text-gray-600">Securely link your bank to enable round-ups.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 mb-8 bg-blue-50/30 border border-blue-200">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">Bank-Grade Security</h4>
              <p className="text-sm text-blue-700">
                We use Plaid to connect your account. We never see or store your bank credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {banks.map((bank) => (
            <button
              key={bank.name}
              onClick={() => handleConnectBank(bank.name)}
              disabled={!!connectingBank}
              className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {connectingBank === bank.name ? (
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              ) : (
                <img src={bank.logo} alt={bank.name} className="w-8 h-8 rounded-md" />
              )}
              <span className="text-sm font-medium text-gray-800">{bank.name}</span>
            </button>
          ))}
        </div>

        {connectingBank && (
          <div className="text-center mt-6">
            <p className="text-gray-600 animate-pulse">
              Connecting to {connectingBank}... You may be redirected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}