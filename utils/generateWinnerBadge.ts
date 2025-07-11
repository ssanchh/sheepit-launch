export async function generateWinnerBadge(
  productName: string,
  position: number,
  weekDates: string
): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 500
  const ctx = canvas.getContext('2d')!

  // Background gradient based on position
  const gradients = {
    1: ['#FDE047', '#F59E0B'], // Gold
    2: ['#E5E7EB', '#9CA3AF'], // Silver
    3: ['#FED7AA', '#FB923C']  // Bronze
  }

  const [color1, color2] = gradients[position as keyof typeof gradients] || gradients[1]
  
  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)
  
  // Fill background
  ctx.fillStyle = gradient
  ctx.roundRect(0, 0, canvas.width, canvas.height, 20)
  ctx.fill()

  // Add white card
  ctx.fillStyle = 'white'
  ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 15)
  ctx.fill()

  // Add trophy emoji
  ctx.font = '80px Arial'
  ctx.textAlign = 'center'
  const trophies = { 1: '🥇', 2: '🥈', 3: '🥉' }
  ctx.fillText(trophies[position as keyof typeof trophies] || '🏆', canvas.width / 2, 120)

  // Add position text
  ctx.fillStyle = '#2D2D2D'
  ctx.font = 'bold 28px Inter, Arial'
  const positionText = { 1: 'GOLD WINNER', 2: 'SILVER WINNER', 3: 'BRONZE WINNER' }
  ctx.fillText(positionText[position as keyof typeof positionText] || 'WINNER', canvas.width / 2, 180)

  // Add product name
  ctx.font = 'bold 32px Inter, Arial'
  ctx.fillStyle = '#1F2937'
  
  // Word wrap product name if needed
  const maxWidth = 340
  const words = productName.split(' ')
  let line = ''
  let y = 250
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, canvas.width / 2, y)
      line = words[n] + ' '
      y += 40
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, canvas.width / 2, y)

  // Add Sheep It branding
  ctx.font = '20px Inter, Arial'
  ctx.fillStyle = '#666666'
  ctx.fillText('SHEEP IT', canvas.width / 2, y + 80)

  // Add week dates
  ctx.font = '16px Inter, Arial'
  ctx.fillStyle = '#999999'
  ctx.fillText(weekDates, canvas.width / 2, canvas.height - 60)

  // Add bottom text
  ctx.font = '14px Inter, Arial'
  ctx.fillText('Weekly Launch Competition', canvas.width / 2, canvas.height - 35)

  return canvas.toDataURL('image/png')
}