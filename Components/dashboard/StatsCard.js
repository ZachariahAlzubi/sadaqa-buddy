import React from "react";

const colorClasses = {
  emerald: "from-emerald-400 to-emerald-500",
  teal: "from-teal-400 to-teal-500",
  amber: "from-amber-400 to-amber-500",
  rose: "from-rose-400 to-rose-500",
  blue: "from-blue-400 to-blue-500",
};

export default function StatsCard({ title, value, icon: Icon, color = "emerald" }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}