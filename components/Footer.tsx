import Link from 'next/link'
import { Twitter, Github, Mail, Lock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-[#2D2D2D] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐑</span>
              <h3 className="text-xl font-bold">Sheep It</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Weekly product launches for indie makers. Get your product in front of early adopters.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com/sheep_it" target="_blank" rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:santiago@sheepit.io" 
                className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Launch</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/submit" className="text-gray-300 hover:text-white transition-colors">
                  Submit Product
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  Past Winners
                </span>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-300 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Company Info */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center md:text-left mb-6">
            <h4 className="font-semibold mb-3 text-white">Company Information</h4>
            <p className="text-sm text-gray-300">Operated by: Santiago Sánchez (Sole Proprietor)</p>
            <p className="text-sm text-gray-300">Pedro Berro 1238, Montevideo, 11300, Uruguay</p>
            <p className="text-sm text-gray-300">Email: santiago@sheepit.io</p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Santiago Sánchez. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with ❤️ for indie makers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}