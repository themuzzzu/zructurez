
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getPendingContent, moderateContent, ContentModeration } from '@/services/adminService';
import { AlertTriangle, Eye, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ModerationDialogProps {
  content: ContentModeration;
  onModerated: () => void;
}

const ModerationDialog: React.FC<ModerationDialogProps> = ({ content, onModerated }) => {
  const [status, setStatus] = useState<'approved' | 'rejected' | 'escalated'>('approved');
  const [notes, setNotes] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleModerate = async () => {
    const success = await moderateContent(content.id, status, notes);
    if (success) {
      setIsOpen(false);
      setNotes('');
      onModerated();
    }
  };

  const getSeverityColor = (level: number) => {
    if (level >= 4) return 'text-red-500';
    if (level >= 3) return 'text-orange-500';
    if (level >= 2) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Content Moderation Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Content Type:</span>
              <Badge className="ml-2">{content.content_type}</Badge>
            </div>
            <div>
              <span className="font-medium">Severity:</span>
              <span className={`ml-2 font-bold ${getSeverityColor(content.severity_level)}`}>
                Level {content.severity_level}
              </span>
            </div>
            <div>
              <span className="font-medium">Auto-flagged:</span>
              <Badge variant={content.auto_flagged ? "destructive" : "secondary"} className="ml-2">
                {content.auto_flagged ? "Yes" : "No"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Reported:</span>
              <span className="ml-2">{new Date(content.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {content.reason && (
            <div>
              <span className="font-medium">Reason:</span>
              <p className="mt-1 p-2 bg-muted rounded">{content.reason}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-medium">Moderation Decision:</label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approve</SelectItem>
                <SelectItem value="rejected">Reject</SelectItem>
                <SelectItem value="escalated">Escalate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Moderator Notes:</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your decision..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleModerate} className="flex-1">
              Submit Decision
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ContentModerationModule: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const { data: pendingContent = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-pending-content'],
    queryFn: getPendingContent
  });

  const filteredContent = pendingContent.filter((content: ContentModeration) => {
    const matchesType = filterType === 'all' || content.content_type === filterType;
    const matchesSeverity = filterSeverity === 'all' || 
      (filterSeverity === 'high' && content.severity_level >= 4) ||
      (filterSeverity === 'medium' && content.severity_level >= 2 && content.severity_level < 4) ||
      (filterSeverity === 'low' && content.severity_level < 2);
    
    return matchesType && matchesSeverity;
  });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return '📝';
      case 'product':
        return '🛍️';
      case 'service':
        return '🔧';
      case 'business':
        return '🏢';
      case 'comment':
        return '💬';
      default:
        return '📄';
    }
  };

  const getSeverityBadge = (level: number) => {
    if (level >= 4) return <Badge variant="destructive">High</Badge>;
    if (level >= 3) return <Badge variant="warning">Medium-High</Badge>;
    if (level >= 2) return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="secondary">Low</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Content Moderation
        </h2>
        <p className="text-muted-foreground">Review and moderate flagged content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{pendingContent.length}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {pendingContent.filter(c => c.severity_level >= 4).length}
                </div>
                <div className="text-sm text-muted-foreground">High Severity</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {pendingContent.filter(c => c.auto_flagged).length}
                </div>
                <div className="text-sm text-muted-foreground">Auto-flagged</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Resolved Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="business">Businesses</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High (4-5)</SelectItem>
                <SelectItem value="medium">Medium (2-3)</SelectItem>
                <SelectItem value="low">Low (1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading pending content...</div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending content for moderation
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((content: ContentModeration) => (
                <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getContentTypeIcon(content.content_type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge>{content.content_type}</Badge>
                          {getSeverityBadge(content.severity_level)}
                          {content.auto_flagged && (
                            <Badge variant="outline">Auto-flagged</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Content ID: {content.content_id}
                        </div>
                        {content.reason && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Reason: {content.reason}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Reported: {new Date(content.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ModerationDialog content={content} onModerated={refetch} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
