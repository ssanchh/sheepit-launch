import * as React from 'react'
import { BaseEmailTemplate } from './base'

interface ProductApprovedEmailProps {
  productName: string
  productUrl: string
  queuePosition?: number
  userName?: string
}

export function ProductApprovedEmail({
  productName,
  productUrl,
  queuePosition,
  userName = 'Maker'
}: ProductApprovedEmailProps) {
  return (
    <BaseEmailTemplate previewText={`Great news! ${productName} has been approved`}>
      <div>
        <h2 style={{
          margin: '0 0 20px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#2D2D2D',
        }}>
          🎉 Your product has been approved!
        </h2>

        <p style={{
          margin: '0 0 20px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          Hi {userName},
        </p>

        <p style={{
          margin: '0 0 20px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          Great news! <strong>{productName}</strong> has been approved and is now in the launch queue.
        </p>

        {queuePosition && (
          <div style={{
            margin: '0 0 30px',
            padding: '20px',
            backgroundColor: '#FDFCFA',
            border: '1px solid #F5F5F5',
            borderRadius: '8px',
          }}>
            <p style={{
              margin: '0 0 10px',
              fontSize: '16px',
              color: '#2D2D2D',
              fontWeight: '600',
            }}>
              Queue Position: #{queuePosition}
            </p>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666666',
            }}>
              Your product will launch in approximately {Math.ceil(queuePosition / 10)} week{Math.ceil(queuePosition / 10) > 1 ? 's' : ''}.
            </p>
          </div>
        )}

        <p style={{
          margin: '0 0 30px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          Want to launch sooner? You can skip the queue for just $35.
        </p>

        <table cellPadding="0" cellSpacing="0" border={0} width="100%">
          <tr>
            <td align="center">
              <a
                href={productUrl}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#2D2D2D',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  borderRadius: '8px',
                }}
              >
                View Your Product
              </a>
            </td>
          </tr>
        </table>

        <p style={{
          margin: '30px 0 0',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#999999',
        }}>
          Tip: Share your product with your community to get more votes when it launches!
        </p>
      </div>
    </BaseEmailTemplate>
  )
}