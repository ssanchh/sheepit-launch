import * as React from 'react'

interface BaseEmailTemplateProps {
  previewText?: string
  children: React.ReactNode
  unsubscribeUrl?: string
}

export function BaseEmailTemplate({ 
  previewText = '', 
  children, 
  unsubscribeUrl 
}: BaseEmailTemplateProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{previewText}</title>
        {previewText && (
          <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden' }}>
            {previewText}
          </div>
        )}
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <table
          cellPadding="0"
          cellSpacing="0"
          border={0}
          width="100%"
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <tr>
            <td align="center" style={{ padding: '40px 20px' }}>
              <table
                cellPadding="0"
                cellSpacing="0"
                border={0}
                width="600"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Logo Header */}
                <tr>
                  <td
                    align="center"
                    style={{
                      padding: '40px 40px 20px',
                      borderBottom: '1px solid #e5e5e5',
                    }}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      {/* Logo - Update the src URL with your actual logo */}
                      <img
                        src="https://sheepit.io/sheep-logo.png"
                        alt="Sheep It"
                        style={{
                          height: '50px',
                          width: 'auto',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    </div>
                    <h1 style={{
                      margin: 0,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2D2D2D',
                      letterSpacing: '-0.5px',
                    }}>
                      Sheep It
                    </h1>
                  </td>
                </tr>

                {/* Main Content */}
                <tr>
                  <td style={{ padding: '40px' }}>
                    {children}
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: '20px 40px 40px',
                      borderTop: '1px solid #e5e5e5',
                      fontSize: '14px',
                      color: '#666666',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ margin: '0 0 10px' }}>
                      © {new Date().getFullYear()} Sheep It. All rights reserved.
                    </p>
                    {unsubscribeUrl && (
                      <p style={{ margin: 0 }}>
                        <a
                          href={unsubscribeUrl}
                          style={{
                            color: '#666666',
                            textDecoration: 'underline',
                          }}
                        >
                          Unsubscribe
                        </a>
                        {' • '}
                        <a
                          href={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=profile`}
                          style={{
                            color: '#666666',
                            textDecoration: 'underline',
                          }}
                        >
                          Update preferences
                        </a>
                      </p>
                    )}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}