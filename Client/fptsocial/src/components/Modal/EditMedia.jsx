import { IconChevronLeft, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, closestCorners } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// SortableItem component
function SortableItem({ id, index, handleRemove, media }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`col-span-12 md:col-span-6 lg:col-span-4 !h-[300px] ${media.length <= 2 && '!col-span-12'} relative bg-white rounded-md`}
    >
      <IconX
        onClick={() => handleRemove(index)}
        className='absolute p-1 z-20 right-1 top-1 bg-orangeFpt text-white rounded-full cursor-pointer hover:bg-orange-700'
      />
      {media?.type === 'image' ? (
        <img src={media?.url} className='h-full w-full object-cover' />
      ) : (
        <video src={media?.url} className='h-full w-full object-contain' controls />
      )}
    </div>
  )
}

function EditMedia({ handleRemove, handleEdit, listMedia, setListMedia }) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  )
  const { t } = useTranslation()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='flex flex-col h-full'>
      <div className='h-[10%] flex justify-between items-center border-b p-4'>
        <IconChevronLeft className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={handleEdit} />
        <span className='text-2xl font-bold'>{t('standard.newPost.editPhoto')}</span>
        <span></span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={({ active, over }) => {
          if (active.id !== over.id) {
            setListMedia(arrayMove(listMedia, active.id - 1, over.id - 1))
          }
        }}
      >
        <SortableContext items={listMedia.map((_, i) => ({ id: i + 1 }))} strategy={rectSortingStrategy}>
          <div className='h-[90%] overflow-y-auto no-scrollbar px-4 pb-10 grid grid-cols-12 bg-fbWhite gap-1 py-1'>
            {listMedia.map((media, i) => (
              <SortableItem key={i} id={i + 1} index={i} handleRemove={handleRemove} media={media} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </motion.div>
  )
}

export default EditMedia
