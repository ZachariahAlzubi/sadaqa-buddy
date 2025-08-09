import React, { useState, useEffect } from "react";
import { Charity, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Search, 
  Filter,
  Heart,
  CheckCircle,
  Star
} from "lucide-react";
import CharityCard from "../components/charities/CharityCard";
import CharityFilters from "../components/charities/CharityFilters";

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [filteredCharities, setFilteredCharities] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    zakat_eligible: "all"
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCharities();
  }, [charities, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [charityData, currentUser] = await Promise.all([
        Charity.list(),
        User.me()
      ]);
      
      setCharities(charityData);
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const filterCharities = () => {
    let filtered = [...charities];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(charity => 
        charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charity.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(charity => charity.category === filters.category);
    }

    // Zakat eligibility filter
    if (filters.zakat_eligible !== "all") {
      filtered = filtered.filter(charity => 
        filters.zakat_eligible === "true" ? charity.zakat_eligible : !charity.zakat_eligible
      );
    }

    setFilteredCharities(filtered);
  };

  const handleSetPreferred = async (charityId) => {
    try {
      await User.updateMyUserData({ preferred_charity: charityId });
      setUser(prev => ({ ...prev, preferred_charity: charityId }));
    } catch (error) {
      console.error("Error setting preferred charity:", error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Islamic Charities</h1>
              <p className="text-gray-600">Choose organizations for your donations</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Available Charities</p>
            <p className="text-2xl font-bold text-gray-800">{charities.length}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search charities by name, category, or cause..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/50"
            />
          </div>
          <CharityFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Preferred Charity */}
      {user?.preferred_charity && (
        <div className="glass-card rounded-3xl p-6 border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800">Your Preferred Charity</h3>
              <p className="text-sm text-emerald-700">This charity will receive your automatic donations</p>
            </div>
          </div>
          {charities
            .filter(c => c.id === user.preferred_charity)
            .map(charity => (
              <CharityCard
                key={charity.id}
                charity={charity}
                isPreferred={true}
                onSetPreferred={handleSetPreferred}
                showPreferredBadge={false}
              />
            ))
          }
        </div>
      )}

      {/* Charities Grid */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            All Charities ({filteredCharities.length})
          </h2>
          {user?.donation_mode && (
            <Badge className={user.donation_mode === 'zakat' ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}>
              {user.donation_mode === 'zakat' ? 'Showing Zakat Eligible' : 'Sadaqah Mode'}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="glass-card rounded-2xl p-6">
                  <div className="w-full h-32 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="w-3/4 h-5 bg-gray-300 rounded mb-2"></div>
                  <div className="w-full h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-gray-300 rounded"></div>
                    <div className="w-20 h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCharities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No charities found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.category !== "all" 
                ? "Try adjusting your search or filters"
                : "No charities are available at the moment"
              }
            </p>
            {(searchTerm || filters.category !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilters({ category: "all", zakat_eligible: "all" });
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharities.map((charity) => (
              <CharityCard
                key={charity.id}
                charity={charity}
                isPreferred={user?.preferred_charity === charity.id}
                onSetPreferred={handleSetPreferred}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}