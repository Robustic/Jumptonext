import Image from 'react-bootstrap/Image'
import loadingPicture from '../pictures/logo192.png'

const Loading = ({ waitingText }) => {
    return (
        <div className="bg-silver">
            <div className="flex-container center">
                <p className="start-view-text">{waitingText}</p>
            </div>
            <div>
                <Image
                    className="start-view-image"
                    src={loadingPicture}
                    roundedCircle
                />
            </div>
        </div>
    )
}

export default Loading
