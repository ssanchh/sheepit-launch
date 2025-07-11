'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import LoginModal from '@/components/LoginModal'

interface LoginModalContextType {
  openLoginModal: (redirectTo?: string) => void
  closeLoginModal: () => void
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/')

  const openLoginModal = (redirect: string = '/') => {
    setRedirectTo(redirect)
    setIsOpen(true)
  }

  const closeLoginModal = () => {
    setIsOpen(false)
  }

  return (
    <LoginModalContext.Provider value={{ openLoginModal, closeLoginModal }}>
      {children}
      <LoginModal 
        isOpen={isOpen}
        onClose={closeLoginModal}
        redirectTo={redirectTo}
      />
    </LoginModalContext.Provider>
  )
}

export function useLoginModal() {
  const context = useContext(LoginModalContext)
  if (context === undefined) {
    throw new Error('useLoginModal must be used within a LoginModalProvider')
  }
  return context
}