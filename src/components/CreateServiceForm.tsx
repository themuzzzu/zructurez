import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LocationSelector } from "./LocationSelector";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "Plumbing",
  "Electrical",
  "Computer Repair",
  "Beauty Services",
  "Home Cleaning",
  "Moving Services",
  "Painting",
  "Pest Control",
  "Photography",
  "Laundry",
  "Wellness",
  "Pet Care",
  "Tutoring",
  "Internet Services",
  "Automotive",
  "Catering",
  "Childcare",
  "Gardening",
  "Music Lessons",
  "Fitness Training",
  "Healthcare"
];

export const CreateServiceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    contact_info: "",
    availability: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const validatePhoneNumber = (number: string) => {
    // Allow +91 prefix and 10 digits
    const phoneRegex = /^(\+91[-\s]?)?[0-9]{10}$/;
    return phoneRegex.test(number.replace(/\s+/g, ''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location: string) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please log in to create a service");
      return;
    }

    if (!validatePhoneNumber(formData.contact_info)) {
      toast.error("Please enter a valid Indian mobile number (+91XXXXXXXXXX or 10 digits)");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('services').insert([
        {
          user_id: userId,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          location: formData.location,
          contact_info: formData.contact_info,
          availability: formData.availability
        }
      ]);

      if (error) throw error;

      toast.success("Service created successfully!");
      navigate('/services');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to create service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          name="title"
          placeholder="Service Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {formData.category
                ? categories.find(
                    (category) => category.toLowerCase() === formData.category.toLowerCase()
                  ) || "Select category..."
                : "Select category..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={(currentValue) => {
                      setFormData(prev => ({
                        ...prev,
                        category: currentValue
                      }));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.category.toLowerCase() === category.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <LocationSelector onLocationSelect={handleLocationSelect} />
      </div>

      <div className="space-y-2">
        <Input
          name="contact_info"
          placeholder="Contact Number (e.g., +91XXXXXXXXXX)"
          value={formData.contact_info}
          onChange={handleChange}
          pattern="^(\+91[-\s]?)?[0-9]{10}$"
          title="Please enter a valid Indian mobile number (+91XXXXXXXXXX or 10 digits)"
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          name="availability"
          placeholder="Availability (e.g., Mon-Fri 9AM-5PM)"
          value={formData.availability}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Service"}
      </Button>
    </form>
  );
};