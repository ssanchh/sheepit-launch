import * as React from 'react'
import { BaseEmailTemplate } from './base'

interface NewCommentEmailProps {
  productName: string
  productUrl: string
  commenterName: string
  commentText: string
  userName?: string
}

export function NewCommentEmail({
  productName,
  productUrl,
  commenterName,
  commentText,
  userName = 'there'
}: NewCommentEmailProps) {
  return (
    <BaseEmailTemplate previewText={`${commenterName} commented on ${productName}`}>
      <div>
        <h2 style={{
          margin: '0 0 20px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#2D2D2D',
        }}>
          💬 New comment on your product
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
          <strong>{commenterName}</strong> just commented on <strong>{productName}</strong>:
        </p>

        <div style={{
          margin: '0 0 30px',
          padding: '20px',
          backgroundColor: '#FDFCFA',
          border: '1px solid #F5F5F5',
          borderRadius: '8px',
        }}>
          <p style={{
            margin: 0,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#2D2D2D',
            fontStyle: 'italic',
          }}>
            "{commentText}"
          </p>
        </div>

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
                View Comment & Reply
              </a>
            </td>
          </tr>
        </table>

        <p style={{
          margin: '30px 0 0',
          fontSize: '14px',
          lineHeight: '20px',
          color: '#999999',
          textAlign: 'center',
        }}>
          Engaging with your community helps build momentum for your launch!
        </p>
      </div>
    </BaseEmailTemplate>
  )
}