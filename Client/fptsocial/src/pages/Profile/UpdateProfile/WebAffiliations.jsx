import { NativeSelect, TextInput } from '@mantine/core'
import { Controller } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa6'
import { URL_RULE, URl_MESSAGE } from '~/utils/validators'

function WebAffiliations({ register, user, errors, control, listStatus, inputs, handleAddInput }) {
  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Web Affiliations</span>
        </div>
      </div>
      <div className='flex flex-col gap-5'>
        {inputs.map((input, index) => (
          <TextInput
            key={index}
            label={index === 0 ? 'Websites and social links' : null}
            defaultValue={input?.webAffiliationUrl}
            placeholder="Enter URL"
            error={!!errors[`webAffiliations_${index}`] && `${errors[`webAffiliations_${index}`]?.message}`}
            {...register(`webAffiliations_${index}`, {
              pattern: {
                value: URL_RULE,
                message: URl_MESSAGE
              }
            })}
          />
        ))}
        {inputs.length < 3 && (
          <div className='flex items-center text-white text-sm font-semibold'>
            <span className='flex justify-center items-center gap-2 bg-blue-500 rounded-md p-2 cursor-pointer' onClick={handleAddInput}>
              <FaPlus className='' />Add an URL
            </span>
          </div>
        )}
      </div>

      <Controller
        name="webAffiliationsStatus"
        control={control}
        defaultValue={user?.webAffiliations[0]?.userStatusId}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Web affiliations status"
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

export default WebAffiliations
