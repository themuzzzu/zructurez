
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
import { Badge } from "@/components/ui/badge";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string | null>(null);
  const navigate = useNavigate();

  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      type: "mnc",
      employmentType: "full-time",
      salary: 130000,
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York, NY",
      type: "mnc",
      employmentType: "full-time",
      salary: 145000,
      posted: "1 day ago",
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Creative Studio",
      location: "Los Angeles, CA",
      type: "local",
      employmentType: "part-time",
      salary: 95000,
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Administrative Assistant",
      company: "Government Office",
      location: "Washington, DC",
      type: "government",
      employmentType: "full-time",
      salary: 50000,
      posted: "5 days ago",
    },
    {
      id: 5,
      title: "Content Writer",
      company: "Media Group",
      location: "Chicago, IL",
      type: "local",
      employmentType: "freelance",
      salary: 70000,
      posted: "1 week ago",
    },
    {
      id: 6,
      title: "Marketing Consultant",
      company: "Brand Builders",
      location: "Remote",
      type: "mnc",
      employmentType: "freelance",
      salary: 85000,
      posted: "2 weeks ago",
    },
    {
      id: 7,
      title: "Part-time Accountant",
      company: "Small Business Solutions",
      location: "Boston, MA",
      type: "local",
      employmentType: "part-time",
      salary: 45000,
      posted: "3 days ago",
    }
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

  const getEmploymentTypeBadgeColor = (type: string): string => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "part-time":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "freelance":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const employmentTypeOptions = ["all", "full-time", "part-time", "freelance"];

  const filteredJobs = jobs.filter((job) => {
    const matchesJobType = selectedJobType ? job.type === selectedJobType : true;
    const matchesSalaryRange = selectedSalaryRange 
      ? getSalaryRange(job.salary) === selectedSalaryRange 
      : true;
    const matchesLocation = selectedLocation 
      ? job.location.toLowerCase().includes(selectedLocation.toLowerCase()) 
      : true;
    const matchesEmploymentType = selectedEmploymentType && selectedEmploymentType !== "all"
      ? job.employmentType === selectedEmploymentType
      : true;
    const matchesSearch = searchQuery
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesJobType && matchesSalaryRange && matchesLocation && matchesSearch && matchesEmploymentType;
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
              
              <div className="mt-2">
                <h3 className="text-sm font-medium mb-2">Employment Type</h3>
                <div className="flex flex-wrap gap-2">
                  {employmentTypeOptions.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className={`cursor-pointer ${
                        selectedEmploymentType === type ? 
                        getEmploymentTypeBadgeColor(type) : 
                        "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedEmploymentType(type)}
                    >
                      {type === "all" ? "All Types" : 
                        type.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join('-')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredJobs.length === 0 ? (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                </Card>
              ) : (
                filteredJobs.map((job) => (
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
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            className={getEmploymentTypeBadgeColor(job.employmentType)}
                          >
                            {job.employmentType.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join('-')}
                          </Badge>
                          <Button>Apply Now</Button>
                        </div>
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
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
