
import React, { useState, useEffect } from "react";
import { Transaction, Pledge, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, TrendingUp } from "lucide-react";

export default function TransactionForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    merchant_name: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    category: "",
    account_last_four: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roundUpAmount, setRoundUpAmount] = useState(0);

  const categories = [
    "Food & Dining",
    "Shopping",
    "Gas & Transportation",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other"
  ];

  useEffect(() => {
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setRoundUpAmount(0);
      return;
    }
    // Only calculate for non-whole numbers
    if (numAmount % 1 !== 0) {
      const roundup = Math.ceil(numAmount) - numAmount;
      setRoundUpAmount(parseFloat(roundup.toFixed(2)));
    } else {
      setRoundUpAmount(0);
    }
  }, [formData.amount]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.merchant_name || !formData.amount) return;

    setIsSubmitting(true);
    try {
      const amount = parseFloat(formData.amount);
      const transactionData = {
        ...formData,
        amount,
        round_up_amount: roundUpAmount,
        status: roundUpAmount > 0 ? 'pledged' : 'pending'
      };

      const newTransaction = await Transaction.create(transactionData);
      
      if (roundUpAmount > 0) {
        // Create a pledge
        await Pledge.create({
          transaction_id: newTransaction.id,
          amount: roundUpAmount,
          status: 'pending'
        });

        // Update user's pending pledges
        const user = await User.me();
        const currentPledges = user.pending_pledges || 0;
        await User.updateMyUserData({
          pending_pledges: currentPledges + roundUpAmount
        });
      }
      
      onSave();
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>
          <p className="text-gray-600">Manually add a purchase for round-up</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="merchant_name">Merchant Name *</Label>
            <Input
              id="merchant_name"
              value={formData.merchant_name}
              onChange={(e) => handleInputChange('merchant_name', e.target.value)}
              placeholder="e.g., Starbucks"
              className="bg-white/50 border-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="e.g., 4.35"
              className="bg-white/50 border-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="bg-white/50 border-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className="bg-white/50 border-white/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_last_four">Account (Last 4 digits)</Label>
            <Input
              id="account_last_four"
              value={formData.account_last_four}
              onChange={(e) => handleInputChange('account_last_four', e.target.value)}
              placeholder="1234"
              maxLength={4}
              className="bg-white/50 border-white/50"
            />
          </div>

          {roundUpAmount > 0 && (
            <div className="glass-card rounded-xl p-4 bg-emerald-50/30 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Round-up Amount:</span>
                </div>
                <span className="font-semibold text-lg text-emerald-600">
                  +${roundUpAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
            disabled={isSubmitting || !formData.merchant_name || !formData.amount}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
          >
            {isSubmitting ? (
              "Adding..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Add Transaction
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}