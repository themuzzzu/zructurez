import { CommentForm } from "./comments/CommentForm";
import { CommentList } from "./comments/CommentList";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  // Validate that postId is a valid UUID
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);

  if (!isValidUUID) {
    console.error('Invalid UUID provided to CommentSection:', postId);
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <CommentForm postId={postId} />
      <div className="space-y-4 mt-6">
        <CommentList postId={postId} />
      </div>
    </div>
  );
};