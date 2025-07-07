# Creating Clone Websites in Sanity

This guide walks you through creating new clone websites using our multi-domain template system. Perfect for content managers, developers, and anyone setting up new regional or branded variants of the tutoring website.

## 🎯 What You'll Learn

- How to create a new clone in Sanity Studio
- Setting up domain mapping and metadata
- Content management strategies
- Testing and deployment
- Best practices and troubleshooting

## 📋 Prerequisites

- Access to Sanity Studio
- Basic understanding of the website structure
- Knowledge of your target domain(s)
- Understanding of the content types (hero, testimonials, etc.)

---

## 🚀 Step 1: Create the Clone Document

### 1.1 Access Sanity Studio

1. Navigate to your Sanity Studio (typically `/studio`)
2. Log in with your credentials
3. Look for the **"Website Clones"** section in the navigation

### 1.2 Create New Clone

1. Click **"+ Create"** or **"New Document"**
2. Select **"Clone"** from the document types
3. You'll see the clone creation form

### 1.3 Fill Basic Information

**Clone Name** (Required)
```
Examples:
- "Abu Dhabi Tutors"
- "Dubai Mathematics Academy" 
- "IB Tutors UK"
- "Singapore Education Hub"
```

**Clone Description** (Optional but recommended)
```
Examples:
- "Specialized tutoring services for Abu Dhabi students focusing on IB and British curriculum"
- "Premium mathematics tutoring for Dubai schools"
- "UK-based IB tutoring with local expertise"
```

**Clone ID** (Auto-generated)
- This will auto-generate from your clone name
- Example: "abu-dhabi-tutors" → becomes the slug
- You can manually edit if needed
- **Important**: This ID is used in URLs and queries

---

## 🌍 Step 2: Configure Domain Settings

### 2.1 Set Region
Choose the appropriate region:
- Middle East
- Asia Pacific  
- Europe
- North America
- Other

### 2.2 Add Target Domains

**Primary Domain** (Required)
```
Examples:
- abudhabitutors.ae
- dubaitutors.com
- ibtutors.co.uk
- singaporetutors.sg
```

**Additional Domains** (Optional)
```
Examples:
- www.abudhabitutors.ae
- tutoring.abudhabi.ae
- abudhabi.ibtutors.ae
```

**Domain Entry Tips:**
- Enter domains without `http://` or `https://`
- One domain per line
- Include both `www` and non-`www` versions if needed
- Ensure domains point to your Next.js application

### 2.3 Set Target Audience

Define who this clone serves:
```
Examples:
- "IB and British curriculum students in Abu Dhabi"
- "GCSE and A-Level students in Dubai"
- "International Baccalaureate students in Singapore"
- "University preparation students in London"
```

---

## 🎛️ Step 3: Clone Settings

### 3.1 Activation Status

**Is Active**: Toggle this to enable/disable the clone
- ✅ **Active**: Clone is live and accessible
- ❌ **Inactive**: Clone exists but won't serve content

### 3.2 Baseline Clone

**Important Decision**: Should this be the baseline clone?

**Baseline Clone** = The default fallback for all other clones
- ❌ **Most clones**: Leave this unchecked
- ✅ **Only one clone**: Should be marked as baseline
- **Note**: Only ONE clone can be baseline at a time

**When to make a clone baseline:**
- It represents the "default" or most comprehensive content
- Other clones will inherit content from this one
- Usually your main or original website version

---

## 📝 Step 4: Save and Verify

### 4.1 Save the Clone

1. Click **"Publish"** to save your clone
2. Verify all fields are correctly filled
3. Check that the clone appears in the clones list

### 4.2 Verify Domain Validation

The system validates domains automatically:
- ✅ **Valid domains**: Green checkmark
- ❌ **Invalid domains**: Red error with details
- **Common issues**: 
  - Including `http://` (remove it)
  - Special characters (use only letters, numbers, dots, hyphens)
  - Duplicate domains across clones

---

## 🎨 Step 5: Create Clone-Specific Content

Now create content specifically for your new clone. You have three approaches:

### 5.1 Clone-Specific Content (Recommended)

Create entirely new content documents that reference your clone:

