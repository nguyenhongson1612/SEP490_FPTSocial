import { MultiSelect, NativeSelect, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { getInterest, getRelationships, getStatus } from '~/apis';
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators';


function Step2({ register, errors, control }) {
  const [listStatus, setListStatus] = useState([])
  const [listInterest, setListInterest] = useState([])
  const [listRelationship, setListRelationship] = useState([])
  // const [inputs, setInputs] = useState(user?.webAffiliations.length === 0 ? [''] : user?.webAffiliations)
  // const handleAddInput = () => {
  //   if (inputs.length == 3) return
  //   setInputs([...inputs, ''])
  // }

  useEffect(() => {
    getStatus().then(data => setListStatus(data))
    getInterest()
      .then(data => (data?.map(e => ({ label: e?.interestName, value: e?.interestId }))))
      .then(data => setListInterest(data))
    getRelationships().then(data => setListRelationship(data))
  }, [])

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Other Information </span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold' >
        <div className='grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-y-2'>
          <Controller
            name="interest"
            control={control}
            render={({ field }) => (
              <MultiSelect
                className='col-span-2 sm:col-span-1'
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
            name="relationship"
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <NativeSelect
                className='col-span-2 sm:col-span-1'
                {...field}
                onChange={(value) => field.onChange(value)}
                value={field.value}
                label="Your relationship"
              >
                <option value={''} disabled>Select relationship</option>
                <optgroup>
                  {listRelationship?.map(relationship => (
                    <option key={relationship?.relationShipId} value={relationship?.relationShipId}>{relationship?.relationshipName}</option>
                  ))}
                </optgroup>
              </NativeSelect>
            )}
          />
          <TextInput
            className='col-span-2 sm:col-span-1'
            label="Workplace"
            placeholder="Workplace"
            error={!!errors['workPlace'] && `${errors['workPlace']?.message}`}
            {...register('workPlace', {
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

export default Step2;
