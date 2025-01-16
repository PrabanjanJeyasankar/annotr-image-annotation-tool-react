import PropTypes from 'prop-types'
import { useRef } from 'react'
import ImagePlusSvg from '../../svg/ImagePlusSvg/ImagePlusSvg'
import styles from './ImageUploaderComponent.module.css'

const ImageUploaderComponent = ({ onImageUpload }) => {
    const fileInputRef = useRef(null)

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                onImageUpload(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    return (
        <div className={styles.upload_button_container}>
            <button onClick={triggerFileInput} className={styles.upload_button}>
                <ImagePlusSvg />
                Upload Image
            </button>
            <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
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
