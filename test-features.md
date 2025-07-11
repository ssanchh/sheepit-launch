# 🗳️ Voting & Comments System Test Guide

## ✅ **Phase 1: Voting System Features**

### **New Voting Features:**
1. **Vote/Unvote Toggle** - Users can now vote and unvote products
2. **Visual Vote Status** - Voted products show filled red heart with red background
3. **Real-time Vote Counts** - Vote counts update immediately
4. **Smart Vote Detection** - System checks if user has already voted

### **Test Cases:**
- [ ] Click heart icon to vote on a product
- [ ] Click heart icon again to unvote  
- [ ] Vote count updates correctly
- [ ] Voted products show red filled heart
- [ ] Unvoted products show gray outlined heart
- [ ] Vote button shows "..." during loading
- [ ] Modal vote button shows "Vote" or "Unvote" text

## 💬 **Phase 2: Comments System Features**

### **New Comments Features:**
1. **Comment Display** - Comments show in product detail modal
2. **Add Comments** - Users can add comments with send button
3. **Comment Count** - Comments count appears on product cards
4. **User Attribution** - Comments show user name/handle and timestamp
5. **Real-time Updates** - Comments load when modal opens

### **Test Cases:**
- [ ] Click product card to open modal
- [ ] See comments section with count
- [ ] Add a comment and click "Post"
- [ ] Comment appears in the list
- [ ] Comment count updates on product card
- [ ] User name/handle displays correctly
- [ ] Timestamp shows correctly
- [ ] Comments load when modal opens

## 🔧 **Database Setup Required**

**Run this SQL in your Supabase SQL Editor:**

```sql
-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  week_id UUID NOT NULL REFERENCES weeks(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments table policies
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_comments_product_id ON comments(product_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

## 🚀 **Next Steps**

After testing these features, the next priorities would be:

3. **Real-time Updates** - WebSocket subscriptions for live vote/comment updates
4. **Comment Reactions** - Like/heart reactions on comments
5. **Comment Moderation** - Admin tools to moderate comments
6. **Email Notifications** - Notify makers when someone comments on their product
7. **Advanced Features** - Reply to comments, comment editing, etc.

## 📱 **UI/UX Improvements**

- Heart icon fills with red when voted
- Comment count badge on product cards
- Smooth animations for voting actions
- Loading states for all async operations
- Error handling with toast notifications
- Clean, modern comment interface in modal 