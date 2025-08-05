# 🔧 Clone Content Debugging Checklist

## Immediate Debugging Steps

### 1. **Check Browser Dev Tools**
Open browser dev tools and look for these headers in Network tab:

```
x-clone-id: your-clone-id
x-clone-name: Your Clone Name  
x-clone-source: domain-mapping
```

❌ **If missing**: Domain mapping failed
✅ **If present**: Clone detection working

### 2. **Enable Debug Mode**
Add this to any subject page URL:
```
https://yourdomain.com/maths?clone=your-clone-id
```

### 3. **Check Server Logs**
Look for these log messages:

```bash
# Good signs:
[Middleware] Found clone: Clone Name (clone-id) for domain: yourdomain.com
[SubjectPage] Using clone-specific content for maths, clone: your-clone-id

# Bad signs:
[Middleware] No clone found for domain: yourdomain.com
[SubjectPage] Using baseline content for maths
[SubjectPage] Using default content for maths
```

## Common Failure Points

### ❌ **Issue 1: Domain Not Mapped**

**Symptoms:**
- Headers show no `x-clone-id`
- Always falls back to default content

**Causes:**
- Domain not in clone's `metadata.domains` array
- Typo in domain name
- Clone is inactive (`isActive: false`)
- Domain includes `http://` or `www.` prefix

**Fix:**
1. Go to Sanity Studio → Your Clone
2. Check `metadata.domains` array
3. Add domain exactly as: `yourdomain.com` (no protocols)
4. Ensure clone is active

### ❌ **Issue 2: Subject Page Not Linked**

**Symptoms:**
- Headers show correct `x-clone-id`
- Still falls back to baseline/default
- Logs show "Using baseline content"

**Causes:**
- Subject page exists but no `cloneReference` set
- Subject page `cloneReference` points to wrong clone
- Subject page is inactive (`isActive: false`)
- Referenced clone is inactive

**Fix:**
1. Go to Sanity Studio → Subject Pages
2. Find your subject page (e.g., "Maths")
3. Set `cloneReference` to your clone
4. Ensure both subject page and clone are active

### ❌ **Issue 3: Wrong Clone Reference**

**Symptoms:**
- Domain maps correctly
- Subject page exists
- Still falls back

**Debug Query:**
```javascript
// Run this in Sanity Vision
*[_type == "subjectPage" && slug.current == "maths"] {
  _id,
  title,
  isActive,
  cloneReference-> {
    _id,
    cloneId,
    cloneName,
    isActive
  }
}
```

**Fix:**
- Ensure `cloneReference` points to correct clone ID
- Verify clone ID format matches exactly

### ❌ **Issue 4: Cache Issues**

**Symptoms:**
- Everything looks correct
- Changes don't take effect
- Intermittent behavior

**Fix:**
1. Clear browser cache
2. Restart Next.js development server
3. Check middleware cache TTL (10 minutes for valid domains)
4. Try with `?clone=clone-id` parameter

### ❌ **Issue 5: Query Logic Issues**

**Symptoms:**
- Clone-specific content exists
- Query returns baseline instead

**Debug Query:**
```javascript
// Test the exact query used by the app
{
  "cloneSpecific": *[_type == "subjectPage" && slug.current == "maths" && cloneReference->cloneId.current == "your-clone-id" && isActive == true][0],
  "baseline": *[_type == "subjectPage" && slug.current == "maths" && cloneReference->baselineClone == true && isActive == true][0],
  "default": *[_type == "subjectPage" && slug.current == "maths" && !defined(cloneReference) && isActive == true][0]
}
```

## Quick Verification Commands

### Check Domain Mapping:
```bash
# Run the debug script
node debug-clone-content.js yourdomain.com maths
```

### Check Clone in Sanity:
```bash
# List all clones
node sanity/getClones.js
```

### Test URL Override:
```
https://yourdomain.com/maths?clone=your-clone-id
```

## Most Common Root Causes (in order)

1. **Domain not added to clone** (60% of issues)
2. **Subject page not linked to clone** (25% of issues)  
3. **Clone or subject page inactive** (10% of issues)
4. **Cache/timing issues** (5% of issues)

## Emergency Fallback Test

If nothing works, create a minimal test:

1. Create a new subject page in Sanity
2. Set `cloneReference` to your clone
3. Make sure both are active
4. Test with `?clone=your-clone-id` parameter
5. If this works, the issue is domain mapping
6. If this doesn't work, the issue is content structure

## Debug Component Usage

Add this to any page for real-time debugging:

```tsx
import CloneIndicatorBanner from '../components/CloneIndicatorBanner';

// In your page component
<CloneIndicatorBanner 
  cloneContext={cloneContext}
  cloneData={cloneData}
  debugInfo={debugInfo}
  pageName="Subject Page"
  showByDefault={true}
/>
```

## Advanced Debugging

For deeper investigation, check:

1. **Middleware execution**: Look for `x-debug-middleware-executed` header
2. **Query results**: Add console.logs to the resolution functions  
3. **Sanity data**: Use Sanity Vision to verify data structure
4. **Network timing**: Check if queries are timing out

---

**Need more help?** Run the comprehensive debugger:
```bash
node debug-clone-content.js yourdomain.com maths your-clone-id
```