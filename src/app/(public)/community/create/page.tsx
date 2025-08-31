import { PostCreateForm } from '@/components/community/PostCreateForm';

export default function CreatePostPage() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">새 글 작성</h1>
        <p className="text-muted-foreground">동네 이웃들과 나누고 싶은 이야기를 작성해보세요</p>
      </div>

      <PostCreateForm />
    </div>
  );
}
