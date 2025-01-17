import PropTypes from 'prop-types'
import ImagePlusSvg from '../../svg/ImagePlusSvg/ImagePlusSvg'
import QuoteSvg from '../../svg/QuoteSvg/QuoteSvg'
import DragAndDropUploaderComponent from '../DragAndDropUploaderComponent/DragAndDropUploaderComponent'
import styles from './ImageUploaderComponent.module.css'

const ImageUploaderComponent = ({ onImageUpload }) => {
    return (
        <DragAndDropUploaderComponent onFileUpload={onImageUpload}>
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
        </DragAndDropUploaderComponent>
    )
}

ImageUploaderComponent.propTypes = {
    onImageUpload: PropTypes.func.isRequired,
}

export default ImageUploaderComponent
