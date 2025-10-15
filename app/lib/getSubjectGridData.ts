import { cachedFetch } from '@/sanity/lib/queryCache';

export interface SubjectPageData {
  _id: string;
  title: string;
  subject: string;
  slug: {
    current: string;
  };
  displayOrder: number;
  firstSection: {
    title: string;
    highlightedWords?: string[];
    description: string;
  };
}

export async function getSubjectGridData(
  cloneId?: string | null,
  options?: { cloneOnly?: boolean }
): Promise<SubjectPageData[]> {
  try {
    // If no cloneId provided, try to get it from middleware headers
    let targetCloneId = cloneId;
    if (!targetCloneId) {
      try {
        // Dynamically import next/headers only on server-side
        const { headers } = await import('next/headers');
        const headersList = headers();
        targetCloneId = headersList.get('x-clone-id');
      } catch (error) {
        console.log('[getSubjectGridData] Could not access headers (client-side call), will use basic query');
        // For client-side calls, continue without clone ID (will use default data)
      }
    }

    // Build clone-aware query with 3-tier fallback
    const query = `{
      "cloneSpecific": *[_type == "subjectPage" && defined($cloneId) && cloneReference->cloneId.current == $cloneId && isActive == true] | order(displayOrder asc) {
        _id,
        title,
        subject,
        slug,
        displayOrder,
        firstSection,
        "sourceInfo": {
          "source": "cloneSpecific",
          "cloneId": $cloneId
        }
      },
      "baseline": *[_type == "subjectPage" && cloneReference->baselineClone == true && isActive == true] | order(displayOrder asc) {
        _id,
        title,
        subject,
        slug,
        displayOrder,
        firstSection,
        "sourceInfo": {
          "source": "baseline",
          "cloneId": cloneReference->cloneId.current
        }
      },
      "default": *[_type == "subjectPage" && !defined(cloneReference) && isActive == true] | order(displayOrder asc) {
        _id,
        title,
        subject,
        slug,
        displayOrder,
        firstSection,
        "sourceInfo": {
          "source": "default",
          "cloneId": null
        }
      }
    }`;

    const params = { cloneId: targetCloneId };

    // Using cachedFetch with clone-aware caching
    const result = await cachedFetch<{
      cloneSpecific: (SubjectPageData & { sourceInfo?: { source: string; cloneId: string } })[] | null;
      baseline: (SubjectPageData & { sourceInfo?: { source: string; cloneId: string } })[] | null;
      default: (SubjectPageData & { sourceInfo?: { source: string; cloneId: string } })[] | null;
    }>(
      query,
      params,
      { next: { revalidate: 600 } }, // 10 minutes cache
      10 * 60 * 1000 // 10 minutes TTL
    );

    if (!result) {
      console.log('[getSubjectGridData] No result from query');
      return [];
    }

    // Return clone-only subjects when requested (no fallback)
    if (options?.cloneOnly) {
      const cloneOnlyData = (result.cloneSpecific || []).map((item) => {
        const { sourceInfo, ...subject } = item as SubjectPageData & { sourceInfo?: any };
        return subject;
      });
      console.log(`[getSubjectGridData] cloneOnly mode: ${cloneOnlyData.length} subjects for clone: ${params.cloneId || 'none'}`);
      return cloneOnlyData;
    }

    // Apply 3-tier fallback resolution
    let subjectData: SubjectPageData[] = [];
    let source = 'none';
    
    if (result.cloneSpecific && result.cloneSpecific.length > 0) {
      subjectData = result.cloneSpecific;
      source = 'cloneSpecific';
    } else if (result.baseline && result.baseline.length > 0) {
      subjectData = result.baseline;
      source = 'baseline';
    } else if (result.default && result.default.length > 0) {
      subjectData = result.default;
      source = 'default';
    }

    console.log(`[getSubjectGridData] Resolved ${subjectData.length} subjects from: ${source} for clone: ${targetCloneId || 'none'}`);
    
    // Clean up the data (remove sourceInfo)
    return subjectData.map((item) => {
      const { sourceInfo, ...subject } = item as SubjectPageData & { sourceInfo?: any };
      return subject;
    });
  } catch (err) {
    console.error('Error fetching subject grid data:', err);
    return [];
  }
} 