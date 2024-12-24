import { useState, useEffect } from "react";
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
    availability: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validatePhoneNumber = (phone: string) => {
    // Indian mobile number validation: 10 digits with optional +91 country code
    const phoneRegex = /^(\+91)?[-.\s]?\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to create a service");
      return;
    }

    if (!validatePhoneNumber(formData.contact_info)) {
      toast.error("Please enter a valid Indian mobile number (e.g., 1234567890 or +91-1234567890)");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.from("services").insert({
        ...formData,
        price: parseFloat(formData.price),
        user_id: userId,
      });

      if (error) throw error;

      toast.success("Service listed successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        location: "",
        contact_info: "",
        availability: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to list service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6">
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
                  )
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
                        formData.category.toLowerCase() === category.toLowerCase() ? "opacity-100" : "opacity-0"
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
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <LocationSelector
          value={formData.location}
          onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
        />
      </div>

      <div className="space-y-2">
        <Input
          name="contact_info"
          placeholder="Mobile Number (e.g., 1234567890 or +91-1234567890)"
          value={formData.contact_info}
          onChange={handleChange}
          type="tel"
          pattern="^(\+91)?[-.\s]?\d{10}$"
          title="Please enter a valid Indian mobile number (10 digits with optional +91 country code)"
          required
        />
      </div>

      <div className="space-y-2">
        <Input
          name="availability"
          placeholder="Availability"
          value={formData.availability}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Listing Service..." : "List Service"}
      </Button>
    </form>
  );
};