
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateAdCampaignProps {
  businessId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateAdCampaign: React.FC<CreateAdCampaignProps> = ({
  businessId,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    type: 'banner'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock successful creation
    console.log('Creating ad campaign:', formData);
    onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Ad Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter campaign title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your campaign"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Budget</label>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Enter budget amount"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit">Create Campaign</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
