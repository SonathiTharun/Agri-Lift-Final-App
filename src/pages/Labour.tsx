import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  User, 
  Users, 
  Plus, 
  Calendar, 
  MapPin, 
  Briefcase,
  Mail,
  Phone
} from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type Labour = {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  location: string;
  availability: string;
  rating: number;
  hourlyRate: number;
  contact: string;
  image: string;
};

type Team = {
  id: string;
  name: string;
  headName: string;
  memberCount: number;
  specialization: string;
  rating: number;
  dailyRate: number;
  contact: string;
  image: string;
};

type Job = {
  id: string;
  title: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Seasonal";
  payRate: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
};

const labours: Labour[] = [
  {
    id: "l1",
    name: "Rajesh Kumar",
    skills: ["Harvesting", "Planting", "Equipment Operation"],
    experience: 5,
    location: "Nashik, Maharashtra",
    availability: "Immediately",
    rating: 4.8,
    hourlyRate: 250,
    contact: "+91 9876543210",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=2432&h=3648&auto=format&fit=crop"
  },
  {
    id: "l2",
    name: "Meena Devi",
    skills: ["Seed Sowing", "Crop Maintenance", "Organic Farming"],
    experience: 3,
    location: "Pune, Maharashtra",
    availability: "Within 1 week",
    rating: 4.5,
    hourlyRate: 200,
    contact: "+91 8765432109",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=6052&h=4035&auto=format&fit=crop"
  },
  {
    id: "l3",
    name: "Suresh Patel",
    skills: ["Irrigation Systems", "Machinery Maintenance"],
    experience: 7,
    location: "Ahmedabad, Gujarat",
    availability: "Within 2 weeks",
    rating: 4.9,
    hourlyRate: 300,
    contact: "+91 7654321098",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=6000&h=4000&auto=format&fit=crop"
  }
];

const teams: Team[] = [
  {
    id: "t1",
    name: "Green Harvesters",
    headName: "Prakash Sharma",
    memberCount: 8,
    specialization: "Rice Plantation & Harvesting",
    rating: 4.7,
    dailyRate: 5000,
    contact: "+91 6543210987",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=6052&h=4035&auto=format&fit=crop"
  },
  {
    id: "t2",
    name: "Farming Solutions",
    headName: "Anita Desai",
    memberCount: 12,
    specialization: "Complete Farm Management",
    rating: 4.9,
    dailyRate: 8000,
    contact: "+91 5432109876",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=4076&h=2712&auto=format&fit=crop"
  }
];

const jobs: Job[] = [
  {
    id: "j1",
    title: "Seasonal Harvesting Labour",
    location: "Nashik, Maharashtra",
    type: "Seasonal",
    payRate: "₹250-300/hour",
    description: "Looking for experienced labourers for wheat harvesting season. Work includes cutting, gathering, and processing wheat crops.",
    requirements: ["2+ years of harvesting experience", "Knowledge of wheat harvesting techniques", "Ability to work long hours"],
    postedDate: "2023-04-15",
    deadline: "2023-04-30"
  },
  {
    id: "j2",
    title: "Full-time Farm Manager",
    location: "Pune, Maharashtra",
    type: "Full-time",
    payRate: "₹35,000-45,000/month",
    description: "Seeking a full-time farm manager to oversee daily operations, coordinate labour teams, and ensure efficient farm management.",
    requirements: ["5+ years in farm management", "Knowledge of modern farming practices", "Leadership abilities"],
    postedDate: "2023-04-12",
    deadline: "2023-05-10"
  }
];

const jobFormSchema = z.object({
  title: z.string().min(5, "Job title must be at least 5 characters"),
  location: z.string().min(3, "Location is required"),
  type: z.enum(["Full-time", "Part-time", "Contract", "Seasonal"]),
  payRate: z.string().min(1, "Pay rate is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  deadline: z.string().min(1, "Deadline is required")
});

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  contactMethod: z.enum(["email", "phone", "both"]),
  preferredDate: z.string().optional()
});

