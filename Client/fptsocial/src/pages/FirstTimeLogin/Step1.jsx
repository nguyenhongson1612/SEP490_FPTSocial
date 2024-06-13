import { useEffect, useState } from 'react';
import { getGender } from '~/apis';
import { FIELD_REQUIRED_MESSAGE, PHONE_NUMBER_MESSAGE, PHONE_NUMBER_RULE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators';

function Step1({ register, errors }) {
  const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  const [listGender, setListGender] = useState([])

  useEffect(() => {
    getGender().then(responseData => {
      setListGender(responseData?.data)
    })
  }, [])

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Main Information<span className='text-red-500'>(*)</span></span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold' >
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-3 my-4 gap-y-5 sm:gap-y-12'>
          <div className="relative ">
            <input id='email'
              type="text"
              disabled
              className={`${''} bg-fbWhite peer w-full px-4 pb-3 pt-3 font-medium rounded-md hover:bg-fbWhite-500`}
              {...register('email', {
                require: true
              })}
            />
            <label htmlFor="email" className={`${''} absolute left-0 top-0 ml-3 text-gray-500 text-xs `}
            >
              Email
            </label>
          </div>

          <div className="relative ">
            <select id='genderId'
              type="text"
              className={`${errors.genderId && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('genderId', {
                required: true
              })}
            >
              <option value={''}>Select gender</option>
              {listGender?.map(gender => (
                <option value={gender?.genderId} key={gender?.genderId}>{gender?.genderName}</option>
              ))}
            </select>
            <label htmlFor="genderId" className={`${errors.genderId && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              Gender
            </label>
          </div>

          <div className="relative ">
            <input id='firstName'
              type="text"
              className={`${errors.firstName && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('firstName', {
                required: true,
                pattern: {
                  value: WHITESPACE_RULE,
                }
              })}
            />
            {errors.firstName && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
            <label htmlFor="firstName" className={`${errors.firstName && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              First name
            </label>
          </div>

          <div className="relative ">
            <input id='lastName'
              type="text"
              className={`${errors.lastName && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('lastName', {
                required: true,
                pattern: {
                  value: WHITESPACE_RULE,
                }
              })}
            />
            {errors.lastName && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
            <label htmlFor="lastName" className={`${errors.lastName && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              Last name
            </label>
          </div>

          <div className="relative ">
            <input id='primaryNumber'
              type="text"
              className={`${errors.primaryNumber && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('primaryNumber', {
                pattern: {
                  value: PHONE_NUMBER_RULE
                }
              })}
            />
            {errors.primaryNumber && <span className='text-red-500 text-xs'>{PHONE_NUMBER_MESSAGE}</span>}
            <label htmlFor="primaryNumber" className={`${errors.primaryNumber && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              Phone number
            </label>
          </div>

          <div className="relative ">
            <input id='birthDay'
              type="date"
              max={yesterday}
              className={`${errors.birthDay && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('birthDay', {
                required: true
              })}
            />
            {errors.birthDay && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
            <label htmlFor="lastName" className={`${errors.birthDay && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              BirthDay
            </label>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Step1
