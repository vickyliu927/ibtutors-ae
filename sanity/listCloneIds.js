const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'r689038t',
  dataset: 'production',
  apiVersion: '2024-03-20',
  useCdn: true,
});

async function listCloneIds(slugs) {
  const query = `*[_type == "clone" && cloneId.current in $ids]{ _id, cloneName, "slug": cloneId.current } | order(cloneName asc)`;
  const res = await client.fetch(query, { ids: slugs });
  console.log(JSON.stringify(res, null, 2));
}

if (require.main === module) {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.log('Usage: node sanity/listCloneIds.js <slug1> <slug2> ...');
    console.log('Example: node sanity/listCloneIds.js germany-tutors italy-tutors qatar-tutors spain-tutors');
    process.exit(1);
  }
  listCloneIds(slugs).catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { listCloneIds };
