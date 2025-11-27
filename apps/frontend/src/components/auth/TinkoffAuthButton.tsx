import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

interface TinkoffAuthButtonProps {
  className?: string
}

const TinkoffAuthButton: React.FC<TinkoffAuthButtonProps> = ({ className }) => {
  const { loginWithTinkoff } = useAuth()

  const handleClick = () => {
    loginWithTinkoff()
  }

  return (
    <Button
      onClick={handleClick}
      className={`bg-[#FFDD2D] hover:bg-[#E6C526] text-black p-2 flex items-center justify-center w-full ${className}`}
      type='button'
    >
      <div className='flex items-center'>
        <div className='h-6 w-6 mr-2 bg-black rounded flex items-center justify-center'>
          <span className='text-[#FFDD2D] font-bold text-sm'>Т</span>
        </div>
        <span>Войти через Тинькофф ID</span>
      </div>
    </Button>
  )
}

export default TinkoffAuthButton
