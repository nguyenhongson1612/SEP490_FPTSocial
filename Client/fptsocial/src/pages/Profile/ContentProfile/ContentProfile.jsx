import { IconArticle, IconFriends, IconPhoto, IconUserCircle } from '@tabler/icons-react'
import { Tabs } from '@mantine/core'
import ProfilePosts from './ProfilePosts'
import About from './About'
import { createStyles } from '@mantine/styles'

const useStyles = createStyles(() => ({
  root: {
    width: '100% '
  },
  list: {
    backgroundColor: 'white ',
    display: 'flex !important',
    justifyContent: 'center !important'
  },
  tab: {
    borderBottom: '1px solid transparent ',
    color: '#6B7280 !important',
    '&:hover': {
      color: '#F27125 !important'
    },

    '&[data-active="true"]': {
      borderBottom: '3px solid #F27125',
      color: '#F27125 !important'
    }
  }
}))

function ContentProfile({ listPost, user }) {
  const { classes } = useStyles()
  return (
    <div
      id='content-profile'
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'
    >
      <Tabs
        defaultValue="posts"
        classNames={{
          root: classes.root,
          list: classes.list,
          tab: classes.tab,
        }}
      >

        <Tabs.List >
          <Tabs.Tab value="posts" leftSection={<IconArticle stroke={2} />}>
            Posts
          </Tabs.Tab>
          <Tabs.Tab value="about" leftSection={<IconUserCircle stroke={2} />}>
            About
          </Tabs.Tab>
          <Tabs.Tab value="friends" leftSection={<IconFriends stroke={2} />}>
            Friends
          </Tabs.Tab>
          <Tabs.Tab value="photos" leftSection={<IconPhoto stroke={2} />}>
            Photos
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts">
          <ProfilePosts listPost={listPost} user={user} />
        </Tabs.Panel>

        <Tabs.Panel value="about">
          <About user={user} />
        </Tabs.Panel>

        <Tabs.Panel value="friends">
          friends
        </Tabs.Panel>
        <Tabs.Panel value="photos">
          photos
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default ContentProfile