
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Sprout, Scissors, Droplets } from 'lucide-react';
import { getCropById } from '@/data/cropsDatabase';

interface SelectedCrop {
  id: string;
  name: string;
  area: number;
  percentage: number;
  estimatedYield: number;
}

interface CropCalendarProps {
  selectedCrops: SelectedCrop[];
}

interface CropActivity {
  month: number;
  activity: string;
  cropName: string;
  icon: React.ReactNode;
  color: string;
}

const CropCalendar: React.FC<CropCalendarProps> = ({ selectedCrops }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const generateCalendarActivities = (): CropActivity[] => {
    const activities: CropActivity[] = [];

    selectedCrops.forEach(crop => {
      const cropData = getCropById(crop.id);
      if (!cropData) return;

      // Planting activities
      cropData.plantingSeasons.forEach(season => {
        let plantingMonths: number[] = [];
        
        switch (season) {
          case "Winter":
            plantingMonths = [10, 11]; // Nov, Dec
            break;
          case "Spring":
            plantingMonths = [2, 3]; // Mar, Apr
            break;
          case "Summer":
            plantingMonths = [4, 5]; // May, Jun
            break;
          case "Monsoon":
            plantingMonths = [6, 7]; // Jul, Aug
            break;
          case "Autumn":
            plantingMonths = [8, 9]; // Sep, Oct
            break;
        }

        plantingMonths.forEach(month => {
          activities.push({
            month,
            activity: "Planting",
            cropName: crop.name,
            icon: <Sprout className="h-4 w-4" />,
            color: "bg-green-100 text-green-800 border-green-200"
          });
        });
      });

      // Harvesting activities
      cropData.harvestMonths.forEach(harvestMonth => {
        if (harvestMonth === "Year-round with proper care") {
          // For year-round crops like tomato, add harvest activities every 2 months
          [1, 3, 5, 7, 9, 11].forEach(month => {
            activities.push({
              month,
              activity: "Harvesting",
              cropName: crop.name,
              icon: <Scissors className="h-4 w-4" />,
              color: "bg-orange-100 text-orange-800 border-orange-200"
            });
          });
        } else {
          const monthIndex = months.findIndex(month => 
            harvestMonth.toLowerCase().includes(month.toLowerCase())
          );
          if (monthIndex !== -1) {
            activities.push({
              month: monthIndex,
              activity: "Harvesting",
              cropName: crop.name,
              icon: <Scissors className="h-4 w-4" />,
              color: "bg-orange-100 text-orange-800 border-orange-200"
            });
          }
        }
      });

      // Add irrigation activities (every month for high water crops)
      if (cropData.waterUsage === "high") {
        for (let month = 0; month < 12; month++) {
          activities.push({
            month,
            activity: "Intensive Irrigation",
            cropName: crop.name,
            icon: <Droplets className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-800 border-blue-200"
          });
        }
      }
    });

    return activities.sort((a, b) => a.month - b.month);
  };

  const activities = generateCalendarActivities();
  const currentMonthActivities = activities.filter(activity => activity.month === selectedMonth);

  const getActivitySummaryForMonth = (monthIndex: number) => {
    const monthActivities = activities.filter(activity => activity.month === monthIndex);
    const plantingCount = monthActivities.filter(a => a.activity === "Planting").length;
    const harvestingCount = monthActivities.filter(a => a.activity === "Harvesting").length;
    const irrigationCount = monthActivities.filter(a => a.activity === "Intensive Irrigation").length;

    return { plantingCount, harvestingCount, irrigationCount };
  };

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Crop Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {months.map((month, index) => {
              const summary = getActivitySummaryForMonth(index);
              const totalActivities = summary.plantingCount + summary.harvestingCount + summary.irrigationCount;
              
              return (
                <Button
                  key={month}
                  variant={selectedMonth === index ? "default" : "outline"}
                  className={`p-3 h-auto flex flex-col items-center ${
                    selectedMonth === index ? "bg-foliage text-white" : ""
                  }`}
                  onClick={() => setSelectedMonth(index)}
                >
                  <span className="text-sm font-medium">{month.slice(0, 3)}</span>
                  {totalActivities > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="mt-1 text-xs bg-white text-gray-700"
                    >
                      {totalActivities}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Month Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Activities for {months[selectedMonth]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentMonthActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No farming activities scheduled for this month</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Group activities by type */}
              {["Planting", "Harvesting", "Intensive Irrigation"].map(activityType => {
                const typeActivities = currentMonthActivities.filter(a => a.activity === activityType);
                if (typeActivities.length === 0) return null;

                return (
                  <div key={activityType} className="space-y-2">
                    <h4 className="font-medium text-gray-700 border-b pb-1">
                      {activityType}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {typeActivities.map((activity, index) => (
                        <div
                          key={`${activity.cropName}-${activity.activity}-${index}`}
                          className={`p-3 rounded-lg border flex items-center space-x-3 ${activity.color}`}
                        >
                          {activity.icon}
                          <div>
                            <span className="font-medium">{activity.cropName}</span>
                            <p className="text-sm opacity-75">{activity.activity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Year Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Year Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
            {months.map((month, index) => {
              const summary = getActivitySummaryForMonth(index);
              const hasPlanting = summary.plantingCount > 0;
              const hasHarvesting = summary.harvestingCount > 0;
              const hasIrrigation = summary.irrigationCount > 0;

              return (
                <div key={month} className="text-center">
                  <div className="text-xs font-medium mb-2">{month.slice(0, 3)}</div>
                  <div className="space-y-1">
                    {hasPlanting && (
                      <div className="h-2 bg-green-400 rounded-sm" title="Planting" />
                    )}
                    {hasHarvesting && (
                      <div className="h-2 bg-orange-400 rounded-sm" title="Harvesting" />
                    )}
                    {hasIrrigation && (
                      <div className="h-1 bg-blue-400 rounded-sm" title="Irrigation" />
                    )}
                    {!hasPlanting && !hasHarvesting && !hasIrrigation && (
                      <div className="h-2 bg-gray-200 rounded-sm" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center">
              <div className="w-4 h-2 bg-green-400 rounded-sm mr-2" />
              <span>Planting</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-2 bg-orange-400 rounded-sm mr-2" />
              <span>Harvesting</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-1 bg-blue-400 rounded-sm mr-2" />
              <span>Irrigation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropCalendar;
