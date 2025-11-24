import { client } from '@/sanity/lib/client';

type CloneRecord = {
  cloneName: string;
  domains?: string[];
};

async function main() {
  const query = `*[_type == "clone" && isActive == true]{ cloneName, "domains": metadata.domains }`;
  const clones = await client.fetch<CloneRecord[]>(query);

  const allDomains = (clones ?? [])
    .flatMap(c => (c.domains ?? []))
    .filter(Boolean)
    .map(d => d.toLowerCase());

  // Include both bare and www variants for each domain
  const withVariants = allDomains.flatMap(d => {
    const bare = d.replace(/^www\./, '');
    return [bare, `www.${bare}`];
  });

  const uniqueDomains = Array.from(new Set(withVariants)).sort();

  const result = {
    domains: uniqueDomains,
    byClone: (clones ?? []).map(c => ({
      cloneName: c.cloneName,
      domains: Array.from(new Set((c.domains ?? []).flatMap(d => {
        const lower = d.toLowerCase();
        const bare = lower.replace(/^www\./, '');
        return [bare, `www.${bare}`];
      }))).sort()
    }))
  };

  // Pretty print to stdout
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error('Failed to list domains:', err);
  process.exit(1);
});


