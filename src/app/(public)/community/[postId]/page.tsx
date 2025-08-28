import { PostDetail } from '@/components/community/PostDetail';

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { postId: postIdParam } = await params;
  const postId = parseInt(postIdParam, 10);

  if (isNaN(postId)) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-destructive mb-2">잘못된 게시글 ID</h1>
          <p className="text-muted-foreground">올바른 게시글 주소로 접근해주세요.</p>
        </div>
      </div>
    );
  }

  return <PostDetail postId={postId} />;
}
