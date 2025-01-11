import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Briefcase, MapPin, Building, Clock, ListPlus, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateBusinessListing } from "@/components/CreateBusinessListing";
import { useNavigate } from "react-router-dom";
import { CategoryFilter } from "@/components/CategoryFilter";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      type: "mnc",
      salary: 130000,
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York, NY",
      type: "mnc",
      salary: 145000,
      posted: "1 day ago",
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Creative Studio",
      location: "Los Angeles, CA",
      type: "local",
      salary: 95000,
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Administrative Assistant",
      company: "Government Office",
      location: "Washington, DC",
      type: "government",
      salary: 50000,
      posted: "5 days ago",
    },
  ];

  const getSalaryRange = (salary: number): string => {
    if (salary <= 50000) return "0-50000";
    if (salary <= 100000) return "50000-100000";
    if (salary <= 150000) return "100000-150000";
    return "150000+";
  };

  const formatSalary = (salary: number): string => {
    return `$${salary.toLocaleString()}`;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesJobType = selectedJobType ? job.type === selectedJobType : true;
    const matchesSalaryRange = selectedSalaryRange 
      ? getSalaryRange(job.salary) === selectedSalaryRange 
      : true;
    const matchesLocation = selectedLocation 
      ? job.location.toLowerCase().includes(selectedLocation.toLowerCase()) 
      : true;
    const matchesSearch = searchQuery
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesJobType && matchesSalaryRange && matchesLocation && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-16 shrink-0" />
          <main className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-4 flex-1">
                  <Input
                    placeholder="Search jobs by title, company, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-xl"
                  />
                  <Button>Search</Button>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <ListPlus className="h-4 w-4" />
                      Post a Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                    <CreateBusinessListing onClose={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <CategoryFilter 
                onCategorySelect={() => {}} 
                onJobTypeSelect={setSelectedJobType}
                onSalaryRangeSelect={setSelectedSalaryRange}
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>

            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">{job.title}</h2>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type === 'government' ? 'Government' : 
                         job.type === 'local' ? 'Local' : 
                         job.type === 'mnc' ? 'MNC' : job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Salary: </span>
                      {formatSalary(job.salary)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Jobs;