export default function Labour() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workers");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hireType, setHireType] = useState<"worker" | "team" | null>(null);
  const [selectedLabour, setSelectedLabour] = useState<Labour | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const jobForm = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      location: "",
      type: "Full-time",
      payRate: "",
      description: "",
      requirements: "",
      deadline: ""
    }
  });

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      contactMethod: "email",
      preferredDate: ""
    }
  });

  const onJobSubmit = (data: z.infer<typeof jobFormSchema>) => {
    toast({
      title: "Job Posted Successfully",
      description: "Your job has been posted and will be visible to workers soon.",
    });
    jobForm.reset();
  };

  const onContactSubmit = (data: z.infer<typeof contactFormSchema>) => {
    toast({
      title: "Appointment Request Sent",
      description: "Our team will contact you soon to confirm your appointment.",
    });
    contactForm.reset();
  };

  const handleHireNow = (labour: Labour) => {
    setSelectedLabour(labour);
    setHireType("worker");
    setDialogOpen(true);
  };

  const handleHireTeam = (team: Team) => {
    setSelectedTeam(team);
    setHireType("team");
    setDialogOpen(true);
  };

  const handleConfirmHire = () => {
    setDialogOpen(false);
    if (hireType === "worker" && selectedLabour) {
      toast({
        title: "Worker Hired!",
        description: `${selectedLabour.name} has been successfully hired.`,
      });
    } else if (hireType === "team" && selectedTeam) {
      toast({
        title: "Team Hired!",
        description: `${selectedTeam.name} has been successfully hired.`,
      });
    }
    setSelectedLabour(null);
    setSelectedTeam(null);
    setHireType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soil-light/10 to-foliage-light/10">
      <Navbar />
      
      <WeatherWidget />
      
      <main className="container mx-auto pt-20 px-4 pb-10">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-soil-dark mb-2">AgriLift Labour Management</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find skilled agricultural workers, manage teams, and post jobs for your farming needs
          </p>
        </div>
        
        <Tabs defaultValue="workers" className="max-w-5xl mx-auto" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workers">Individual Workers</TabsTrigger>
            <TabsTrigger value="teams">Labour Teams</TabsTrigger>
            <TabsTrigger value="jobs">Post Jobs</TabsTrigger>
            <TabsTrigger value="contact">Schedule Meeting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workers" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {labours.map(labour => (
                <Card key={labour.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-40 md:h-auto overflow-hidden">
                      <img 
                        src={labour.image} 
                        alt={labour.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-4">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <User className="h-5 w-5 text-foliage" />
                          {labour.name}
                        </CardTitle>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" /> 
                          {labour.location}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 py-2 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {labour.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{skill}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Experience: {labour.experience} years</span>
                          <span className="font-semibold">₹{labour.hourlyRate}/hr</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-amber-500">★★★★★</span>
                          <span className="text-sm ml-1">{labour.rating}/5</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0 pt-2 flex justify-between">
                        <div className="text-sm">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto">Contact Info</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                              <div className="flex flex-col gap-2">
                                <div className="font-medium">Contact Details</div>
                                <div className="text-sm flex items-center">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {labour.contact}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          size="sm"
                          className="bg-foliage hover:bg-foliage-dark"
                          onClick={() => handleHireNow(labour)}
                        >
                          Hire Now
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button className="bg-soil hover:bg-soil-dark">
                <Plus className="mr-1 h-4 w-4" /> Load More Workers
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="teams" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {teams.map(team => (
                <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-40 md:h-auto overflow-hidden">
                      <img 
                        src={team.image} 
                        alt={team.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-4">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Users className="h-5 w-5 text-foliage" />
                          {team.name}
                        </CardTitle>
                        <CardDescription>
                          Led by {team.headName} • {team.memberCount} members
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 py-2 space-y-2">
                        <p className="text-sm"><span className="font-medium">Specialization:</span> {team.specialization}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <span className="text-amber-500">★★★★★</span>
                            <span className="text-sm ml-1">{team.rating}/5</span>
                          </div>
                          <span className="font-semibold">₹{team.dailyRate}/day</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0 pt-2 flex justify-between">
                        <div className="text-sm">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto">Contact Info</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                              <div className="flex flex-col gap-2">
                                <div className="font-medium">Team Leader Contact</div>
                                <div className="text-sm flex items-center">
                                  <Phone className="h-4 w-4 mr-2" />
                                  {team.contact}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          size="sm"
                          className="bg-foliage hover:bg-foliage-dark"
                          onClick={() => handleHireTeam(team)}
                        >
                          Hire Team
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button className="bg-soil hover:bg-soil-dark">
                <Plus className="mr-1 h-4 w-4" /> Load More Teams
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="jobs" className="mt-6">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-foliage" />
                      Post New Job
                    </CardTitle>
                    <CardDescription>
                      Fill out the form to post a new job opportunity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...jobForm}>
                      <form onSubmit={jobForm.handleSubmit(onJobSubmit)} className="space-y-4">
                        <FormField
                          control={jobForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Seasonal Harvester" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Nashik, Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  {...field}
                                >
                                  <option value="Full-time">Full-time</option>
                                  <option value="Part-time">Part-time</option>
                                  <option value="Contract">Contract</option>
                                  <option value="Seasonal">Seasonal</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobForm.control}
                          name="payRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pay Rate</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. ₹250-300/hour" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Describe the job responsibilities..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobForm.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requirements</FormLabel>
                              <FormControl>
                                <Textarea placeholder="List the job requirements..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobForm.control}
                          name="deadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Application Deadline</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full bg-foliage hover:bg-foliage-dark">
                          Post Job
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <h3 className="text-xl font-semibold mb-4">Current Job Openings</h3>
                
                {jobs.map(job => (
                  <Card key={job.id} className="mb-4 hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {job.type}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{job.description}</p>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Pay:</span> {job.payRate}
                        </div>
                        <div>
                          <span className="font-medium">Posted:</span> {job.postedDate}
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span> {job.deadline}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Applications</Button>
                      <Button variant="destructive">Close Job</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-foliage" />
                    Schedule a Meeting
                  </CardTitle>
                  <CardDescription>
                    Request a meeting with our labour management team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                      <FormField
                        control={contactForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={contactForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={contactForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 9876543210" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={contactForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Purpose</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Briefly describe what you'd like to discuss..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={contactForm.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Meeting Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={contactForm.control}
                        name="contactMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Contact Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="email" id="email" />
                                  <Label htmlFor="email">Email</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="phone" id="phone" />
                                  <Label htmlFor="phone">Phone</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="both" id="both" />
                                  <Label htmlFor="both">Both</Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-foliage hover:bg-foliage-dark">
                        Request Meeting
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-foliage" />
                      Our Labour Management Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Rahul Sharma</h4>
                          <p className="text-sm text-gray-500">Labour Relations Manager</p>
                          <p className="text-sm text-foliage">rahul.sharma@agrilift.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Priya Patel</h4>
                          <p className="text-sm text-gray-500">Workforce Coordinator</p>
                          <p className="text-sm text-foliage">priya.patel@agrilift.com</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>How do I hire agricultural workers?</AccordionTrigger>
                        <AccordionContent>
                          You can browse available workers in the "Individual Workers" tab or teams in the "Labour Teams" tab. 
                          Once you find suitable candidates, click the "Hire Now" button to initiate the hiring process.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>What types of workers are available?</AccordionTrigger>
                        <AccordionContent>
                          We offer skilled agricultural workers for various tasks including harvesting, planting, 
                          equipment operation, and specialized farming techniques. Both individual workers and organized teams are available.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>How long does it take to process job applications?</AccordionTrigger>
                        <AccordionContent>
                          Once you post a job, it becomes visible to workers immediately. You can typically expect 
                          applications within 24-48 hours depending on the season and demand.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-foliage" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-foliage" />
                      <span>labour@agrilift.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-foliage" />
                      <span>+91 1800-123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-foliage" />
                      <span>AgriLift Labour Division, Plot 23, Agri Business Park, Pune, Maharashtra - 411001</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <ConfirmDialog
          open={dialogOpen && hireType === "worker"}
          title="Confirm Hire Worker"
          description={
            selectedLabour
              ? `Are you sure you want to hire ${selectedLabour.name}?`
              : ""
          }
          onConfirm={handleConfirmHire}
          onCancel={() => setDialogOpen(false)}
          confirmLabel="Confirm Hire"
        />
        
        <ConfirmDialog
          open={dialogOpen && hireType === "team"}
          title="Confirm Hire Team"
          description={
            selectedTeam
              ? `Are you sure you want to hire ${selectedTeam.name}?`
              : ""
          }
          onConfirm={handleConfirmHire}
          onCancel={() => setDialogOpen(false)}
          confirmLabel="Confirm Hire"
        />
      </main>
    </div>
  );
}
