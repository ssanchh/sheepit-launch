import * as React from 'react'
import { BaseEmailTemplate } from './base'

interface ProductRejectedEmailProps {
  productName: string
  productUrl: string
  adminNotes?: string
}

export function ProductRejectedEmail({
  productName,
  productUrl,
  adminNotes
}: ProductRejectedEmailProps) {
  return (
    <BaseEmailTemplate previewText={`Update on ${productName}`}>
      <div>
        <h2 style={{
          margin: '0 0 20px',
          fontSize: '20px',
          fontWeight: '600',
          color: '#2D2D2D',
        }}>
          Product Update
        </h2>

        <p style={{
          margin: '0 0 20px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          Thank you for submitting <strong>{productName}</strong> to Sheep It.
        </p>

        <p style={{
          margin: '0 0 20px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          After careful review, we've decided not to approve this product at this time. 
          This could be due to various reasons such as incomplete information, 
          unclear product description, or not meeting our community guidelines.
        </p>

        {adminNotes && (
          <div style={{
            margin: '0 0 30px',
            padding: '20px',
            backgroundColor: '#FDFCFA',
            border: '1px solid #F5F5F5',
            borderRadius: '8px',
          }}>
            <p style={{
              margin: '0 0 10px',
              fontSize: '14px',
              color: '#999999',
            }}>
              Feedback from our team:
            </p>
            <p style={{
              margin: 0,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#2D2D2D',
            }}>
              {adminNotes}
            </p>
          </div>
        )}

        <p style={{
          margin: '0 0 30px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          You're welcome to update your product and resubmit it for review.
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
                View Your Products
              </a>
            </td>
          </tr>
        </table>
      </div>
    </BaseEmailTemplate>
  )
}