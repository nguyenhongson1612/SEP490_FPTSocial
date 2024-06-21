import { NativeSelect, TextInput } from '@mantine/core';
import { Controller } from 'react-hook-form';
import { EMAIL_MESSAGE, EMAIL_RULE, PHONE_NUMBER_MESSAGE, PHONE_NUMBER_RULE } from '~/utils/validators';

function Contact({ register, user, errors, control, listStatus }) {
  return <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
    <div className='col-span-1 xs:col-span-2'>
      <div className='flex items-center '>
        <span className='text-xl font-bold'>Contact</span>
      </div>
    </div>

    <TextInput
      label="Primary number"
      defaultValue={user?.contactInfo?.primaryNumber}
      placeholder="Primary number"
      error={!!errors['primaryNumber'] && `${errors['primaryNumber']?.message}`}
      {...register('primaryNumber', {
        pattern: {
          value: PHONE_NUMBER_RULE,
          message: PHONE_NUMBER_MESSAGE
        }
      })}
    />

    <TextInput
      label="Second number"
      defaultValue={user?.contactInfo?.secondNumber}
      placeholder="Second number"
      error={!!errors['secondNumber'] && `${errors['secondNumber']?.message}`}
      {...register('secondNumber', {
        pattern: {
          value: PHONE_NUMBER_RULE,
          message: PHONE_NUMBER_MESSAGE
        }
      })}
    />

    <TextInput
      label="Second email"
      defaultValue={user?.contactInfo?.secondEmail}
      placeholder="Second email"
      error={!!errors['secondEmail'] && `${errors['secondEmail']?.message}`}
      {...register('secondEmail', {
        pattern: {
          value: EMAIL_RULE,
          message: EMAIL_MESSAGE
        }
      })}
    />
    <Controller
      name="contactStatus"
      control={control}
      defaultValue={user?.contactInfo?.userStatusId}
      render={({ field }) => (
        <NativeSelect
          {...field}
          label="Contact status"
          onChange={(value) => field.onChange(value)}
          value={field.value}
        >
          <optgroup label="Select status">
            {listStatus?.map(status => (
              <option key={status?.userStatusId} value={status?.userStatusId}>{status?.statusName}</option>
            ))}
          </optgroup>
        </NativeSelect>
      )}
    />
  </div>
}

export default Contact
