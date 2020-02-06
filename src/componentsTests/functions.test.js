import { timestamp, timeleft, getTransportColor, getTransportType, getTransportButtonStyle } from '../components/functions'

describe('timestamp()', () => {
    test('returns correct stamp', () => {
        // console.log('Normal:   ', new Date().getTime())
        const timeHEL = 1579790109347 // 2020-01-23T14:35:09+00:00
        const timeUTC = timeHEL - 2 * 3600000
        const mockDate = new Date(timeUTC)
        const spy = jest
            .spyOn(global, 'Date')
            .mockImplementation(() => mockDate)

        expect(timestamp()).toEqual(52509)

        spy.mockRestore()
        // console.log('Restored: ', new Date().getTime())
    })
})

describe('timeleft()', () => {
    test('timeleft(3789) returns right string', () => {
        const hours = 1
        const minutes = 3
        const seconds = 9
        const timestamp = 3600 * hours + 60 * minutes + seconds
        expect(timeleft(timestamp)).toEqual("1h 3m 9s")
    })

    test('timeleft(189) returns right string (no hours)', () => {
        const minutes = 3
        const seconds = 9
        const timestamp = 60 * minutes + seconds
        expect(timeleft(timestamp)).toEqual("3m 9s")
    })

    test('timeleft(189) returns right string (no hours or minutes)', () => {
        const seconds = 9
        const timestamp = seconds
        expect(timeleft(timestamp)).toEqual("9s")
    })
})

describe('getTransportColor()', () => {
    test('getTransportColor(3) returns bus color', () => {
        expect(getTransportColor(3)).toEqual('#007AC9')
    })
    test('getTransportColor(109) returns train color', () => {
        expect(getTransportColor(109)).toEqual('#8C54A2')
    })
    test('getTransportColor(0) returns tram color', () => {
        expect(getTransportColor(0)).toEqual('#00985F')
    })
    test('getTransportColor(1) returns subway color', () => {
        expect(getTransportColor(1)).toEqual('#FF6319')
    })
    test('getTransportColor(4) returns ferry color', () => {
        expect(getTransportColor(4)).toEqual('#00B9E4')
    })
    test('getTransportColor(999) returns ferry color', () => {
        expect(getTransportColor(999)).toEqual('#00B9E4')
    })
})

describe('getTransportType()', () => {
    test('getTransportType(3) returns bus text', () => {
        expect(getTransportType(3)).toEqual("(Bus stop)")
    })
    test('getTransportType(109) returns train text', () => {
        expect(getTransportType(109)).toEqual("(Train station)")
    })
    test('getTransportType(0) returns tram text', () => {
        expect(getTransportType(0)).toEqual("(Tram stop)")
    })
    test('getTransportType(1) returns subway text', () => {
        expect(getTransportType(1)).toEqual("(Subway station)")
    })
    test('getTransportType(4) returns ferry text', () => {
        expect(getTransportType(4)).toEqual("(Ferry stop)")
    })
    test('getTransportType(999) returns ferry text', () => {
        expect(getTransportType(999)).toEqual("(Ferry stop)")
    })
})

describe('getTransportButtonStyle()', () => {
    test('getTransportButtonStyle(3) returns bus text', () => {
        expect(getTransportButtonStyle(3)).toEqual("btn-bus")
    })
    test('getTransportButtonStyle(109) returns train text', () => {
        expect(getTransportButtonStyle(109)).toEqual("btn-train")
    })
    test('getTransportButtonStyle(0) returns tram text', () => {
        expect(getTransportButtonStyle(0)).toEqual("btn-tram")
    })
    test('getTransportButtonStyle(1) returns subway text', () => {
        expect(getTransportButtonStyle(1)).toEqual("btn-sub")
    })
    test('getTransportButtonStyle(4) returns ferry text', () => {
        expect(getTransportButtonStyle(4)).toEqual("btn-ferry")
    })
    test('getTransportButtonStyle(999) returns ferry text', () => {
        expect(getTransportButtonStyle(999)).toEqual("btn-ferry")
    })
})
