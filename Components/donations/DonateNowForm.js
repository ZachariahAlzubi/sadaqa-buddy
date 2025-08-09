import React, { useState, useEffect } from "react";
import { Donation, Charity } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Heart, CreditCard } from "lucide-react";

export default function DonateNowForm({ pendingAmount, onClose, onComplete }) {
  const [charities, setCharities] = useState([]);
  const [formData, setFormData] = useState({
    amount: pendingAmount.toFixed(2),
    charity_id: "",
    donation_type: "sadaqah",
    payment_method: "credit_card"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCharities();
  }, []);

  const loadCharities = async () => {
    try {
      const charityData = await Charity.list();
      setCharities(charityData);
      if (charityData.length > 0) {
        setFormData(prev => ({ ...prev, charity_id: charityData[0].id }));
      }
    } catch (error) {
      console.error("Error loading charities:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.charity_id || !formData.amount) return;

    setIsSubmitting(true);
    try {
      const selectedCharity = charities.find(c => c.id === formData.charity_id);
      
      const donationData = {
        amount: parseFloat(formData.amount),
        charity_name: selectedCharity?.name || "Unknown Charity",
        charity_id: formData.charity_id,
        donation_type: formData.donation_type,
        payment_method: formData.payment_method,
        status: "completed",
        receipt_number: `RCP-${Date.now()}`
      };

      await Donation.create(donationData);
      
      onComplete();
    } catch (error) {
      console.error("Error processing donation:", error);
    }
    setIsSubmitting(false);
  };

  const selectedCharity = charities.find(c => c.id === formData.charity_id);

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Make a Donation</h2>
            <p className="text-gray-600">Support a charity of your choice</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="bg-white/50 border-white/50 text-lg font-semibold"
              required
            />
            <p className="text-sm text-gray-600">
              Pending round-ups: ${pendingAmount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="donation_type">Donation Type</Label>
            <Select
              value={formData.donation_type}
              onValueChange={(value) => handleInputChange('donation_type', value)}
            >
              <SelectTrigger className="bg-white/50 border-white/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sadaqah">Sadaqah (Voluntary)</SelectItem>
                <SelectItem value="zakat">Zakat (Obligatory)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="charity">Choose Charity *</Label>
            <Select
              value={formData.charity_id}
              onValueChange={(value) => handleInputChange('charity_id', value)}
              required
            >
              <SelectTrigger className="bg-white/50 border-white/50">
                <SelectValue placeholder="Select a charity" />
              </SelectTrigger>
              <SelectContent>
                {charities.map((charity) => (
                  <SelectItem key={charity.id} value={charity.id}>
                    <div className="flex items-center gap-2">
                      <span>{charity.name}</span>
                      {charity.zakat_eligible && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                          Zakat Eligible
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCharity && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedCharity.description}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => handleInputChange('payment_method', value)}
            >
              <SelectTrigger className="bg-white/50 border-white/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="apple_pay">Apple Pay</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card rounded-2xl p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h3 className="font-semibold text-gray-800 mb-3">Donation Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">${formData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{formData.donation_type === 'zakat' ? 'Zakat' : 'Sadaqah'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Charity:</span>
              <span className="font-medium">{selectedCharity?.name || 'Select charity'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.charity_id}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Donate ${formData.amount}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}