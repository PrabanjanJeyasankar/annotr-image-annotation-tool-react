import { toast } from '../../hooks/use-toast'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import ImagePlusSvg from '../../svg/ImagePlusSvg/ImagePlusSvg'
import QuoteSvg from '../../svg/QuoteSvg/QuoteSvg'
import styles from './ImageUploaderComponent.module.css'

const ImageUploaderComponent = ({ onImageUpload }) => {
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
                onImageUpload(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            toast({
                title: 'Invalid file',
                description: "Please drop a valid image file.",
            })
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onImageUpload(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            toast({
                title: 'Invalid file',
                description: "Please drop a valid image file.",
            })
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
            <QuoteSvg width={100} height={100} />
            <p className={styles.app_name_placeholder}>Annotr</p>
            <p className={styles.drag_drop_text}>
                Drag & Drop your image here or click to upload
            </p>
            <div className={styles.image_uploader_container}>
                <button className={styles.upload_trigger_button}>
                    <ImagePlusSvg /> Upload image
                </button>
            </div>
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

ImageUploaderComponent.propTypes = {
    onImageUpload: PropTypes.func.isRequired,
}

export default ImageUploaderComponent
