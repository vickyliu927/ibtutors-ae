# Clone SEO Metadata Solution

## 🎯 Problem Solved

Your meta titles and descriptions were showing the same content (Dubai Tutors) across all clone domains because there were no clone-specific SEO settings in Sanity. While the clone detection was working perfectly, all domains were falling back to the default SEO content.

## ✅ What Was Fixed

1. **Enhanced `getSeoData()` function** - Now supports clone-aware SEO data with 3-tier fallback:
   - Clone-specific SEO content (highest priority)
   - Baseline clone SEO content (medium priority)  
   - Default SEO content (fallback)

2. **Updated root layout metadata** - The layout now uses clone-aware SEO data automatically

3. **Updated subject page metadata** - Subject pages now also use clone-aware SEO data

## 🔍 Current Status

✅ **Technical Implementation**: Complete  
❌ **Content Creation**: Missing clone-specific SEO documents in Sanity

The system is now ready to show different meta titles and descriptions per domain, but you need to create the actual content in Sanity Studio.

## 🚀 How to Create Clone-Specific SEO Content

### Option 1: Use the Automated Script (Recommended)

```bash
# Set your Sanity API token (get from https://sanity.io/manage)
export SANITY_API_TOKEN="your_token_here"

# Run the automated script to create SEO content for all clones
node create-clone-seo.js
```

This will create SEO documents like:
- **Qatar**: "Top Rated Qatar Tutors - Ranked #1 - onlinetutors.qa"
- **Abu Dhabi**: "Top Rated Abu Dhabi Tutors - Ranked #1"
- **Hong Kong**: "Top Rated Hong Kong Tutors - Ranked #1"
- **Singapore**: "Top Rated Singapore Tutors - Ranked #1"

### Option 2: Manual Creation in Sanity Studio

1. Go to your Sanity Studio (`/studio`)
2. Navigate to **"SEO"** section
3. Click **"+ Create"** → **"SEO"**
4. Fill in the fields:
   - **Page title**: Your custom title (e.g., "Top Rated Qatar Tutors - Ranked #1")
   - **Description**: Your custom description
   - **Clone Reference**: Select the clone (e.g., "Qatar Tutors")
5. Publish the document
6. Repeat for each clone you want custom SEO for

## 🧪 Testing Your Changes

After creating the SEO content, test with:

```bash
# Test all domains
node test-seo-metadata.js

# Debug specific domain
node debug-seo-content.js
```

Or manually check:
- Qatar: https://onlinetutors.qa
- Default: https://ibtutors-ae.vercel.app

## 📊 Current Clone Status

Based on the analysis, these clones exist and need SEO content:

| Clone | ID | Domain | SEO Content |
|-------|----|---------|----- |
| Qatar Tutors | `qatar-tutors` | onlinetutors.qa | ❌ Missing |
| Singapore Tutors | `singapore-tutors` | - | ❌ Missing |
| Hong Kong Tutors | `hong-kong-tutors` | - | ❌ Missing |
| Abu Dhabi Tutors | `abu-dhabi` | - | ❌ Missing |
| Spain Tutors | `spain-tutors` | - | ❌ Missing |

## 🔧 System Architecture

The solution implements a **3-tier fallback system**:

```
1. Clone-Specific SEO
   ↓ (if not found)
2. Baseline Clone SEO  
   ↓ (if not found)
3. Default SEO Content
```

### Code Changes Made:

#### `app/lib/getSeoData.ts`
- Added clone context detection from middleware headers
- Implemented 3-tier fallback query system
- Added proper caching with clone-aware cache keys

#### `app/layout.tsx`
- Updated `generateMetadata()` to use clone-aware SEO data

#### `app/[subject]/page.tsx` 
- Updated subject page metadata to use clone-aware SEO data

## 🎉 Expected Results

After creating clone-specific SEO content, you should see:

- **onlinetutors.qa**: "Top Rated Qatar Tutors - Ranked #1"
- **Default domain**: "Top Rated Dubai Tutors - Ranked #1"
- **Other clones**: Their respective custom titles and descriptions

## 🚨 Important Notes

1. **Cache**: Changes may take a few minutes due to Next.js caching (24-hour cache for SEO data)
2. **Deployment**: Make sure to deploy these code changes before testing
3. **Token**: The creation script requires a Sanity API token with write permissions
4. **Fallback**: If no clone-specific SEO exists, the system gracefully falls back to default content

## 🛠️ Troubleshooting

**Q: Still seeing Dubai Tutors title on Qatar domain?**  
A: Check that clone-specific SEO document was created and published in Sanity

**Q: Getting cache issues?**  
A: Wait a few minutes or restart your development server

**Q: Script fails with permission error?**  
A: Ensure your `SANITY_API_TOKEN` has write permissions

---

The technical foundation is now in place. Just create the clone-specific SEO content and your domains will show unique meta titles and descriptions! 🎯