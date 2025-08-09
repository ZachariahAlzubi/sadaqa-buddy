import React, { useState, useEffect } from "react";
import { Donation, User, Charity } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Plus, 
  Download,
  Calendar,
  Building2
} from "lucide-react";
import { format } from "date-fns";
import DonateNowForm from "../components/donations/DonateNowForm";
import DonationHistory from "../components/donations/DonationHistory";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [user, setUser] = useState(null);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      const donationData = await Donation.filter(
        { created_by: currentUser.email },
        '-created_date'
      );
      
      setUser(currentUser);
      setDonations(donationData);
    } catch (error) {
      console.error("Error loading donations:", error);
    }
    setIsLoading(false);
  };

  const handleDonationComplete = () => {
    setShowDonateForm(false);
    loadData();
  };

  const currentMonthDonations = donations.filter(d => {
    const donationDate = new Date(d.created_date);
    const now = new Date();
    return donationDate.getMonth() === now.getMonth() && 
           donationDate.getFullYear() === now.getFullYear();
  });

  const totalThisMonth = currentMonthDonations.reduce((sum, d) => sum + d.amount, 0);
  const pendingAmount = user?.pending_pledges || 0;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Donations</h1>
              <p className="text-gray-600">Your charitable giving history</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={() => setShowDonateForm(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Donate Now
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Donated</p>
            <p className="text-2xl font-bold text-gray-800">${user?.total_donated?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-800">${totalThisMonth.toFixed(2)}</p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending Round-ups</p>
            <p className="text-2xl font-bold text-gray-800">${pendingAmount.toFixed(2)}</p>
          </div>
        </div>

        {/* Ready to Donate Alert */}
        {pendingAmount >= (user?.auto_donate_threshold || 10) && (
          <div className="mt-6 glass-card rounded-2xl p-4 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Ready to Donate!</h3>
                  <p className="text-sm text-amber-700">
                    Your round-ups have reached ${user?.auto_donate_threshold || 10}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowDonateForm(true)}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
              >
                Donate ${pendingAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Donate Form */}
      {showDonateForm && (
        <DonateNowForm
          pendingAmount={pendingAmount}
          onClose={() => setShowDonateForm(false)}
          onComplete={handleDonationComplete}
        />
      )}

      {/* Donation History */}
      <DonationHistory 
        donations={donations}
        isLoading={isLoading}
      />
    </div>
  );
}