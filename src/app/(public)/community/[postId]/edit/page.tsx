import { PostEditForm } from '@/components/community/PostEditForm';

interface PageProps {
  params: Promise<{
    postId: string;
  }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { postId: postIdParam } = await params;
  const postId = Number(postIdParam);

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

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">글 수정</h1>
        <p className="text-muted-foreground">작성한 글의 내용을 수정할 수 있습니다</p>
      </div>

      <PostEditForm postId={postId} />
    </div>
  );
}
