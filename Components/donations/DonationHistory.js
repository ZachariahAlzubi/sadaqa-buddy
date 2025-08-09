import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Download, 
  Calendar,
  Building2,
  Receipt 
} from "lucide-react";
import { format } from "date-fns";

export default function DonationHistory({ donations, isLoading }) {
  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };
    return colors[status] || colors.processing;
  };

  const getDonationTypeColor = (type) => {
    return type === 'zakat' 
      ? "bg-emerald-100 text-emerald-800" 
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Donation History</h2>
            <p className="text-sm text-gray-600">{donations.length} total donations</p>
          </div>
        </div>
        
        {donations.length > 0 && (
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
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
      ) : donations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No donations yet</h3>
          <p className="text-gray-600 mb-6">
            Start making a difference with your first donation
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((donation) => (
            <div 
              key={donation.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/30 hover:bg-white/40 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-800">{donation.charity_name}</h3>
                    <Badge className={getDonationTypeColor(donation.donation_type)}>
                      {donation.donation_type === 'zakat' ? 'Zakat' : 'Sadaqah'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(donation.created_date), "MMM d, yyyy")}</span>
                    {donation.receipt_number && (
                      <>
                        <span>•</span>
                        <span>Receipt #{donation.receipt_number}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-lg">${donation.amount?.toFixed(2)}</p>
                  <Badge className={getStatusColor(donation.status)}>
                    {donation.status}
                  </Badge>
                </div>
                
                {donation.status === 'completed' && (
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}