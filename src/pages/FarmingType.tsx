
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FarmingType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("dairy");

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">
              Specialized Farming Resources
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Select your farming type to access specialized content, tools and resources tailored to your specific agricultural activities.
              Our experts have curated comprehensive information to help you optimize your farming operations.
            </p>
          </div>

          <Tabs defaultValue="dairy" value={selectedType} onValueChange={setSelectedType} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="dairy" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
                  🐄 Dairy
                </TabsTrigger>
                <TabsTrigger value="poultry" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
                  🐔 Poultry
                </TabsTrigger>
                <TabsTrigger value="marine" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
                  🐟 Marine
                </TabsTrigger>
                <TabsTrigger value="bee" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
                  🐝 Bee
                </TabsTrigger>
                <TabsTrigger value="organic" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800">
                  🌿 Organic
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Dairy Farming Content */}
            <TabsContent value="dairy" className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Dairy Farming</h2>
                <p className="text-gray-700">
                  Access comprehensive resources for dairy farming, including breed information, nutrition guidelines,
                  milking techniques, disease management, and marketing strategies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Breeds & Genetics</CardTitle>
                    <CardDescription>Information about cow and buffalo breeds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Holstein-Friesian, Jersey, Sahiwal</li>
                      <li>Murrah, Jaffarabadi, Mehsana buffalo</li>
                      <li>Cross-breeding programs</li>
                      <li>Genetic improvement techniques</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feed & Nutrition</CardTitle>
                    <CardDescription>Feed management and nutrition guides</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Balanced feed formulations</li>
                      <li>Fodder cultivation techniques</li>
                      <li>Silage preparation</li>
                      <li>Mineral supplements</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Milking & Equipment</CardTitle>
                    <CardDescription>Milking techniques and equipment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Hand vs. machine milking</li>
                      <li>Milking parlor setup</li>
                      <li>Hygiene protocols</li>
                      <li>Milk storage solutions</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disease Management</CardTitle>
                    <CardDescription>Prevention and treatment of common diseases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Mastitis prevention</li>
                      <li>Vaccination schedules</li>
                      <li>Foot and mouth disease control</li>
                      <li>Parasite management</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Marketing & Storage</CardTitle>
                    <CardDescription>Milk collection, storage, and marketing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Cooling and preservation methods</li>
                      <li>Quality testing protocols</li>
                      <li>Dairy cooperatives</li>
                      <li>Direct marketing strategies</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Government Schemes</CardTitle>
                    <CardDescription>Subsidies and support for dairy farmers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Dairy entrepreneurship development</li>
                      <li>Loan schemes for dairy farming</li>
                      <li>Insurance programs</li>
                      <li>Training and skill development</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-10 text-center">
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/export")}>
                  Sell Your Dairy Products
                </Button>
              </div>
            </TabsContent>

            {/* Poultry Farming Content */}
            <TabsContent value="poultry" className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Poultry Farming</h2>
                <p className="text-gray-700">
                  Resources for poultry farming, including types of poultry farming, breed information, 
                  feed management, disease control, and market insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Broiler vs Layer</CardTitle>
                    <CardDescription>Different types of poultry farming</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Economic comparison</li>
                      <li>Setup requirements</li>
                      <li>Management differences</li>
                      <li>Investment analysis</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Breed Selection</CardTitle>
                    <CardDescription>Chicken breeds and their productivity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Commercial breeds (Leghorn, Rhode Island)</li>
                      <li>Indigenous breeds (Kadaknath, Aseel)</li>
                      <li>Hybrid varieties</li>
                      <li>Selection criteria</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feed Management</CardTitle>
                    <CardDescription>Nutrition and feeding practices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Feed formulation by age</li>
                      <li>Protein and energy requirements</li>
                      <li>Feed supplements</li>
                      <li>Water management</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Disease Control</CardTitle>
                    <CardDescription>Vaccination and health management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Vaccination schedules</li>
                      <li>Biosecurity measures</li>
                      <li>Common disease identification</li>
                      <li>Treatment protocols</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Processing & Marketing</CardTitle>
                    <CardDescription>Egg and meat processing tips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Egg grading and storage</li>
                      <li>Meat processing techniques</li>
                      <li>Packaging standards</li>
                      <li>Value-added products</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Updates</CardTitle>
                    <CardDescription>Pricing trends and market information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Current egg and meat prices</li>
                      <li>Seasonal demand patterns</li>
                      <li>Market forecasts</li>
                      <li>Export opportunities</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-10 text-center">
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/export")}>
                  Sell Your Poultry Products
                </Button>
              </div>
            </TabsContent>

            {/* Marine Farming Content */}
            <TabsContent value="marine" className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Marine Farming (Aquaculture)</h2>
                <p className="text-gray-700">
                  Resources for aquaculture, including fish and crustacean farming, pond setup,
                  water quality management, and sustainable practices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Species Selection</CardTitle>
                    <CardDescription>Types of fish and crustaceans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Freshwater fish (Rohu, Catla, Common Carp)</li>
                      <li>Brackish water species (Sea Bass, Pearl Spot)</li>
                      <li>Crustaceans (Shrimp, Prawns, Crabs)</li>
                      <li>Ornamental fish</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pond Setup</CardTitle>
                    <CardDescription>Tank setup and water quality control</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Pond construction guidelines</li>
                      <li>Aeration systems</li>
                      <li>Water filtration</li>
                      <li>Stocking density</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feed & Growth</CardTitle>
                    <CardDescription>Feed and growth monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Commercial feeds vs natural feeds</li>
                      <li>Feeding schedules</li>
                      <li>Growth monitoring techniques</li>
                      <li>Feed conversion ratio</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Health Management</CardTitle>
                    <CardDescription>Disease prevention and treatment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Common diseases identification</li>
                      <li>Preventive measures</li>
                      <li>Treatment protocols</li>
                      <li>Water quality maintenance</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Licensing & Compliance</CardTitle>
                    <CardDescription>Legal requirements and sustainability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>License application process</li>
                      <li>Environmental compliance</li>
                      <li>Sustainable practices</li>
                      <li>Quality certifications</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Insights</CardTitle>
                    <CardDescription>Trends in seafood market</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Price trends for various species</li>
                      <li>Local and export markets</li>
                      <li>Value-added products</li>
                      <li>Cold chain logistics</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-10 text-center">
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/export")}>
                  Sell Your Aquaculture Products
                </Button>
              </div>
            </TabsContent>

            {/* Bee Farming Content */}
            <TabsContent value="bee" className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Bee Farming (Apiculture)</h2>
                <p className="text-gray-700">
                  Resources for beekeeping, including bee types, hive management, 
                  honey extraction, and marketing of bee products.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bee Types</CardTitle>
                    <CardDescription>Types of bees and beekeeping techniques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>European honey bee (Apis mellifera)</li>
                      <li>Indian honey bee (Apis cerana)</li>
                      <li>Stingless bees (Tetragonula)</li>
                      <li>Queen rearing techniques</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hive Management</CardTitle>
                    <CardDescription>Hive setup and maintenance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Langstroth, Top-bar and traditional hives</li>
                      <li>Hive placement and orientation</li>
                      <li>Colony inspection techniques</li>
                      <li>Swarm prevention</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Honey Production</CardTitle>
                    <CardDescription>Honey extraction and processing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Uncapping techniques</li>
                      <li>Manual and electric extractors</li>
                      <li>Filtering and bottling</li>
                      <li>Quality testing</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>By-Products</CardTitle>
                    <CardDescription>Pollen and wax harvesting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Beeswax collection and processing</li>
                      <li>Pollen trapping methods</li>
                      <li>Royal jelly production</li>
                      <li>Propolis collection</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Safety & Care</CardTitle>
                    <CardDescription>Safety measures and seasonal care</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Protective equipment</li>
                      <li>Handling techniques</li>
                      <li>Seasonal management</li>
                      <li>Disease prevention</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Markets</CardTitle>
                    <CardDescription>Markets for honey and by-products</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Direct marketing strategies</li>
                      <li>Wholesale channels</li>
                      <li>Value-added products</li>
                      <li>Organic certification</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-10 text-center">
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/export")}>
                  Sell Your Bee Products
                </Button>
              </div>
            </TabsContent>

            {/* Organic Farming Content */}
            <TabsContent value="organic" className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Organic Farming</h2>
                <p className="text-gray-700">
                  Resources for organic farming, including conversion processes, certification, 
                  natural fertilizers, pest management, and marketing organic produce.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organic vs Conventional</CardTitle>
                    <CardDescription>Comparison of farming methods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Environmental impact comparison</li>
                      <li>Health benefits analysis</li>
                      <li>Yield differences</li>
                      <li>Economic considerations</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Certification Process</CardTitle>
                    <CardDescription>Steps to get organic certification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Conversion period requirements</li>
                      <li>Documentation needed</li>
                      <li>Inspection procedures</li>
                      <li>Certification agencies</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Natural Solutions</CardTitle>
                    <CardDescription>Organic fertilizers and pest control</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Compost preparation</li>
                      <li>Vermicomposting</li>
                      <li>Biopesticides and natural repellents</li>
                      <li>Biological control agents</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Farming Techniques</CardTitle>
                    <CardDescription>Crop rotation and companion planting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Multi-year rotation plans</li>
                      <li>Beneficial plant combinations</li>
                      <li>Green manuring practices</li>
                      <li>Intercropping strategies</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Connections</CardTitle>
                    <CardDescription>Organic market linkages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Direct marketing channels</li>
                      <li>Organic food retailers</li>
                      <li>Export opportunities</li>
                      <li>Community Supported Agriculture (CSA)</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Analysis</CardTitle>
                    <CardDescription>Cost and profit analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Conversion cost considerations</li>
                      <li>Premium pricing strategies</li>
                      <li>ROI calculations</li>
                      <li>Subsidy programs</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-10 text-center">
                <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => navigate("/export")}>
                  Sell Your Organic Products
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Features Section */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-center text-emerald-800 mb-8">Resources For All Farming Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>How-To Guides</CardTitle>
                  <CardDescription>Step-by-step instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Detailed guides on various farming operations with visual aids and practical tips.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>Learn from other farmers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Real-life experiences and strategies from successful farmers across India.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Training & Webinars</CardTitle>
                  <CardDescription>Virtual learning opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Access online courses, webinars, and workshops led by agricultural experts.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Expert Q&A</CardTitle>
                  <CardDescription>Get your questions answered</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Submit your farming queries to our panel of agricultural specialists.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Resource Library</CardTitle>
                  <CardDescription>Educational materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Download PDFs, videos, and tutorials on various farming practices.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Local Contacts</CardTitle>
                  <CardDescription>Connect with resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Find suppliers, government offices, veterinarians, and other services near you.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>Smart farming insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Get personalized suggestions for breeds, pricing, feed plans, and more.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle>Chatbot Support</CardTitle>
                  <CardDescription>Instant assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Get quick answers to common questions and troubleshooting help.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-emerald-100 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">Ready to Start or Upgrade Your Farm?</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Our team of agricultural experts is ready to help you with personalized guidance and support
              tailored to your specific farming needs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button className="bg-emerald-700 hover:bg-emerald-800">Contact an Expert</Button>
              <Button className="bg-white text-emerald-700 border border-emerald-700 hover:bg-emerald-50">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default FarmingType;
