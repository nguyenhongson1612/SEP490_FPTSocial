import { MultiSelect, NativeSelect } from '@mantine/core'
import { Controller } from 'react-hook-form'

function Interests({ user, listInterest, control, listStatus }) {
  return (
    <div className='w-full grid grid-cols-1 xs:grid-cols-2 gap-3 border border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Interests</span>
        </div>
      </div>

      <Controller
        name="interest"
        control={control}
        defaultValue={user?.userInterests?.map(e => e?.interestId)}
        render={({ field }) => (
          <MultiSelect
            {...field}
            onChange={(value) => field.onChange(value)}
            value={field.value}
            label="Your interests"
            placeholder="Select up to 3 interests"
            data={listInterest}
            maxValues={3}
            clearable
          />
        )}
      />

      <Controller
        name="interestStatus"
        control={control}
        defaultValue={user?.userInterests[0]?.userStatusId}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Interest status"
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
  )
}

export default Interests
