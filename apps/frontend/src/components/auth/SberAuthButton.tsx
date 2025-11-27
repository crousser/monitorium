import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

interface SberAuthButtonProps {
  className?: string
}

const SberAuthButton: React.FC<SberAuthButtonProps> = ({ className }) => {
  const { loginWithSber } = useAuth()

  const handleClick = () => {
    loginWithSber()
  }

  return (
    <Button
      onClick={handleClick}
      className={`bg-[#21A038] hover:bg-[#1C8A30] text-white p-2 flex items-center justify-center w-full ${className}`}
      type='button'
    >
      <div className='flex items-center'>
        <div className='h-6 w-6 mr-2 bg-white rounded flex items-center justify-center'>
          <span className='text-[#21A038] font-bold text-sm'>С</span>
        </div>
        <span>Войти через Сбер ID</span>
      </div>
    </Button>
  )
}

export default SberAuthButton
