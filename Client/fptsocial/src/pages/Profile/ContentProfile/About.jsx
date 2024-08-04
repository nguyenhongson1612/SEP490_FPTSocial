import { Chip } from '@mui/material';
import { IconAffiliate, IconBriefcase2, IconCake, IconGenderMale, IconHeartFilled, IconHomeFilled, IconLink, IconMail, IconManFilled, IconPhone, IconRollerSkating, IconUser, IconUserCircle } from '@tabler/icons-react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function About({ user }) {
  const { t } = useTranslation()
  const [option, setOption] = useState(1)

  return <div id=''
    className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3'>
    <div
      id='info'
      className='w-full md:w-[70%] bg-white rounded-md shadow-lg'>
      <div className='flex w-full min-h-[300px]'>
        <div className='basis-4/12 border-r-2 flex flex-col gap-1 p-4 text-gray-500'>
          <span className='text-xl font-bold'>{t('standard.profile.about')}</span>
          <span className={`hover:bg-blue-100 hover:text-blue-500 py-1 px-2 rounded-md cursor-pointer ${option == 1 && 'bg-blue-50 text-blue-500'}`} onClick={() => setOption(1)}>General</span>
          <span className={`hover:bg-blue-100 hover:text-blue-500 py-1 px-2 rounded-md cursor-pointer ${option == 2 && 'bg-blue-50 text-blue-500'}`} onClick={() => setOption(2)}>Contact</span>
          <span className={`hover:bg-blue-100 hover:text-blue-500 py-1 px-2 rounded-md cursor-pointer ${option == 3 && 'bg-blue-50 text-blue-500'}`} onClick={() => setOption(3)}>Web Affiliations</span>
        </div>
        <div className='basis-8/12 p-4 flex flex-col gap-4'>
          {
            option == 1 &&
            <>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1'>
                  <IconUser stroke={2} color='#c8d3e1' />
                  <span className='font-semibold'>{user?.firstName + ' ' + user?.lastName || 'No information'}</span>
                </div>
                <div className='first-letter:uppercase text-sm ml-7'>{user?.aboutMe}</div>
              </div>
              <div className='flex gap-1'><IconHomeFilled stroke={2} color='#c8d3e1' /><span>Lives in&nbsp;</span><span className='font-semibold'>{user?.homeTown || 'No information'}</span></div>
              <div className='flex gap-1'><IconGenderMale stroke={2} color='#c8d3e1' />Gender&nbsp;&nbsp;<span className='font-semibold'>{user?.userGender?.genderName || 'No information'}</span></div>
              <div className='flex gap-1'><IconHeartFilled stroke={2} color='#c8d3e1' /> Relationship&nbsp;&nbsp;<span className='font-semibold'>{user?.userRelationship?.relationshipName || 'No information'}</span></div>
              <div className='flex gap-1'><IconCake stroke={2} color='#c8d3e1' /> Birthday&nbsp;&nbsp;<span className='font-semibold'>{new Date(user?.birthDay).toLocaleDateString() || 'No information'}</span></div>
              <div className='flex gap-1'>
                <IconRollerSkating stroke={2} color='#c8d3e1' />
                {
                  user?.userInterests?.map(e => (
                    <Chip key={e?.userInterestId} label={e?.interesName} color="warning" size='small' />
                  ))
                }
              </div>
            </>
          }
          {
            option == 2 &&
            <>
              <div className='flex gap-1'><IconMail stroke={2} color='#c8d3e1' /><span>Mail&nbsp;</span><span className='font-semibold'>{user?.contactInfo?.secondEmail || 'No information'}</span></div>
              <div className='flex gap-1'><IconPhone stroke={2} color='#c8d3e1' />Phone&nbsp;&nbsp;<span className='font-semibold'>{user?.contactInfo?.primaryNumber || 'No information'}</span></div>
              <div className='flex gap-1'><IconBriefcase2 stroke={2} color='#c8d3e1' />Workplace&nbsp;&nbsp;<span className='font-semibold'>{user?.workPlaces[0]?.workPlaceName || 'No information'}</span></div>
            </>
          }
          {
            option == 3 &&
            <>
              <div className='flex gap-2'>
                <IconAffiliate stroke={2} color='#c8d3e1' />Websites and social links
              </div>
              {
                user?.webAffiliations?.map(e =>
                  <div key={e?.webAffiliationId} className='flex gap-1'>
                    <IconLink /><a href={e?.webAffiliationUrl || ''} className='font-semibold text-xs'>{e?.webAffiliationUrl || 'No information'}</a></div>
                )
              }
            </>
          }


        </div>
      </div>
    </div>
  </div >
}

export default About;
