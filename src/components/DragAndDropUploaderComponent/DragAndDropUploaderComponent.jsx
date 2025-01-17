import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import styles from './DragAndDropUploaderComponent.module.css'
import { toast } from '@/hooks/useToast'

const DragAndDropUploaderComponent = ({ onFileUpload, children }) => {
    const fileInputRef = useRef(null)
    const [isDraggingOver, setIsDraggingOver] = useState(false)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDraggingOver(true)
    }

    const handleDragLeave = () => {
        setIsDraggingOver(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDraggingOver(false)

        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onFileUpload(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            toast({
                title: 'Invalid file',
                description: 'Please drop a valid image file.',
            })
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onFileUpload(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            alert('Please upload a valid image file.')
        }
    }

    const handleContainerClick = () => {
        fileInputRef.current.click()
    }

    return (
        <div
            className={`${styles.drag_drop_container} ${
                isDraggingOver ? styles.dragging : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleContainerClick}>
            {children}
            <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                ref={fileInputRef}
                className={styles.file_input}
            />
        </div>
    )
}

DragAndDropUploaderComponent.propTypes = {
    onFileUpload: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
}

export default DragAndDropUploaderComponent
