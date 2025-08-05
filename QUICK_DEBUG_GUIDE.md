# 🚀 Quick Clone Content Debug Guide

## Immediate Steps (5 minutes)

### 1. **Browser Console Check**
```javascript
// Open browser console and run:
window.debugCloneResolution()
```

### 2. **Check Headers**
Open Dev Tools → Network → Reload page → Look for:
- ✅ `x-clone-id: your-clone-id` 
- ❌ `x-clone-id: missing` = Domain mapping failed

### 3. **Test URL Override**
```
https://yourdomain.com/maths?clone=your-clone-id
```
- ✅ Works = Content exists, domain mapping is the issue
- ❌ Still wrong = Content/clone reference issue

### 4. **Run Debug Scripts**
```bash
# Test full resolution
node debug-clone-content.js yourdomain.com maths your-clone-id

# Test just subject page
node test-subject-resolution.js maths your-clone-id

# List all clones
node sanity/getClones.js
```

## Most Common Issues (90% of problems)

### ❌ **Domain Not Added to Clone**
**Fix**: Sanity Studio → Your Clone → metadata.domains → Add `yourdomain.com`

### ❌ **Subject Page Not Linked**  
**Fix**: Sanity Studio → Subject Pages → Find your page → Set cloneReference

### ❌ **Content Inactive**
**Fix**: Sanity Studio → Check isActive = true on both clone and subject page

### ❌ **Wrong Clone ID Format**
**Fix**: Ensure clone IDs match exactly (case-sensitive)

## Debug Queries for Sanity Vision

### Check Domain Mapping:
```groq
*[_type == "clone" && "yourdomain.com" in metadata.domains] {
  cloneId,
  cloneName,
  isActive,
  "domains": metadata.domains
}
```

### Check Subject Pages:
```groq
*[_type == "subjectPage" && slug.current == "maths"] {
  _id,
  title,
  isActive,
  cloneReference-> {
    cloneId,
    cloneName,
    isActive
  }
}
```

### Test Content Resolution:
```groq
{
  "cloneSpecific": *[_type == "subjectPage" && slug.current == "maths" && cloneReference->cloneId.current == "your-clone-id" && isActive == true][0],
  "baseline": *[_type == "subjectPage" && slug.current == "maths" && cloneReference->baselineClone == true && isActive == true][0],
  "default": *[_type == "subjectPage" && slug.current == "maths" && !defined(cloneReference) && isActive == true][0]
}
```

## Emergency Checklist

- [ ] Domain added to clone's metadata.domains array
- [ ] Clone is active (isActive = true)
- [ ] Subject page exists for your subject  
- [ ] Subject page has cloneReference set to your clone
- [ ] Subject page is active (isActive = true)
- [ ] Clone IDs match exactly
- [ ] Clear browser cache and restart dev server

## Need Help?

1. **First**: Run browser debugger: `window.debugCloneResolution()`
2. **Then**: Run script: `node debug-clone-content.js yourdomain.com maths`
3. **Finally**: Check the detailed checklist in `CLONE_DEBUGGING_CHECKLIST.md`

The debug tools will tell you exactly what's wrong and how to fix it! 🔧