import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
 
    // Get dynamic values from search params
    const title = searchParams.get('title') || 'Sheep It'
    const description = searchParams.get('description') || 'Weekly Product Launch Platform for Indie Makers'
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FDFCFA',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #E5E5E5 2%, transparent 2%), radial-gradient(circle at 75px 75px, #E5E5E5 2%, transparent 2%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '4px solid #E5E5E5',
              borderRadius: '24px',
              padding: '80px',
              width: '90%',
              maxWidth: '1000px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                style={{ marginRight: '20px' }}
              >
                <circle cx="50" cy="50" r="45" fill="#2D2D2D" />
                <text
                  x="50"
                  y="65"
                  textAnchor="middle"
                  fill="white"
                  fontSize="40"
                  fontWeight="bold"
                >
                  🐑
                </text>
              </svg>
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#2D2D2D',
                }}
              >
                sheep it
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#2D2D2D',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: '1.2',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '24px',
                color: '#666666',
                textAlign: 'center',
                marginBottom: '40px',
                maxWidth: '800px',
              }}
            >
              {description}
            </p>

            {/* Call to action */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '12px',
                  padding: '16px 32px',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>🚀</span>
                <span style={{ fontSize: '20px', color: '#2D2D2D' }}>Launch Every Monday</span>
              </div>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '12px',
                  padding: '16px 32px',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>🏆</span>
                <span style={{ fontSize: '20px', color: '#2D2D2D' }}>Win Newsletter Feature</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '12px',
                  padding: '16px 32px',
                }}
              >
                <span style={{ fontSize: '20px', marginRight: '12px' }}>👥</span>
                <span style={{ fontSize: '20px', color: '#2D2D2D' }}>Real Community Feedback</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}