import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function TransactionFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex items-center gap-3">
      <Filter className="w-4 h-4 text-gray-400" />
      
      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-32 bg-white/50 border-white/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="pledged">Pledged</SelectItem>
          <SelectItem value="donated">Donated</SelectItem>
          <SelectItem value="excluded">Excluded</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(value) => handleFilterChange('category', value)}
      >
        <SelectTrigger className="w-36 bg-white/50 border-white/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Food & Dining">Food & Dining</SelectItem>
          <SelectItem value="Shopping">Shopping</SelectItem>
          <SelectItem value="Gas & Transportation">Transportation</SelectItem>
          <SelectItem value="Entertainment">Entertainment</SelectItem>
          <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}