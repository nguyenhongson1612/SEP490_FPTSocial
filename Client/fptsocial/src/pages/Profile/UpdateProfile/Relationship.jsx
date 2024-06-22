import { NativeSelect } from '@mantine/core'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'

function Relationship({ user, listRelationship, control, listStatus }) {

  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Relationships</span>
        </div>
      </div>

      <Controller
        name="relationship"
        control={control}
        defaultValue={user?.userRelationship?.relationshipId ?? ''}
        render={({ field }) => (
          <NativeSelect
            {...field}
            onChange={(value) => field.onChange(value)}
            value={field.value}
            label="Your relationship"
          >
            <option value='' disabled>Select status</option>
            <optgroup >
              {listRelationship?.map(relationship => (
                <option key={relationship?.relationShipId} value={relationship?.relationShipId}>{relationship?.relationshipName}</option>
              ))}
            </optgroup>
          </NativeSelect>
        )}
      />

      <Controller
        name="relationshipStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Relationship status"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <option value='' disabled>Select status</option>
            <optgroup>
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

export default Relationship
