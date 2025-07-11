import * as React from 'react'
import { BaseEmailTemplate } from './base'

interface WelcomeEmailProps {
  userName?: string
  dashboardUrl: string
  submitUrl: string
}

export function WelcomeEmail({
  userName = 'Maker',
  dashboardUrl,
  submitUrl
}: WelcomeEmailProps) {
  return (
    <BaseEmailTemplate previewText="Welcome to Sheep It! 🐑">
      <div>
        <h2 style={{
          margin: '0 0 20px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#2D2D2D',
        }}>
          Welcome to Sheep It! 🎉
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
          margin: '0 0 30px',
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
        }}>
          Welcome to the community of indie makers! We're excited to have you join thousands of founders who launch their products here every week.
        </p>

        {/* What you can do */}
        <div style={{
          margin: '0 0 30px',
          padding: '20px',
          backgroundColor: '#FDFCFA',
          border: '1px solid #F5F5F5',
          borderRadius: '8px',
        }}>
          <h3 style={{
            margin: '0 0 15px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#2D2D2D',
          }}>
            Here's what you can do:
          </h3>
          
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#666666',
          }}>
            <li style={{ marginBottom: '10px', lineHeight: '24px' }}>
              <strong>Submit your product</strong> - Share what you're building with the community
            </li>
            <li style={{ marginBottom: '10px', lineHeight: '24px' }}>
              <strong>Vote on products</strong> - Support fellow makers by voting for products you love
            </li>
            <li style={{ marginBottom: '10px', lineHeight: '24px' }}>
              <strong>Win prizes</strong> - Top 3 products each week get featured to 50k+ subscribers
            </li>
            <li style={{ lineHeight: '24px' }}>
              <strong>Get feedback</strong> - Engage with the community through comments
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <table cellPadding="0" cellSpacing="0" border={0} width="100%" style={{ marginBottom: '30px' }}>
          <tr>
            <td align="center">
              <table cellPadding="0" cellSpacing="0" border={0}>
                <tr>
                  <td style={{ paddingRight: '10px' }}>
                    <a
                      href={submitUrl}
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
                      Submit Your Product
                    </a>
                  </td>
                  <td>
                    <a
                      href={dashboardUrl}
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#ffffff',
                        color: '#2D2D2D',
                        fontSize: '16px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        border: '1px solid #E5E5E5',
                      }}
                    >
                      Complete Profile
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        {/* Tips */}
        <div style={{
          padding: '15px',
          backgroundColor: '#F5F5F5',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '20px',
            color: '#666666',
          }}>
            <strong>💡 Pro tip:</strong> Products launch every Monday. The earlier you submit, the better your queue position!
          </p>
        </div>

        <p style={{
          margin: 0,
          fontSize: '16px',
          lineHeight: '24px',
          color: '#666666',
          textAlign: 'center',
        }}>
          Questions? Just reply to this email - we're here to help!
        </p>
      </div>
    </BaseEmailTemplate>
  )
}