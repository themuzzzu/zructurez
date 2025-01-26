import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/services/postService";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  postId: string;
}

export const CommentList = ({ postId }: CommentListProps) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      {comments?.map((comment: any) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};