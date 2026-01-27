'use client'

import Link from 'next/link'

export default function StudioPage() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '48v38ttl'

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 200px)',
      flexDirection: 'column',
      gap: '2rem',
      padding: '2rem',
      textAlign: 'center',
      color: 'var(--text-primary)'
    }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Sanity Studio
        </h1>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          Manage your portfolio content through Sanity Studio
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        padding: '1.5rem', 
        borderRadius: '1rem', 
        marginBottom: '2rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>
          Quick Access Options:
        </h2>
        <ol style={{ 
          textAlign: 'left', 
          color: 'var(--text-secondary)', 
          lineHeight: '1.8',
          paddingLeft: '1.5rem'
        }}>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Local Studio:</strong> Run <code style={{ backgroundColor: 'var(--bg-dark)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>npx sanity dev</code> in your terminal (opens at <code style={{ backgroundColor: 'var(--bg-dark)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>localhost:3333</code>)
          </li>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Online Dashboard:</strong> Click the button below to access your project
          </li>
        </ol>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href={`https://sanity.io/manage/personal/project/${projectId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '1rem 2rem',
            backgroundColor: 'var(--primary-accent)',
            color: 'white',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.2s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          Open Project Dashboard →
        </a>
        <Link
          href="/"
          style={{
            padding: '1rem 2rem',
            border: '2px solid var(--border-light)',
            color: 'var(--text-primary)',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.2s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary-accent)'
            e.currentTarget.style.backgroundColor = 'rgba(109, 40, 217, 0.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-light)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Back to Portfolio
        </Link>
      </div>
      
      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Or visit: <a 
          href="https://sanity.io/manage" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: 'var(--primary-accent)', textDecoration: 'underline' }}
        >
          sanity.io/manage
        </a> and select your project
      </p>
    </div>
  )
}
