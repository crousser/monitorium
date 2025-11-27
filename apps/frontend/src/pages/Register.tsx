import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthContext'
import {
  RegisterStep1,
  VerificationStep,
  RegisterFooter,
} from '@/components/voter'
import {
  GosuslugiAuthButton,
  SberAuthButton,
  TinkoffAuthButton,
} from '@/components/auth'
import { Separator } from '@/components/ui/separator'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    district: '',
    address: '',
    useAddress: false,
    verificationCode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault()

    // Проверяем, что все обязательные поля заполнены
    if (!formData.fullName || !formData.email || !formData.password) {
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        phone: formData.phone || undefined,
        district: formData.district || undefined,
      })

      // После успешной регистрации перенаправляем на dashboard
      navigate('/dashboard')
    } catch (error) {
      // Ошибка уже обработана в контексте через toast
      console.error('Registration error:', error)
    }
  }

  const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    // Пока что оставляем верификацию как заглушку
    // В будущем здесь будет проверка кода верификации
    navigate('/dashboard')
  }

  return (
    <Layout>
      <div className='honor-container py-12'>
        <div className='max-w-md mx-auto'>
          <h1 className='text-3xl font-bold mb-8 text-center'>
            Регистрация избирателя
          </h1>

          <div className='flex flex-col gap-3 mb-6'>
            <GosuslugiAuthButton />
            <SberAuthButton />
            <TinkoffAuthButton />
          </div>

          <div className='flex items-center my-6'>
            <Separator className='flex-grow' />
            <span className='px-4 text-sm text-honor-darkGray'>или</span>
            <Separator className='flex-grow' />
          </div>

          {step === 1 ? (
            <RegisterStep1
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmitStep1}
            />
          ) : (
            <VerificationStep
              verificationCode={formData.verificationCode}
              handleChange={handleChange}
              handleSubmit={handleSubmitStep2}
              goBack={() => setStep(1)}
            />
          )}

          <RegisterFooter />

          <div className='mt-6 text-center'>
            <div className='text-sm text-honor-darkGray mb-2'>
              Регистрация через сервисы идентификации позволит автоматически
              заполнить данные профиля и получить подтверждение вашей личности.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Register
