import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import MilkProduction from "./MilkProduction";
import CattleManagement from "./CattleManagement";
import LivestockMarket from "./LivestockMarket";
import EquipmentMart from "./EquipmentMart";

const DairyLiftRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="milk-production" element={<MilkProduction />} />
    <Route path="cattle-management" element={<CattleManagement />} />
    <Route path="livestock-market" element={<LivestockMarket />} />
    <Route path="equipment-mart" element={<EquipmentMart />} />
  </Routes>
);

export default DairyLiftRoutes; 