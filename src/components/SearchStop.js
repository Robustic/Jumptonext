import React from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { useDispatch, useSelector } from 'react-redux'
import { stopSearchStringChanged } from '../reducers/stopReducer'

const SearchStop = () => {
    const dispatch = useDispatch()
    const stopSearchString = useSelector(({ stops }) => stops.stopSearchString)

    const handleFindStopChange = (event) => {
        if (event.target.value) {
            dispatch(stopSearchStringChanged(event.target.value))
        } else if (event.target.value === '') {
            dispatch(stopSearchStringChanged())
        }
    }

    return (
        <Form style={{ paddingTop: 10 }}>
            <Form.Group>
                <InputGroup
                    value={stopSearchString}
                    onChange={handleFindStopChange}
                >
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Example: 'Vallilan varikko', '3024', 'E4114'..."
                    />
                </InputGroup>
            </Form.Group>
        </Form>
    )
}

export default SearchStop
