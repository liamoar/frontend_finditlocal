import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = "", size = 'md' }: LogoProps) {
  const dimensions = {
    sm: { width: 120, height: 30 },
    md: { width: 160, height: 40 },
    lg: { width: 200, height: 50 }
  }

  const { width, height } = dimensions[size]

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src="/logo.png"
        alt="FindItLocal - Discover Local Businesses in Dubai"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  )
}