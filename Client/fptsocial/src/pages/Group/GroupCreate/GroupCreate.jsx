import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
// import { BiChevronDown } from 'react-icons/bi';
// import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_RULE } from '~/utils/validators';

function GroupCreate() {
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false)
  const myDiv = useRef()
  const { register, setValue, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    const handleClick = (e) => {
      if (open && !myDiv.current.contains(e.target)) setOpen((preOpen) => !preOpen)
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [open])

  const submitLogIn = (data) => {
    console.log(data)
    toast.success('Group Created Successfully')
  }

  return (
    <>
      <div className="h-full w-[380px] flex justify-center overflow-y-auto scrollbar-none-track border-r-2 ">
        <div className=" w-[90%] flex flex-col my-8">
          <div className="flex flex-col items-start gap-4">
            <div className='flex text-sm text-gray-500 font-medium'>
              <Link to={'/groups'} className='hover:underline hover:decoration-blue-500'>Group&nbsp;</Link>
              <span>&gt; Create group</span>
            </div>
            <span className='font-bold text-xl'>Create New Group</span>
            <div className="flex justify-start items-center mb-2 text-gray-500 gap-3" href='#'>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuatIJXhoIyk41rXuz9n3cHerAI8OdrNUjzBvvYALViA&s"
                alt="group-img"
                className="rounded-[50%] aspect-square object-cover w-8"
              />
              <div className='flex flex-col '>
                <span className='font-semibold text-gray-900'>Hoan Le</span>
                <span>Group Admin</span>
              </div>
            </div>
          </div>

          <form className='h-full' onSubmit={handleSubmit(submitLogIn)}>
            <div className="h-full flex flex-col items-center gap-5 m-1">
              <div className="relative w-full">
                <input id='groupName'
                  type="text"
                  className={`${errors.groupName && ' !border-red-500 focus:outline-offset-4 focus:outline-red-500'} bg-white peer w-full px-4 pb-3 pt-6 font-medium border border-gray-300 rounded-md placeholder:text-transparent
                   hover:border-gray-900 focus:outline-offset-4 focus:outline-blue-500`}
                  placeholder="mail"
                  // error={!!errors['password']}
                  {...register('groupName', {
                    required: true,
                    pattern: {
                      value: WHITESPACE_RULE,
                    }
                  })}
                />
                {errors.groupName && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
                <label htmlFor="groupName" className={`${errors.groupName && '!text-red-500'} absolute left-0 top-0 ml-3 text-gray-500  duration-100 ease-linear peer-placeholder-shown:translate-y-4
                peer-[:not(:placeholder-shown)]:text-xs  peer-placeholder-shown:text-gray-500 peer-focus:ml-3 peer-focus:translate-y-0 px-1 peer-focus:text-xs peer-focus:text-blue-500 `}
                >
                  Group Name
                </label>
              </div>

              <div
                ref={myDiv}
                className="relative cursor-pointer ">
                <label className={`absolute left-0 ml-4 translate-y-4 duration-100 ease-linear ${errors.groupPrivacy && !selected && 'text-red-500'}
              ${open ? '-translate-y-0 text-xs text-blue-500 ml-4' : selected ? '-translate-y-0 text-xs ml-4 !text-blue-500' : ' text-gray-500'}`}>
                  Select Privacy
                </label>

                <div
                  onClick={() => setOpen(!open)}
                  className={`w-full px-4 pb-3 pt-6 border border-gray-300 rounded-md placeholder:text-transparent
                   hover:border-gray-900 ${open && 'outline outline-2  outline-offset-2 outline-blue-500'}
                   ${selected && '!outline-blue-500 !border-blue-500'}
                   ${errors.groupPrivacy && 'outline-red-500 border-red-500'} ${!selected && 'text-gray-700'}`}
                  {...register('groupPrivacy', {
                    required: true
                  })}
                >
                  <span className={`${!selected && 'invisible'} font-medium`}>{selected ? selected : 'Select Privacy'}</span>
                </div>
                {errors.groupPrivacy && !selected && <span className='text-red-500 text-xs'>{FIELD_REQUIRED_MESSAGE}</span>}
                <ul className={`bg-white mt-2 overflow-y-auto ${open ? 'h-fit' : 'h-0'} ${open ? 'shadow-4edges' : ''} rounded-md`}>
                  <li
                    className='group p-2 mx-3 mt-3 text-sm rounded-md hover:bg-blue-500 hover:text-white'
                    onClick={() => {
                      setSelected('Public')
                      setValue('groupPrivacy', 'Public')
                      setOpen(false)
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z" clipRule="evenodd" />
                      </svg>
                      <div className='flex flex-col'>
                        <span className='text-lg font-medium text-gray-900 group-hover:text-white'>Public</span>
                        <p>Anyone can see people and what they post</p><br />
                      </div>
                    </div>

                  </li>

                  <li
                    className='group p-2 mx-3 mb-3 text-sm rounded-md hover:bg-blue-500 hover:text-white'
                    onClick={() => {
                      setSelected('Private')
                      setValue('groupPrivacy', 'Public')
                      setOpen(false)
                    }}
                  >
                    <div className='flex items-center gap-3'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                      </svg>
                      <div className='flex flex-col'>
                        <span className='text-lg font-medium text-gray-900 group-hover:text-white'>Private</span>
                        <p>Only members can see people and what they post</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="w-full mt-auto">
                <button id="button" type="submit"
                  className=" w-full p-4 font-medium bg-[#0866FF] text-white rounded-md hover:bg-opacity-85"
                >
                  Create
                </button>
              </div>

            </div>
          </form>

        </div>


      </div>
    </>
  )
}

export default GroupCreate
