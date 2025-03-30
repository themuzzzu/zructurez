import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  PlusCircle, 
  MinusCircle,
  User,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner";
import type { BusinessFormValues } from "../BusinessRegistrationForm";
import type { Owner } from "../types/owner";

export const OwnersStaffStep = () => {
  const { control, formState: { errors } } = useFormContext<BusinessFormValues>();
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newOwner, setNewOwner] = useState<Partial<Owner>>({
    name: "",
    role: "Co-Owner",
    position: "",
    experience: "",
    qualifications: "",
    bio: ""
  });
  const [newStaffMember, setNewStaffMember] = useState({
    name: "",
    position: "",
    experience: "",
    bio: "",
    image_url: null as string | null
  });
  
  const {
    fields: ownerFields,
    append: appendOwner,
    remove: removeOwner,
  } = useFieldArray({
    control,
    name: "owners",
  });
  
  const {
    fields: staffFields,
    append: appendStaff,
    remove: removeStaff,
  } = useFieldArray({
    control,
    name: "staff_details",
  });
  
  const handleAddOwner = () => {
    if (!newOwner.name || !newOwner.role || !newOwner.position) {
      toast.error("Please fill all required owner fields");
      return;
    }
    
    appendOwner({
      name: newOwner.name || "",
      role: newOwner.role || "Co-Owner",
      position: newOwner.position || "",
      experience: newOwner.experience || "",
      qualifications: newOwner.qualifications || "",
      bio: newOwner.bio || "",
      image_url: newOwner.image_url || null
    });
    
    setNewOwner({
      name: "",
      role: "Co-Owner",
      position: "",
      experience: "",
      qualifications: "",
      bio: "",
      image_url: null
    });
    
    setShowAddOwner(false);
    toast.success("Owner added successfully");
  };
  
  const handleAddStaffMember = () => {
    if (!newStaffMember.name || !newStaffMember.position) {
      toast.error("Please fill all required staff fields");
      return;
    }
    
    appendStaff(newStaffMember);
    
    setNewStaffMember({
      name: "",
      position: "",
      experience: "",
      bio: "",
      image_url: null
    });
    
    setShowAddStaff(false);
    toast.success("Staff member added successfully");
  };
  
  const handleOwnerImageSelect = (index: number, image: string | null) => {
    const updatedOwners = [...ownerFields];
    updatedOwners[index] = {
      ...updatedOwners[index],
      image_url: image
    };
  };
  
  const handleNewOwnerImageSelect = (image: string | null) => {
    setNewOwner({
      ...newOwner,
      image_url: image
    });
  };
  
  const handleStaffImageSelect = (index: number, image: string | null) => {
    // This is handled by the fieldArray update
  };
  
  const handleNewStaffImageSelect = (image: string | null) => {
    setNewStaffMember({
      ...newStaffMember,
      image_url: image
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Users className="mr-2 h-5 w-5 text-primary" />
        Owners & Staff
      </h2>
      <p className="text-muted-foreground mb-6">
        Add details about the business owners and optional staff members.
      </p>
      
      {/* Owners Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Business Owners</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddOwner(!showAddOwner)}
            >
              {showAddOwner ? <MinusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {showAddOwner ? "Cancel" : "Add Owner"}
            </Button>
          </div>
          
          {/* Existing Owners */}
          {ownerFields.map((owner, index) => (
            <div key={owner.id} className="mb-8 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-base font-medium">
                  {index === 0 ? "Primary Owner" : `Additional Owner ${index}`}
                </h4>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOwner(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name={`owners.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <User className="mr-2 h-4 w-4" /> Owner Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`owners.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" /> Role <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Founder, Co-Owner, Partner" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`owners.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" /> Position <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CEO, Medical Director" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`owners.${index}.experience`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4" /> Experience <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 10 Years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`owners.${index}.qualifications`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">Qualifications</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., MD, MBA, PhD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name={`owners.${index}.bio`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief background and expertise..." 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`owners.${index}.image_url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Photo</FormLabel>
                        <FormControl>
                          <div className="mt-2">
                            <ImageUpload
                              selectedImage={field.value}
                              onImageSelect={(image) => {
                                field.onChange(image);
                                handleOwnerImageSelect(index, image);
                              }}
                              initialScale={1}
                              initialPosition={{ x: 50, y: 50 }}
                              skipAutoSave={true}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a professional photo of the owner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Owner Form */}
          {showAddOwner && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-base font-medium mb-4">Add New Owner</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <User className="mr-2 h-4 w-4" /> Owner Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <Input 
                      value={newOwner.name || ""}
                      onChange={(e) => setNewOwner({...newOwner, name: e.target.value})}
                      placeholder="Full name" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" /> Role <span className="text-red-500">*</span>
                    </FormLabel>
                    <Input 
                      value={newOwner.role || ""}
                      onChange={(e) => setNewOwner({...newOwner, role: e.target.value})}
                      placeholder="e.g., Co-Owner, Partner" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" /> Position <span className="text-red-500">*</span>
                    </FormLabel>
                    <Input 
                      value={newOwner.position || ""}
                      onChange={(e) => setNewOwner({...newOwner, position: e.target.value})}
                      placeholder="e.g., COO, CTO" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" /> Experience
                    </FormLabel>
                    <Input 
                      value={newOwner.experience || ""}
                      onChange={(e) => setNewOwner({...newOwner, experience: e.target.value})}
                      placeholder="e.g., 8 Years" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <Input 
                      value={newOwner.qualifications || ""}
                      onChange={(e) => setNewOwner({...newOwner, qualifications: e.target.value})}
                      placeholder="e.g., MS, MBA" 
                    />
                  </FormItem>
                </div>
                
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <Textarea 
                      value={newOwner.bio || ""}
                      onChange={(e) => setNewOwner({...newOwner, bio: e.target.value})}
                      placeholder="Brief background and expertise..." 
                      className="min-h-[100px]" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Owner Photo</FormLabel>
                    <div className="mt-2">
                      <ImageUpload
                        selectedImage={newOwner.image_url}
                        onImageSelect={handleNewOwnerImageSelect}
                        initialScale={1}
                        initialPosition={{ x: 50, y: 50 }}
                        skipAutoSave={true}
                      />
                    </div>
                  </FormItem>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={handleAddOwner}
                  className="w-full md:w-auto"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Add Owner
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Staff Section (Optional) */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Staff Members (Optional)</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddStaff(!showAddStaff)}
            >
              {showAddStaff ? <MinusCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {showAddStaff ? "Cancel" : "Add Staff"}
            </Button>
          </div>
          
          {staffFields.length === 0 && !showAddStaff && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No staff members added yet.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => setShowAddStaff(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Add Staff Member
              </Button>
            </div>
          )}
          
          {/* Existing Staff Members */}
          {staffFields.map((staff, index) => (
            <div key={staff.id} className="mb-8 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-base font-medium">Staff Member {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStaff(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name={`staff_details.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`staff_details.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Doctor, Therapist" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`staff_details.${index}.experience`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 Years" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name={`staff_details.${index}.bio`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief background and expertise..." 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name={`staff_details.${index}.image_url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff Photo</FormLabel>
                        <FormControl>
                          <div className="mt-2">
                            <ImageUpload
                              selectedImage={field.value}
                              onImageSelect={(image) => {
                                field.onChange(image);
                                handleStaffImageSelect(index, image);
                              }}
                              initialScale={1}
                              initialPosition={{ x: 50, y: 50 }}
                              skipAutoSave={true}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Staff Form */}
          {showAddStaff && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-base font-medium mb-4">Add New Staff Member</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Staff Name <span className="text-red-500">*</span></FormLabel>
                    <Input 
                      value={newStaffMember.name || ""}
                      onChange={(e) => setNewStaffMember({...newStaffMember, name: e.target.value})}
                      placeholder="Full name" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Position <span className="text-red-500">*</span></FormLabel>
                    <Input 
                      value={newStaffMember.position || ""}
                      onChange={(e) => setNewStaffMember({...newStaffMember, position: e.target.value})}
                      placeholder="e.g., Receptionist, Nurse" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <Input 
                      value={newStaffMember.experience || ""}
                      onChange={(e) => setNewStaffMember({...newStaffMember, experience: e.target.value})}
                      placeholder="e.g., 3 Years" 
                    />
                  </FormItem>
                </div>
                
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <Textarea 
                      value={newStaffMember.bio || ""}
                      onChange={(e) => setNewStaffMember({...newStaffMember, bio: e.target.value})}
                      placeholder="Brief background and expertise..." 
                      className="min-h-[100px]" 
                    />
                  </FormItem>
                  
                  <FormItem>
                    <FormLabel>Staff Photo</FormLabel>
                    <div className="mt-2">
                      <ImageUpload
                        selectedImage={newStaffMember.image_url}
                        onImageSelect={handleNewStaffImageSelect}
                        initialScale={1}
                        initialPosition={{ x: 50, y: 50 }}
                        skipAutoSave={true}
                      />
                    </div>
                  </FormItem>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={handleAddStaffMember}
                  className="w-full md:w-auto"
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Add Staff Member
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
