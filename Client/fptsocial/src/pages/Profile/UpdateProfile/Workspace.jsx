import { NativeSelect, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function Workspace({ register, user, errors, control, listStatus }) {


  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Workplace</span>
        </div>
      </div>
      <TextInput
        label="Workplace"
        defaultValue={user?.workPlaces[0]?.workPlaceName}
        placeholder="Workplace"
        error={!!errors['workPlace'] && `${errors['workPlace']?.message}`}
        {...register('workPlace', {
          pattern: {
            value: WHITESPACE_RULE,
            message: WHITESPACE_MESSAGE
          }
        })}
      />

      <Controller
        name="workplaceStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Workplace status"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <option value='' disabled>Select status</option>
            <optgroup >
              {listStatus?.map(status => (
                <option key={status?.userStatusId} value={status?.userStatusId}>{status?.statusName}</option>
              ))}
            </optgroup>
          </NativeSelect>
        )}
      />
    </div>
  )
}

export default Workspace
