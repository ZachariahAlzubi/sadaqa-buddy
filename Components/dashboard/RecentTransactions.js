import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { CreditCard, ArrowUpRight, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function RecentTransactions({ transactions, isLoading }) {
  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        <Link to={createPageUrl("Transactions")}>
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/30 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
                <div>
                  <div className="w-24 h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-4 bg-gray-300 rounded mb-1"></div>
                <div className="w-12 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No transactions yet</p>
          <p className="text-sm text-gray-400">Connect your bank account to start rounding up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30 hover:bg-white/40 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.merchant_name}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(transaction.date), "MMM d")} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">${transaction.amount?.toFixed(2)}</p>
                {transaction.round_up_amount > 0 && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-sm font-medium">+${transaction.round_up_amount?.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}