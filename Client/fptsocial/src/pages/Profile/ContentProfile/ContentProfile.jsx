import ProfilePosts from './ProfilePosts'
import About from './About'
import { Box, Tab, Tabs } from '@mui/material'
import { IconArticle, IconFriends, IconPhoto, IconUserCircle } from '@tabler/icons-react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useState } from 'react'
import FriendProfile from './FriendProfile'


function ContentProfile({ listPost, user }) {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div
      id='content-profile'
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'
    >
      <Box sx={{
        width: '100%',
        typography: 'body1',
        '.MuiTabs-flexContainer': { backgroundColor: 'white', display: 'flex', justifyContent: 'center' },
        '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center' }
      }}>
        <TabContext value={value}>
          <div>
            <TabList onChange={handleChange} >
              <Tab icon={<IconArticle stroke={2} />} iconPosition="start" label="Posts" value="1" />
              <Tab icon={<IconUserCircle stroke={2} />} iconPosition="start" label="About" value="2" />
              <Tab icon={<IconFriends stroke={2} />} iconPosition="start" label="Friends" value="3" />
              <Tab icon={<IconPhoto stroke={2} />} iconPosition="start" label="Photos" value="4" />
            </TabList>
          </div>
          <TabPanel value="1">
            <ProfilePosts listPost={listPost} user={user} />
          </TabPanel>
          <TabPanel value="2">
            <About user={user} />
          </TabPanel>
          <TabPanel value="3"><FriendProfile user={user} /></TabPanel>
          <TabPanel value="4">Item Three</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default ContentProfile