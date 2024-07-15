import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { IconChevronLeft } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { POST_TYPES } from '~/utils/constants'

function StatusSelect({ listStatus, selectedStatus, handleSelectStatus, handleSelectAudience, type }) {
  console.log('🚀 ~ StatusSelect ~ selectedStatus:', selectedStatus)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex flex-col'>
        <div className='h-[60px]  flex justify-between items-center px-5 border-b '>
          <IconChevronLeft className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={handleSelectAudience} />
          <span className='text-2xl font-bold'>Post Audience</span>
          <span></span>
        </div>

        <div className='px-4 pb-10 ' >
          <div>
            <div className='font-bold '>Who can see your post?</div>
            <div className='text-sm'>
              Your post will show up in Feed, on your profile and in search results.<br /><br />
              Your default audience is set to Public, but you can change the audience of this specific post.
            </div>
          </div>
          <div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={JSON.stringify(selectedStatus) || ''}
                onChange={handleSelectStatus}
                name="radio-buttons-group"
              >
                {listStatus?.map((status) => {
                  if (type === POST_TYPES.MAIN_POST)
                    return <FormControlLabel key={status?.userStatusId} value={JSON.stringify(status)} control={<Radio />} label={status?.statusName} />
                  else if (type === POST_TYPES.MAIN_GROUP_POST)
                    return <FormControlLabel key={status?.groupStatusId} value={JSON.stringify(status)} control={<Radio />} label={status?.groupStatusName} />
                })}
              </RadioGroup>
            </FormControl>
          </div>
        </div >
      </div >
    </motion.div>
  )
}

export default StatusSelect
