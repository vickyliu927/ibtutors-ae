'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'

type Submission = {
  _id: string
  submittedAt?: string
  fullName?: string
  email?: string
  phone?: string
  country?: string
  budget?: string
  details?: string
  sourceWebsite?: string
  sourceDomain?: string
  sourcePath?: string
  sourceUrl?: string
}

const BATCH_SIZE = 1000

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Escape quotes and wrap in quotes if contains special chars
  const needsQuotes = /[",\n\r]/.test(str)
  const escaped = str.replace(/"/g, '""')
  return needsQuotes ? `"${escaped}"` : escaped
}

function toCsv(rows: Array<Record<string, unknown>>, headers: string[]): string {
  const headerLine = headers.map(csvEscape).join(',')
  const lines = rows.map((row) => headers.map((h) => csvEscape(row[h])).join(','))
  return [headerLine, ...lines].join('\n')
}

export default function ExportSubmissionsTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [websites, setWebsites] = useState<string[]>([])
  const [selectedWebsite, setSelectedWebsite] = useState<string>('__all__')

  const headers = useMemo(
    () => [
      'submittedAt',
      'fullName',
      'email',
      'phone',
      'country',
      'budget',
      'details',
      'sourceWebsite',
      'sourceDomain',
      'sourcePath',
      'sourceUrl',
      '_id',
    ],
    []
  )

  // Load distinct websites for convenience filtering
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const values = await client.fetch<string[]>(
          `array::unique(*[_type == "contactFormSubmission" && defined(sourceWebsite)].sourceWebsite)`
        )
        if (!cancelled) {
          const unique = Array.from(new Set((values || []).filter(Boolean))).sort()
          setWebsites(unique)
        }
      } catch (e) {
        // Non-fatal
        // eslint-disable-next-line no-console
        console.warn('Failed to load websites list for filter:', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [client])

  const buildQuery = useCallback(
    (start: number, end: number) => {
      const base = `_type == "contactFormSubmission"`
      const websiteFilter =
        selectedWebsite !== '__all__' ? ` && sourceWebsite == "${selectedWebsite.replace(/"/g, '\\"')}"` : ''
      const filter = `${base}${websiteFilter}`
      const projection = `{
        _id,
        submittedAt,
        fullName,
        email,
        phone,
        country,
        budget,
        details,
        sourceWebsite,
        sourceDomain,
        sourcePath,
        sourceUrl
      }`
      return `*[${
        filter
      }] | order(submittedAt desc, _createdAt desc) [${start}...${end}] ${projection}`
    },
    [selectedWebsite]
  )

  const handleExport = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const allRows: Submission[] = []
      let start = 0
      while (true) {
        const batch: Submission[] = await client.fetch(buildQuery(start, start + BATCH_SIZE))
        allRows.push(...batch)
        if (batch.length < BATCH_SIZE) break
        start += BATCH_SIZE
      }

      if (allRows.length === 0) {
        setError('No submissions found for the selected filter.')
        setLoading(false)
        return
      }

      const formattedRows = allRows.map((s) => ({
        submittedAt: s.submittedAt ? new Date(s.submittedAt).toISOString() : '',
        fullName: s.fullName || '',
        email: s.email || '',
        phone: s.phone || '',
        country: s.country || '',
        budget: s.budget || '',
        details: s.details || '',
        sourceWebsite: s.sourceWebsite || '',
        sourceDomain: s.sourceDomain || '',
        sourcePath: s.sourcePath || '',
        sourceUrl: s.sourceUrl || '',
        _id: s._id || '',
      }))

      const csv = toCsv(formattedRows as Array<Record<string, unknown>>, headers)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      const suffix = selectedWebsite !== '__all__' ? `-${selectedWebsite.replace(/\s+/g, '-').toLowerCase()}` : ''
      a.href = url
      a.download = `contact-submissions${suffix}-${date}.csv`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to export submissions')
    } finally {
      setLoading(false)
    }
  }, [buildQuery, client, headers, selectedWebsite])

  return (
    <div style={{ padding: 16, maxWidth: 880 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Export Contact Form Submissions (CSV)</h2>
      <p style={{ color: '#666', marginBottom: 16 }}>
        Export all <code>contactFormSubmission</code> documents as a CSV file. Optionally filter by website before
        exporting.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <label style={{ fontWeight: 500 }}>Website filter:</label>
        <select
          value={selectedWebsite}
          onChange={(e) => setSelectedWebsite(e.target.value)}
          style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #e1e1e1' }}
        >
          <option value="__all__">All websites</option>
          {websites.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleExport}
          disabled={loading}
          style={{
            padding: '8px 12px',
            backgroundColor: '#0ea5e9',
            color: '#fff',
            border: 0,
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {error ? (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            padding: 12,
            borderRadius: 6,
          }}
        >
          {error}
        </div>
      ) : null}

      <div style={{ marginTop: 24, color: '#666', fontSize: 12 }}>
        Columns: {headers.join(', ')}
      </div>
    </div>
  )
}

