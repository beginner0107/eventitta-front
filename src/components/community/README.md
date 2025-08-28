# Community Components

Local Community feature implementation with full CRUD operations.

## Components

### PostCard.tsx

- Displays individual post summaries
- Shows title, author, region, likes, and creation date
- Links to detailed post view (`/community/[postId]`)
- Responsive design with hover effects

### PostFilters.tsx

- Search functionality with keyword input
- Search type selection (title, content, title+content)
- Region filtering
- Clear filters functionality
- Real-time search and filtering

### PostList.tsx

- Main community page component
- Integrates with `useGetPosts` API hook
- Pagination support
- Loading states with skeleton components
- Empty states for no posts
- Error handling with retry functionality

## Features Implemented

✅ **Post List Display**: Paginated list of community posts
✅ **Search & Filtering**: By keyword, search type, and region
✅ **Responsive Design**: Mobile-first approach
✅ **Loading States**: Skeleton loading for better UX
✅ **Error Handling**: User-friendly error messages with retry
✅ **Pagination**: Navigate through multiple pages of posts
✅ **Time Formatting**: Korean-localized relative time display

## API Integration

Uses the following generated API hooks from `src/api/eventitta.ts`:

- `useGetPosts`: Fetch paginated posts with filters
- `PostSummaryDto`: Type definition for post summaries
- `GetPostsParams`: Parameters for filtering and pagination
- `PageResponsePostSummaryDto`: Paginated response type

## Phase 2 Implemented (Post Details & Comments)

✅ **Post Detail Page**: `/community/[postId]/page.tsx` with async params support
✅ **Post Detail View**: Full content display with images, author info, metadata
✅ **Comment System**: Complete CRUD operations using existing APIs
✅ **Comment Forms**: Creation and editing with keyboard shortcuts
✅ **Nested Comments**: Parent-child comment structure support
✅ **Real-time Updates**: Query invalidation for immediate UI updates

### Additional Components Added

#### PostDetail.tsx

- Main post detail container with error handling
- Loading states and navigation back to community
- Integration with `useGetPost` API hook

#### PostDetailContent.tsx

- Rich post content display with images
- Author information with avatar and metadata
- Like and comment counters
- Responsive image galleries (1 image vs multiple)

#### CommentSection.tsx

- Comment list with `useGetComments` integration
- Comment creation form toggle
- Empty states and loading skeletons
- Error handling with retry functionality

#### CommentItem.tsx

- Individual comment display with nested structure
- Edit/delete functionality for comment authors
- Reply system (UI ready, needs API integration)
- Soft-delete support for deleted comments

#### CommentForm.tsx

- Reusable form for creating/editing comments
- Keyboard shortcuts (Ctrl+Enter to submit)
- Loading states and validation
- Cancel/submit actions

#### UI Components Added

- `textarea.tsx`: Multi-line text input component
- Enhanced `avatar.tsx` integration for user profiles

## Next Steps (Phase 3+)

- Post creation form (`/community/create/page.tsx`)
- Post editing and deletion for authors
- Reply API integration for nested comments
- User authentication checks for edit/delete permissions
- Image upload functionality
- Like/unlike post functionality
