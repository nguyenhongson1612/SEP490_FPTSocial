import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators';


function Step2({ register, errors }) {

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Other Information </span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold' >

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-3 my-4 gap-y-5 sm:gap-y-12'>

          <div className="relative ">
            <input id='homeTown'
              type="text"
              className={`${errors.homeTown && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('homeTown', {
                pattern: {
                  value: WHITESPACE_RULE,
                }
              })}
            />
            {errors.homeTown && <span className='text-red-500 text-xs'>{WHITESPACE_MESSAGE}</span>}
            <label htmlFor="homeTown" className={`${errors.homeTown && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              Hometown
            </label>
          </div>

          <div className="relative ">
            <input id='aboutMe'
              type="text"
              className={`${errors.aboutMe && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-3 font-medium border-b border-gray-300 rounded-md 
                          hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
              placeholder=""
              {...register('aboutMe', {
                pattern: {
                  value: WHITESPACE_RULE,
                }
              })}
            />
            {errors.aboutMe && <span className='text-red-500 text-xs'>{WHITESPACE_MESSAGE}</span>}
            <label htmlFor="aboutMe" className={`${errors.aboutMe && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
            >
              About me
            </label>
          </div>



        </div>
      </div >
    </div >
  )
}

export default Step2;
