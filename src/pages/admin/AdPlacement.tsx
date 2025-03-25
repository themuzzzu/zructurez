import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AdPlacement } from "@/services/adService";

interface AdPlacementFormValues {
  name: string;
  type: string;
  location: string;
  cpm_rate: number;
  cpc_rate: number;
  description: string;
  active: boolean;
  size?: string;
  max_size_kb?: number;
  priority?: number;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  cpm_rate: z.number(),
  cpc_rate: z.number(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  active: z.boolean(),
  size: z.string().optional(),
  max_size_kb: z.number().optional(),
  priority: z.number().optional(),
})

const fetchPlacementData = async () => {
  const { data, error } = await supabase
    .from('ad_placements')
    .select('*')
    .order('priority');
    
  if (error) throw error;
  
  // Cast the data to ensure it matches our AdPlacement type
  // Since the database might not have all the fields yet
  return (data || []).map(item => ({
    ...item,
    impressions: item.impressions || 0,
    clicks: item.clicks || 0,
    revenue: item.revenue || 0
  })) as AdPlacement[];
};

export default function AdPlacementPage() {
  const [placements, setPlacements] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlacementData();
        setPlacements(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      cpm_rate: 0,
      cpc_rate: 0,
      description: "",
      active: false,
      size: "",
      max_size_kb: 0,
      priority: 0,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase
        .from('ad_placements')
        .insert([values])
        .select()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Ad Placement created successfully")
        setPlacements([...placements, data[0]])
        setOpen(false)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Ad Placements</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create Ad Placement</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Ad Placement</DialogTitle>
            <DialogDescription>
              Make changes to your ad placement here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Placement Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Placement Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Placement Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpm_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPM Rate</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="CPM Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpc_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPC Rate</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="CPC Rate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Placement Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Whether the ad placement is active or not.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        type="checkbox"
                        checked={field.value}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of your ad placements.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>CPM Rate</TableHead>
              <TableHead>CPC Rate</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placements.map((placement) => (
              <TableRow key={placement.id}>
                <TableCell className="font-medium">{placement.name}</TableCell>
                <TableCell>{placement.type}</TableCell>
                <TableCell>{placement.location}</TableCell>
                <TableCell>{placement.cpm_rate}</TableCell>
                <TableCell>{placement.cpc_rate}</TableCell>
                <TableCell>{placement.description}</TableCell>
                <TableCell>{placement.active ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                Total {placements.length} ad placements
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

/**
 * @param {string} message
 */
function FormDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.8rem] text-muted-foreground">
      {children}
    </p>
  )
}
