import React, { useState, useEffect } from "react";
import { Transaction, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus,
  TrendingUp,
  X
} from "lucide-react";
import { format } from "date-fns";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionFilters from "../components/transactions/TransactionFilters";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    dateRange: "all"
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filters]);

  const loadTransactions = async () => {
    try {
      const user = await User.me();
      const data = await Transaction.filter(
        { created_by: user.email },
        '-created_date'
      );
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
    setIsLoading(false);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(t => t.category === filters.category);
    }

    setFilteredTransactions(filtered);
  };

  const handleTransactionAdded = () => {
    setShowForm(false);
    loadTransactions();
  };

  const calculateRoundUp = (amount) => {
    return Math.ceil(amount) - amount;
  };

  const toggleExclude = async (transaction) => {
    try {
      await Transaction.update(transaction.id, {
        excluded: !transaction.excluded,
        status: transaction.excluded ? 'pending' : 'excluded'
      });
      loadTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      pledged: "bg-blue-100 text-blue-800",
      donated: "bg-green-100 text-green-800",
      excluded: "bg-gray-100 text-gray-800"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
              <p className="text-gray-600">Track your purchases and round-ups</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/50"
            />
          </div>
          <TransactionFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSave={handleTransactionAdded}
        />
      )}

      {/* Transactions List */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Transactions ({filteredTransactions.length})
          </h2>
          {filteredTransactions.length > 0 && (
            <p className="text-sm text-gray-600">
              Total Round-ups: ${filteredTransactions
                .filter(t => !t.excluded)
                .reduce((sum, t) => sum + (t.round_up_amount || 0), 0)
                .toFixed(2)}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="w-24 h-3 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="w-12 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.status !== "all" 
                ? "Try adjusting your search or filters"
                : "Add your first transaction to start rounding up for charity"
              }
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/30 hover:bg-white/40 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{transaction.merchant_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </span>
                      {transaction.category && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{transaction.category}</span>
                        </>
                      )}
                      {transaction.account_last_four && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">••••{transaction.account_last_four}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${transaction.amount?.toFixed(2)}</p>
                    {!transaction.excluded && transaction.round_up_amount > 0 && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-sm font-medium">+${transaction.round_up_amount?.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExclude(transaction)}
                      className={`text-xs ${transaction.excluded ? 'text-gray-500' : 'text-red-500'}`}
                    >
                      {transaction.excluded ? 'Include' : 'Exclude'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}