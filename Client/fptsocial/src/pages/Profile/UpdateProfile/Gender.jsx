import { NativeSelect } from '@mantine/core'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'

function Gender({ user, control, listGender, listStatus }) {


  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Gender</span>
        </div>
      </div>
      <Controller
        name="gender"
        control={control}
        defaultValue={user?.userGender?.genderId}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Select gender"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <optgroup label="Select gender">
              {listGender?.map(gender => (
                <option key={gender?.genderId} value={gender?.genderId}>{gender?.genderName}</option>
              ))}
            </optgroup>
          </NativeSelect>
        )}
      />

      <Controller
        name="genderStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Gender status"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <option value="" disabled>Select status</option>
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

export default Gender
