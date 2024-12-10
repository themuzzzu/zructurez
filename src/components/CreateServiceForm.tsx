import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const CreateServiceForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to create a service");
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
        <Input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
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
        <Input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Input
          name="contact_info"
          placeholder="Contact Information"
          value={formData.contact_info}
          onChange={handleChange}
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