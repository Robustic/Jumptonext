import { useSelector } from 'react-redux'
import Alert from 'react-bootstrap/Alert'

const Notification = () => {
    const notification = useSelector((state) => state.notification)

    if (!notification) {
        return <div></div>
    }

    const { message, variant } = notification

    return (
        <Alert key={message} variant={variant}>
            {message}
        </Alert>
    )
}

export default Notification
