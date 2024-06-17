import { useEffect, useState } from 'react';
import { getAllPost } from '~/apis';
import NavTopBar from '~/components/NavTopBar/NavTopBar';
import TopProfile from './TopProfile/TopProfile';
import ContentProfile from './ContentProfile/ContentProfile';
import UpdateProfile from './UpdateProfile/UpdateProfile';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';
import { useDisclosure } from '@mantine/hooks';
import { Modal, ScrollArea } from '@mantine/core';

function Profile() {
  const [listPost, setListPost] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    // Call API
    getAllPost().then((data) => {
      setListPost(data)
    })
  }, [])

  return (
    <>
      <div className="relative">
        <NavTopBar />
        <div className="">
          <TopProfile open={open} user={user} />
          <ContentProfile listPost={listPost} user={user} />
          <Modal
            classNames={{
              inner: 'xs:!p-0 !flex xs:! xs:!items-center',
              content: '!m-0'
            }}
            opened={opened}
            size={'auto'}
            onClose={close}
            withCloseButton={false}
            padding={0}
            scrollAreaComponent={ScrollArea.Autosize}
          >
            <UpdateProfile open={open} onClose={close} />
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Profile;