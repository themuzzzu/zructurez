import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Briefcase, MapPin, Building, Clock, ListPlus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateBusinessListing } from "@/components/CreateBusinessListing";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      posted: "1 day ago",
    },
    {
      id: 3,
      title: "UX Designer",
      company: "Creative Studio",
      location: "Los Angeles, CA",
      type: "Contract",
      salary: "$90,000 - $120,000",
      posted: "3 days ago",
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-16 px-4">
        <div className="flex gap-6">
          <Sidebar className="w-64 hidden lg:block sticky top-16 shrink-0" />
          <main className="flex-1 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Find Your Next Opportunity</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <ListPlus className="h-4 w-4" />
                      Post a Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <CreateBusinessListing onClose={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-4">
                <Input
                  placeholder="Search jobs by title, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xl"
                />
                <Button>Search</Button>
              </div>
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
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Salary Range: </span>
                      {job.salary}
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