**Hero Section:**
1. Go to **"Hero Sections"**
2. Create new hero section
3. **Clone Reference**: Select your new clone
4. **Is Active**: Enable
5. Fill in clone-specific content
6. **Clone Specific Data**:
   - Custom title for this clone
   - Custom description
   - Priority and featured settings

**Example for Abu Dhabi Clone:**
```
Title: "Premier IB Tutoring in Abu Dhabi"
Description: "Expert tutors for International Baccalaureate and British curriculum students in Abu Dhabi and surrounding emirates."
Custom Title: "Abu Dhabi's Leading Educational Support"
```

### 5.2 Content Customization

For each content type, you can:

**Testimonials:**
- Add testimonials from local students
- Include location-specific success stories
- Reference local schools and universities

**Tutors:**
- Feature tutors in your region
- Add location preferences
- Include local qualifications

**FAQ Sections:**
- Address region-specific questions
- Include local curriculum information
- Add timezone and availability details

**Platform Banners:**
- Customize messaging for local market
- Include region-specific promotions
- Add local contact information

### 5.3 Inherited Content

Content without clone references will use the fallback hierarchy:
1. **Clone-specific** (your new content)
2. **Baseline clone** (if exists)
3. **Default global** (fallback)

---

## 🧪 Step 6: Testing Your Clone

### 6.1 URL Parameter Testing

Test using URL parameters (works immediately):
```
https://yoursite.com?clone=abu-dhabi-tutors
https://yoursite.com/maths?clone=abu-dhabi-tutors
```

### 6.2 Local Domain Testing

For testing actual domains locally:

**1. Update /etc/hosts (Mac/Linux):**
```bash
sudo nano /etc/hosts

# Add these lines:
127.0.0.1 abudhabitutors.local
127.0.0.1 www.abudhabitutors.local
```

**2. Test locally:**
```
http://abudhabitutors.local:3000
```

**3. Check middleware headers in browser dev tools:**
- Look for `x-clone-id: abu-dhabi-tutors`
- Verify `x-clone-name: Abu Dhabi Tutors`

### 6.3 Debug Information

Enable debug mode to see:
- Which clone is active
- Content source for each section
- Fallback hierarchy in action
- Domain mapping status

**In Development:**
- Add `?debug=true` to any URL
- Check browser console for detailed logs
- Use the CloneIndicatorBanner component

---

## 🚀 Step 7: Production Deployment

### 7.1 DNS Configuration

Point your domains to your hosting platform:

**Vercel Example:**
1. Go to Vercel dashboard
2. Add domain to your project
3. Configure DNS records:
   ```
   Type: CNAME
   Name: abudhabitutors.ae
   Value: your-project.vercel.app
   ```

**Other Platforms:**
- Follow your hosting provider's domain setup guide
- Ensure domains point to the same Next.js application

### 7.2 SSL/HTTPS Setup

Most hosting platforms handle SSL automatically:
- Vercel: Automatic Let's Encrypt certificates
- Netlify: Automatic SSL
- Custom hosting: Configure SSL certificates

### 7.3 Verification

Once DNS propagates (can take 24-48 hours):
1. Visit your new domain
2. Verify clone-specific content appears
3. Check that fallback content works
4. Test all major pages and functionality

---

## 🎯 Step 8: Content Strategy Planning

### 8.1 Content Priority Matrix

**High Priority (Create First):**
- Hero section (main landing experience)
- Contact information (local details)
- Tutor profiles (regional tutors)
- Key testimonials (local success stories)

**Medium Priority:**
- FAQ sections (region-specific questions)
- Platform banners (local promotions)
- Highlights sections (local benefits)

**Low Priority (Can inherit):**
- Footer content (unless legal differences)
- General educational content
- Basic site structure

### 8.2 Localization Considerations

**Language:**
- Adapt language for local audience
- Use local terminology and spellings
- Consider cultural nuances

**Curriculum:**
- Highlight relevant curriculum (IB, British, American, local)
- Mention specific exam boards
- Include grade level equivalents

**Practical Details:**
- Local contact numbers and addresses
- Timezone information
- Currency (if applicable)
- Local holidays and school calendars

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Clone Not Appearing

**Symptoms:** Clone exists but doesn't work
**Solutions:**
1. ✅ Check **"Is Active"** is enabled
2. ✅ Verify domain spelling in clone settings
3. ✅ Confirm middleware is running
4. ✅ Check browser dev tools for `x-clone-id` header
5. ✅ Try URL parameter method first: `?clone=your-clone-id`

