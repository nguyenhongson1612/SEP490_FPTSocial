import { useEffect, useRef, useState } from 'react'
import Step0 from './Step0'
import Step1 from './Step1'
import { useForm } from 'react-hook-form'
import Step2 from './Step2'
import Step3 from './Step3'
import Progress from './Progress'
import { createByLogin } from '~/apis'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function FirstTimeLogin() {
  const [step, setStep] = useState(0)
  const formRef = useRef(null)
  const navigate = useNavigate()

  const profileFedi = JSON.parse(sessionStorage.getItem('oidc.user:https://feid.ptudev.net:societe-front-end'))?.profile
  const initialGeneralForm = {
    'email': profileFedi?.email,
  }

  const { register, control, getValues, setValue, watch, handleSubmit, trigger, formState: { errors, isValid } } = useForm({ mode: 'all', defaultValues: initialGeneralForm })
  const [avataphoto, coverImage] = watch(['avataphoto', 'coverImage'])

  const totalStep = 3
  const handlePrev = () => {
    if (step >= 1) setStep(step - 1)
  }
  const handleNext = async () => {
    if (step < 3) setStep(step + 1)
  }

  useEffect(() => {
    if (!isValid) {
      trigger()
    }
  }, [isValid, trigger])

  const processWidth = () => {
    if (step >= 1) return (step - 1) / (totalStep - 1) * 100
  }

  const renderSteps = () => {
    switch (step) {
      case 0: return <Step0 handleNext={handleNext} />
      case 1: return <Step1 register={register} errors={errors} control={control} getValues={getValues} setValue={setValue} />
      case 2: return <Step2 register={register} errors={errors} control={control} getValues={getValues} setValue={setValue} />
      case 3: return <Step3 register={register} errors={errors} watch={watch} getValues={getValues} setValue={setValue} />
      default: return <Step0 handleNext={handleNext} />
    }
  }

  const submitData = (data) => {
    // console.log(data)
    const initialSubmitData = {
      'useId': null,
      'firstName': data?.firstName,
      'lastName': data?.lastName,
      'email': data?.email,
      'feId': profileFedi?.email,
      'roleName': null,
      'birthDay': data?.birthDay,
      'gender': {
        'genderId': data?.genderId,
      },
      'contactInfor': {
        'secondEmail': null,
        'primaryNumber': '',
        'secondNumber': null,
        'userStatusId': null
      },
      'relationship': {
        'relationshipId': data?.relationship?.length == 0 ? null : data?.relationship,
      },
      'aboutMe': data?.aboutMe,
      'homeTown': data?.homeTown,
      'coverImage': data?.coverImage?.length !== 0 ? data?.coverImage : null,
      'userNumber': profileFedi?.userId,
      'avataphoto': data?.avataphoto?.length !== 0 ? data?.avataphoto : null,
      'userSetting': [{
        'settingId': null
      }],
      'interes': data?.interest?.length !== 0 ? data?.interest?.map(e => ({ interestId: e })) : [{ 'interestId': null }],
      'workPlace': [{
        'workPlaceName': data?.workPlace,
      }],
      'webAffilication': [{
        'webAffiliationUrl': null
      }]
    }
    // console.log(initialSubmitData)
    toast.promise(
      createByLogin(initialSubmitData),
      { pending: 'Created is in progress...' }
    ).then(() => {
      navigate('/')
      toast.success('Account updated successfully')
    })
  }

  return (
    <div className={`bg-gradient-to-r from-[rgba(242,113,36,0.3)] to-[rgba(242,113,36,0.7)] ${step !== 0 && 'img-bg2'} w-screen h-screen flex flex-col items-center justify-center overflow-hidden`}>
      <div className='relative min-w-[16rem] min-h-[25rem] h-fit w-[80%] md:w-[70%] lg:w-[55%] bg-white rounded-2xl shadow-4edges '>
        <form ref={formRef} className='h-full' id='formSubmit' onSubmit={handleSubmit(submitData)}>{renderSteps()}</form>
        {step !== 0 &&
          <Progress handleNext={handleNext} handlePrev={handlePrev} processWidth={processWidth}
            step={step} isValid={isValid} submitForm={() => formRef.current.requestSubmit()} />
        }
      </div>

    </div>
  )
}
export default FirstTimeLogin
