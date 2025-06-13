
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getUserRoles, assignUserRole, revokeUserRole, UserRole } from '@/services/adminService';
import { Users, Shield, UserCheck, UserX, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AssignRoleDialogProps {
  onRoleAssigned: () => void;
}

const AssignRoleDialog: React.FC<AssignRoleDialogProps> = ({ onRoleAssigned }) => {
  const [userId, setUserId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAssign = async () => {
    if (!userId || !roleName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await assignUserRole(userId, roleName, expiresAt || undefined);
    if (success) {
      setIsOpen(false);
      setUserId('');
      setRoleName('');
      setExpiresAt('');
      onRoleAssigned();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Assign Role
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
          <div>
            <Label htmlFor="roleName">Role</Label>
            <Select value={roleName} onValueChange={setRoleName}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="business_owner">Business Owner</SelectItem>
                <SelectItem value="premium_user">Premium User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <Button onClick={handleAssign} className="w-full">
            Assign Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const UserManagementModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { data: userRoles = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: getUserRoles
  });

  const filteredRoles = userRoles.filter((role: UserRole) => {
    const matchesSearch = !searchTerm || 
      role.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || role.role_name === filterRole;
    
    return matchesSearch && matchesFilter;
  });

  const handleRevokeRole = async (roleId: string) => {
    const success = await revokeUserRole(roleId);
    if (success) {
      refetch();
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'warning';
      case 'business_owner':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            User Management
          </h2>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <AssignRoleDialog onRoleAssigned={refetch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {userRoles.filter(r => r.role_name === 'admin' && r.is_active).length}
                </div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {userRoles.filter(r => r.role_name === 'moderator' && r.is_active).length}
                </div>
                <div className="text-sm text-muted-foreground">Moderators</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserX className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {userRoles.filter(r => !r.is_active).length}
                </div>
                <div className="text-sm text-muted-foreground">Revoked Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user ID or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="business_owner">Business Owner</SelectItem>
                <SelectItem value="premium_user">Premium User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading user roles...</div>
          ) : filteredRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No user roles found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoles.map((role: UserRole) => (
                <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.user_id}</span>
                      <Badge variant={getRoleBadgeVariant(role.role_name) as any}>
                        {role.role_name}
                      </Badge>
                      {!role.is_active && (
                        <Badge variant="outline">Revoked</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Granted: {new Date(role.granted_at).toLocaleDateString()}
                      {role.expires_at && (
                        <span> • Expires: {new Date(role.expires_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  {role.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeRole(role.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
