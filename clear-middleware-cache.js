// This script simulates what happens when you visit Qatar domain
// and helps debug middleware caching issues

console.log('🧹 Middleware Cache Debug and Clear');
console.log('===================================\n');

console.log('To debug middleware caching issues:');
console.log('1. 🔍 Check server logs when visiting onlinetutors.qa/maths');
console.log('2. 🔍 Look for these middleware log patterns:');
console.log('   - "[Middleware] Cache hit for domain: onlinetutors.qa -> qatar-tutors"');
console.log('   - "[Middleware] Cache miss for domain: onlinetutors.qa, querying Sanity..."');
console.log('   - "[Middleware] Found clone: Qatar Tutors (qatar-tutors) for domain: onlinetutors.qa"');
console.log('   - "[Middleware] Set clone headers: qatar-tutors for domain: onlinetutors.qa"');
console.log('');

console.log('3. 🔍 Check debug headers in subject page logs:');
console.log('   - Should see x-clone-id: qatar-tutors');
console.log('   - Should see x-clone-name: Qatar Tutors');
console.log('');

console.log('If middleware cache is corrupt (showing wrong clone):');
console.log('💡 SOLUTION: Restart the Vercel deployment to clear in-memory cache');
console.log('   - Go to Vercel dashboard → Deployments → Redeploy');
console.log('   - Or push an empty commit to trigger fresh deployment');
console.log('');

console.log('Expected flow for onlinetutors.qa/maths:');
console.log('1. Middleware: onlinetutors.qa → qatar-tutors');
console.log('2. Headers: x-clone-id = qatar-tutors');
console.log('3. Subject page: cloneId = qatar-tutors');
console.log('4. Query: cloneSpecific finds "Online Qatar Maths Tutor"');
console.log('5. Result: Shows Qatar content ✅');
console.log('');

console.log('If it fails:');
console.log('❌ Middleware not running → No clone headers set');
console.log('❌ Wrong cache → Wrong clone ID in headers');
console.log('❌ Query fails → Falls back to default Dubai content');

// Test what the middleware cache might have
const testDomains = ['onlinetutors.qa', 'www.onlinetutors.qa'];
console.log('\n🧪 Test these domains in production:');
testDomains.forEach(domain => {
  console.log(`  curl -I https://${domain}/maths | grep x-clone`);
}); 