### Issue 2: Content Not Showing

**Symptoms:** Domain works but shows default content
**Solutions:**
1. ✅ Verify content has **Clone Reference** set
2. ✅ Check **Is Active** on content documents
3. ✅ Confirm clone ID matches exactly
4. ✅ Check content fallback hierarchy
5. ✅ Review debug information

### Issue 3: Domain Validation Errors

**Symptoms:** Red error messages on domains
**Solutions:**
1. ✅ Remove `http://` and `https://` from domain
2. ✅ Check for typos or invalid characters
3. ✅ Ensure domain isn't used by another clone
4. ✅ Verify domain format: `example.com` not `www.example.com/path`

### Issue 4: Baseline Clone Conflicts

**Symptoms:** Can't set baseline clone
**Solutions:**
1. ✅ Only one clone can be baseline
2. ✅ Uncheck baseline on existing clone first
3. ✅ Save changes before setting new baseline
4. ✅ Refresh Sanity Studio if needed

---

## 📊 Best Practices

### 🎯 Content Strategy

1. **Start Minimal**: Create essential content first, inherit the rest
2. **Local Focus**: Emphasize local relevance and benefits
3. **Consistent Branding**: Maintain brand consistency while localizing
4. **Regular Updates**: Keep clone-specific content fresh and relevant

### 🔧 Technical Best Practices

1. **Clear Naming**: Use descriptive clone names and IDs
2. **Domain Planning**: Plan domain structure before creation
3. **Testing First**: Always test with URL parameters before DNS
4. **Documentation**: Document your clone strategy and content decisions

### 📈 Performance Optimization

1. **Selective Content**: Only create clone-specific content when needed
2. **Image Optimization**: Use appropriate images for local market
3. **Caching**: Leverage the built-in caching system
4. **Monitoring**: Monitor performance across all clones

---

## 🎉 Launch Checklist

Before going live with your new clone:

### Pre-Launch
- [ ] Clone document created and published
- [ ] Domains configured correctly
- [ ] Essential content created (hero, contact, testimonials)
- [ ] Tested with URL parameters
- [ ] Tested locally with /etc/hosts
- [ ] Debug information verified

### Technical Setup
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Middleware functioning
- [ ] Headers being set correctly
- [ ] Fallback content working

### Content Review
- [ ] All clone-specific content reviewed
- [ ] Local information accurate
- [ ] Contact details correct
- [ ] Legal/compliance content appropriate
- [ ] SEO settings configured

### Post-Launch
- [ ] Domain accessibility confirmed
- [ ] Clone-specific content displaying
- [ ] Contact forms working
- [ ] Analytics tracking set up
- [ ] Performance monitoring enabled

---

## 🎓 Advanced Topics

### Multiple Regional Variants

For brands with multiple regions:
```
Main Brand: "IB Tutors"
├── Abu Dhabi: "IB Tutors Abu Dhabi"
├── Dubai: "IB Tutors Dubai" 
├── Singapore: "IB Tutors Singapore"
└── London: "IB Tutors London"
```

### Seasonal Clones

For temporary or seasonal variants:
- Set specific activation periods
- Create event-specific content
- Plan deactivation strategy

### White-Label Solutions

For completely different branding:
- Create separate baseline clones
- Develop distinct visual identity
- Maintain separate content strategies

---

## 📞 Support and Resources

### Getting Help

1. **Technical Issues**: Check middleware logs and debug panel
2. **Content Questions**: Review fallback hierarchy documentation
3. **Sanity Studio**: Refer to Sanity documentation
4. **Domain/DNS**: Contact your hosting provider

### Useful Resources

- [Clone Context Integration Guide](./CLONE_CONTEXT_INTEGRATION.md)
- [Slug Management Documentation](./SLUG_MANAGEMENT.md)
- [Sanity Schema Documentation](../sanity/schemaTypes/)
- [Middleware Configuration](../middleware.ts)

---

🎉 **Congratulations!** You now have everything you need to create and manage clone websites. Start with a simple test clone, then expand to full production clones as you gain confidence with the system.

Remember: The clone system is designed to be flexible and forgiving. You can always modify settings, add content, and refine your approach as you learn what works best for your specific use case! 