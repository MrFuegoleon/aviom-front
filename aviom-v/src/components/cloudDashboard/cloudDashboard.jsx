import React from "react";
import './cloudDashboard.css'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const resourceData = [
  { name: "CPU", used: 70, allocated: 100 },
  { name: "RAM", used: 50, allocated: 100 },
  { name: "Storage", used: 30, allocated: 100 },
];

const costData = [
  { name: "Stockage", value: 300 },
  { name: "Calcul", value: 500 },
  { name: "Réseau", value: 200 },
];

const activityData = [
  { date: "Jan", requests: 100 },
  { date: "Feb", requests: 200 },
  { date: "Mar", requests: 150 },
];

const securityData = [
  { name: "Tentatives échouées", count: 15 },
  { name: "Logs d'accès", count: 80 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const CloudDashboard = () => {
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Utilisation des ressources */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Utilisation des ressources</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={resourceData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="used" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Facturation et coûts */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Facturation et coûts</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={costData} dataKey="value" nameKey="name" outerRadius={80} label>
              {costData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Statistiques d’activité */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Statistiques d’activité</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={activityData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="requests" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sécurité et alertes */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Sécurité et alertes</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={securityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#d9534f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CloudDashboard;
