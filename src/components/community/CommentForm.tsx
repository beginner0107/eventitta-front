'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  initialContent?: string;
  isSubmitting?: boolean;
  placeholder?: string;
  submitLabel?: string;
}

export function CommentForm({
  onSubmit,
  onCancel,
  initialContent = '',
  isSubmitting = false,
  placeholder = '댓글을 입력하세요...',
  submitLabel = '댓글 작성',
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    onSubmit(trimmedContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-20 resize-none"
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Ctrl+Enter로 빠르게 작성할 수 있습니다</p>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-1" />
            취소
          </Button>

          <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
            <Send className="h-4 w-4 mr-1" />
            {isSubmitting ? '작성 중...' : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
