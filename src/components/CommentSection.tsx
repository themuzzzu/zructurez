import { CommentForm } from "./comments/CommentForm";
import { CommentList } from "./comments/CommentList";

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  return (
    <div className="space-y-4 mt-4">
      <CommentForm postId={postId} />
      <div className="space-y-4 mt-6">
        <CommentList postId={postId} />
      </div>
    </div>
  );
};