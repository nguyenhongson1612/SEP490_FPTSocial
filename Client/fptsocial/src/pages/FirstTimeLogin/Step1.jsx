import { NativeSelect, TextInput, Textarea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { getGender } from '~/apis';
import { FIELD_REQUIRED_MESSAGE, PHONE_NUMBER_MESSAGE, PHONE_NUMBER_RULE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators';

function Step1({ register, errors, control }) {
  const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  const [listGender, setListGender] = useState([])

  useEffect(() => {
    getGender().then(data => {
      setListGender(data)
    })
  }, [])

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Main Information<span className='text-red-500'>(*)</span></span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold' >
        <div className='grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-y-2'>
          <TextInput
            className='col-span-2 sm:col-span-1'
            label="First name"
            required
            placeholder="First name"
            error={!!errors['firstName'] && `${errors['firstName']?.message}`}
            {...register('firstName', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: WHITESPACE_RULE,
                message: WHITESPACE_MESSAGE
              }
            })}
          />

          <TextInput
            className='col-span-2 sm:col-span-1'
            label="Last name"
            required
            placeholder="Last name"
            error={!!errors['lastName'] && `${errors['lastName']?.message}`}
            {...register('lastName', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: WHITESPACE_RULE,
                message: WHITESPACE_MESSAGE
              }
            })}
          />
          <TextInput
            className='col-span-2 sm:col-span-1'
            disabled
            label="Email"
            // defaultValue={user?.contactInfo?.primaryNumber}
            placeholder="Email"
            {...register('email', {})}
          />
          <Controller
            name="genderId"
            control={control}
            defaultValue={''}
            rules={{ required: FIELD_REQUIRED_MESSAGE }}
            render={({ field }) => (
              <NativeSelect
                {...field}
                required
                className='col-span-2 sm:col-span-1'
                error={!!errors['genderId'] && `${errors['genderId']?.message}`}
                label="Select gender"
                onChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <option value="" disabled>Select gender</option>
                <optgroup>
                  {listGender?.map(gender => (
                    <option key={gender?.genderId} value={gender?.genderId}>{gender?.genderName}</option>
                  ))}
                </optgroup>
              </NativeSelect>
            )}
          />
          <TextInput
            className='col-span-2 sm:col-span-1'
            label="Hometown"
            placeholder="Hometown"
            error={!!errors['homeTown'] && `${errors['homeTown']?.message}`}
            {...register('homeTown', {
              pattern: {
                value: WHITESPACE_RULE,
                message: WHITESPACE_MESSAGE
              }
            })}
          />

          <TextInput
            className='col-span-2 sm:col-span-1'
            label="Birthday"
            type="date"
            required
            max={yesterday}
            placeholder="Birthday"
            error={!!errors['birthDay'] && `${errors['birthDay']?.message}`}
            {...register('birthDay', { required: FIELD_REQUIRED_MESSAGE })}
          />
          <Textarea
            className='col-span-2'
            label="About me"
            placeholder="About me"
            error={!!errors['aboutMe'] && `${errors['aboutMe']?.message}`}
            {...register('aboutMe', {
              pattern: {
                value: WHITESPACE_RULE,
                message: WHITESPACE_MESSAGE
              }
            })}
          />
        </div>
      </div >
    </div >
  )
}

export default Step1
