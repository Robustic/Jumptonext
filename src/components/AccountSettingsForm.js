import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const AccountSettingsForm = ({ removeAccount }) => {
    const [askedAlreadyOnce, setAskedAlreadyOnce] = useState(false)

    const user = useSelector(({ user }) => user)

    const dispatch = useDispatch()

    const removeAccountClicked = () => {
        if (askedAlreadyOnce) {
            removeAccount(user.username, dispatch)
        } else {
            setAskedAlreadyOnce(true)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div style={{ padding: 10, width: 200 }}>
                <b
                    style={{
                        fontSize: 20,
                    }}
                >
                    Account settings
                </b>
                <Button
                    id="remove-account"
                    variant={askedAlreadyOnce ? 'danger' : 'warning'}
                    style={{
                        width: '100%',
                        marginTop: 5,
                        marginBottom: 10,
                    }}
                    onClick={() => removeAccountClicked()}
                >
                    {askedAlreadyOnce
                        ? 'Are you sure to remove current account?'
                        : 'Remove account'}
                </Button>
            </div>
        </div>
    )
}

export default AccountSettingsForm
