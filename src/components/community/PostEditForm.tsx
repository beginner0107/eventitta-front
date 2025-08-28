'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetPost, useUpdate } from '@/api/eventitta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, ImagePlus, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface PostFormData {
  title: string;
  content: string;
  regionCode: string;
  imageUrls: string[];
}

interface PostFormErrors {
  title?: string;
  content?: string;
  regionCode?: string;
  imageUrls?: string;
  general?: string;
}

interface PostEditFormProps {
  postId: number;
}

export function PostEditForm({ postId }: PostEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    regionCode: '',
    imageUrls: [],
  });
  const [errors, setErrors] = useState<PostFormErrors>({});
  const [imageUrl, setImageUrl] = useState('');

  const {
    data: postData,
    isLoading: loadingPost,
    error: postError,
  } = useGetPost(postId, {
    query: {
      retry: 2,
    },
  });

  const updatePostMutation = useUpdate({
    mutation: {
      onSuccess: () => {
        router.push(`/community/${postId}`);
      },
      onError: (error: any) => {
        console.error('Failed to update post:', error);
        setErrors({
          general: '게시글 수정에 실패했습니다. 다시 시도해주세요.',
        });
      },
    },
  });

  // Initialize form data when post data is loaded
  useEffect(() => {
    if (postData?.data) {
      const post = postData.data;
      setFormData({
        title: post.title || '',
        content: post.content || '',
        regionCode: post.regionCode || '',
        imageUrls: post.images?.map((img) => img.imageUrl || '').filter(Boolean) || [],
      });
    }
  }, [postData]);

  const validateForm = (): boolean => {
    const newErrors: PostFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = '제목은 2자 이상 입력해주세요.';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = '제목은 100자 이하로 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '내용은 10자 이상 입력해주세요.';
    } else if (formData.content.trim().length > 5000) {
      newErrors.content = '내용은 5000자 이하로 입력해주세요.';
    }

    if (!formData.regionCode.trim()) {
      newErrors.regionCode = '지역을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      regionCode: formData.regionCode.trim(),
      imageUrls: formData.imageUrls.filter((url) => url.trim()),
    };

    updatePostMutation.mutate({
      postId,
      data: submitData,
    });
  };

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleAddImage = () => {
    const trimmedUrl = imageUrl.trim();
    if (trimmedUrl && !formData.imageUrls.includes(trimmedUrl)) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, trimmedUrl],
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const isSubmitting = updatePostMutation.isPending;

  if (postError) {
    return (
      <>
        <div className="mb-6">
          <Link href={`/community/${postId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              게시글로 돌아가기
            </Button>
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            게시글을 불러오는 중 오류가 발생했습니다. 게시글이 삭제되었거나 접근 권한이 없을 수
            있습니다.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (loadingPost) {
    return (
      <>
        <div className="mb-6">
          <Skeleton className="h-9 w-48" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link href={`/community/${postId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            게시글로 돌아가기
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>글 수정</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                제목 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
                disabled={isSubmitting}
                maxLength={100}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              <p className="text-xs text-muted-foreground">{formData.title.length}/100자</p>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="regionCode">
                지역 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="regionCode"
                placeholder="예: 서울시 강남구, 부산시 해운대구"
                value={formData.regionCode}
                onChange={(e) => handleInputChange('regionCode', e.target.value)}
                className={errors.regionCode ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.regionCode && <p className="text-sm text-destructive">{errors.regionCode}</p>}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                내용 <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="이웃들과 나누고 싶은 이야기를 작성해주세요..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className={`min-h-40 ${errors.content ? 'border-destructive' : ''}`}
                disabled={isSubmitting}
                maxLength={5000}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
              <p className="text-xs text-muted-foreground">{formData.content.length}/5000자</p>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label>이미지 (선택사항)</Label>

              <div className="flex gap-2">
                <Input
                  placeholder="이미지 URL을 입력하세요"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  disabled={!imageUrl.trim() || isSubmitting}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  추가
                </Button>
              </div>

              {formData.imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    추가된 이미지 ({formData.imageUrls.length})
                  </p>
                  <div className="space-y-2">
                    {formData.imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted/30 rounded-md"
                      >
                        <div className="flex-1 text-sm font-mono truncate">{url}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isSubmitting}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Link href={`/community/${postId}`}>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  취소
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.content.trim() ||
                  !formData.regionCode.trim()
                }
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '저장 중...' : '수정 완료'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
