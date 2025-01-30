import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Group } from "@/types/chat";

interface ChatDialogsProps {
  selectedChat: Chat | null;
  showNewChat: boolean;
  showNewGroup: boolean;
  showAddMembers: boolean;
  newMemberEmail: string;
  onNewChat: (userId: string) => Promise<void>;
  onNewGroup: (name: string, description?: string) => Promise<void>;
  onAddMembers: (emails: any) => Promise<void>;
  onCloseNewChat: () => void;
  onCloseNewGroup: () => void;
  onCloseAddMembers: () => void;
}

export const ChatDialogs = ({
  selectedChat,
  showNewChat,
  showNewGroup,
  showAddMembers,
  newMemberEmail,
  onNewChat,
  onNewGroup,
  onAddMembers,
  onCloseNewChat,
  onCloseNewGroup,
  onCloseAddMembers,
}: ChatDialogsProps) => {
  return (
    <>
      <Dialog open={showNewChat} onOpenChange={onCloseNewChat}>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">New Chat</h2>
            <input
              type="text"
              placeholder="Enter user ID..."
              className="w-full p-2 border rounded"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onNewChat((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewGroup} onOpenChange={onCloseNewGroup}>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Create New Group</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                onNewGroup(
                  formData.get('name') as string,
                  formData.get('description') as string
                );
              }}
            >
              <div className="space-y-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Group name"
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Group description (optional)"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-primary text-primary-foreground rounded"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddMembers} onOpenChange={onCloseAddMembers}>
        <DialogContent>
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Add Members</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const emails = formData.get('emails') as string;
                onAddMembers(emails.split(',').map(email => email.trim()));
              }}
            >
              <div className="space-y-4">
                <textarea
                  name="emails"
                  placeholder="Enter email addresses (comma-separated)"
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-primary text-primary-foreground rounded"
                >
                  Add Members
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};