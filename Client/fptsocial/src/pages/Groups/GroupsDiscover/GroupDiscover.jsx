import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { requestJoinGroup, suggestionGroup } from '~/apis/groupApis';
import { selectCurrentUser } from '~/redux/user/userSlice';

function GroupsDiscover() {
  const currentUser = useSelector(selectCurrentUser)
  const [listSuggestionGroup, setListSuggestionGroup] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    suggestionGroup({ userId: currentUser?.userId }).then(data => setListSuggestionGroup(data?.suggestGroupDTOs))
  }, [])

  const handleRequestJointGroup = (groupId) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': groupId
    }
    requestJoinGroup(submitData).then(() => navigate(`/groups/${groupId}`))
  }
  return (
    <div className='w-full'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>Group suggestions</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listSuggestionGroup?.map(suggestion => (
              <div key={suggestion?.groupId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[300px] rounded-md flex flex-col'>
                <Link to={`/groups/${suggestion?.groupId}`}>
                  <img
                    className='w-full h-[200px] object-cover rounded-t-md'
                    src={''}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <div>
                    <span className='font-bold capitalize'>{suggestion?.groupName}</span>
                    <div>
                      <span className='text-gray-500 text-sm'>{suggestion?.numberOfMember} members</span>
                    </div>
                  </div>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'
                      onClick={() => handleRequestJointGroup(suggestion?.groupId)}
                    >
                      <span className='my-2 font-bold'>Join group</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default GroupsDiscover;
