import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LeftTopBar from './NavTopBarItems/LeftTopBar'
import RightTopBar from './NavTopBarItems/RightTopBar/RightTopBar'
import connectionSignalR from '~/utils/signalRConnection'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { addLatestNotification, selectLatestNotification } from '~/redux/notification/notificationSlice'

function NavTopBar() {
  const [newNotification, setNewNotification] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const connect = async () => {
      if (connectionSignalR.state === 'Disconnected') {
        console.log('🚀 ~ connect ~ connectionSignalR.state:', connectionSignalR.state)
        try {
          await connectionSignalR.start()
          console.log('SignalR connect successfully')
          connectionSignalR.on('ReceiveNotification', message => {
            // console.log('mes', message)
            setNewNotification(JSON.parse(message))
          })
          connectionSignalR.on('listReceiveNotification', message => {
            dispatch(addLatestNotification(JSON.parse(message)))
          })
        } catch (err) {
          console.error(err.toString())
        }
      }

    }
    connect()
    // return () => {
    //   const disConnect = async () => {
    //     try {
    //       // connectionSignalR.off('ReceiveNotification')
    //       await connectionSignalR.stop()
    //       console.log('SignalR disconnect successfully')
    //     } catch (err) {
    //       console.error(err.toString())
    //     }
    //   }
    //   disConnect()
    // }
  }, [])

  useEffect(() => {
    newNotification && toast.success('You have a new notification')
  }, [newNotification])

  return (
    <div className="relative h-[55px] w-full flex items-center bg-white border-b shadow-gray-300 shadow-sm">
      <div
        className="mx-3 flex w-full justify-evenly xs:justify-between items-center">
        <LeftTopBar />
        <RightTopBar />
      </div>
    </div>

  )
}

export default NavTopBar