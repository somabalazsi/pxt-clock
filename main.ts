enum Time {
    Hour,
    Minute,
    Second
}
enum TimeFormat {
    hhmm,
    hhmmss
}
/**
 * Clock functions
 */
//% weight=100 color=#00b370 icon="\uf017" block="Clock"
namespace clock {
    let toffset = 0
    let tcounter = Math.floor(input.runningTime() / 1000)
    let corrector = 3.25
    let ampm = false
    /**
     * Returns the Hours, Minutes, or Seconds of the time
     * needs 1 enum Time parameter
     */
    //% block
    export function getTime(t: Time): number {
        while (Math.floor(input.runningTime() / 1000) - tcounter >= 900) {
            tcounter += 900
            toffset += corrector
        }
        let time = Math.floor(input.runningTime() / 1000) + toffset
        while (time >= 24 * 3600) {
            toffset -= 24 * 3600
            time -= 24 * 3600
        }
        switch (t) {
            case Time.Hour:
                if (ampm) {
                    if (Math.floor(time / 3600) > 12) {
                        return Math.floor(time / 3600) - 12
                    } else if (Math.floor(time / 3600) == 0) {
                        return 12
                    } else {
                        return Math.floor(time / 3600)
                    }
                } else {
                    return Math.floor(time / 3600)
                }
                break
            case Time.Minute:
                return Math.floor((time - Math.floor(time / 3600) * 3600) / 60)
                break
            case Time.Second:
                return (Math.floor(time - Math.floor(time / 3600) * 3600
                    - Math.floor((time - Math.floor(time / 3600) * 3600) / 60) * 60))
                break
        }
    }
    /**
     * Returns the time as a string in the format "00:00"
     */
    //% block
    export function timeString(f: TimeFormat): string {
        let str = ""
        let H = getTime(Time.Hour)
        let M = getTime(Time.Minute)
        if (f == TimeFormat.hhmmss) {
            let S = getTime(Time.Second)
            if (S < 10) {
                str = ":0" + S
            } else {
                str = ":" + S
            }
        }
        if (M < 10) {
            str = ":0" + M + str
        } else {
            str = ":" + M + str
        }
        if (ampm && H > 12) {
            H -= 12
        } else if (ampm && H == 0) {
            H = 12
        }
        if (H < 10) {
            str = "0" + H + str
        } else {
            str = "" + H + str
        }
        return str
    }
    /**
     * Sets the time to a specific value 
     * takes 2 or 3 arguments, returns false if invalid time is trying to be set
     */
    //% block
    export function setTime(h: number, m: number, s: number = 0): boolean {
        if (!(h >= 0 && h < 24 && m >= 0 && m < 60 && s >= 0 && s < 60))
            return false
        //subtract 1 day from CPU clock, then add the actual time back
        toffset = - Math.floor(input.runningTime() / 1000) + (h * 3600 + m * 60 + s)
        return true
    }
    /**
     * Enables or disables the 12 hour clock
     */
    //% block
    export function enableAmPm(value: boolean): void {
        ampm = value
    }
    /**
     * Returns true if the 12 hour clock is enabled,
     * otherwise false
     */
    //% block
    export function getAmPm(): boolean {
        return ampm
    }
    /**
     * Sets the time correction value.
     * If the clock is too slow, set it to a higher value than 3.25
     * If the clock is too fast, set it to a lower value than 3.25
     */
    //% block
    export function setTimeCorrector(v: number): void {
        corrector = v
    }
}
/**
 * Countdown
 */
//% weight=100 color=#00b3b3 icon="\uf252" block="Countdown"
//% advanced=true
namespace countdown {
    let cdstate = false
    let end: number
    /**
     * Starts the countdown of X seconds
     */
    //% block
    export function start(secs: number): void {
        end = input.runningTime() + secs * 1000
        cdstate = true
    }
    /**
     * Stops and resets the countdown
     */
    //% block
    export function stop(): void {
        cdstate = false
    }
    /**
     * Returns true if cd is initiated, otherwise false
     */
    //% block
    export function state(): boolean {
        return cdstate
    }
    /**
     * Returns the remaining time in Secs
     * e.g. 01:12 -> 72 Secs
     */
    //% block
    export function remainingTime(): number {
        if (cdstate && Math.floor((end - input.runningTime()) / 1000) > 0) {
            return Math.floor((end - input.runningTime()) / 1000)
        } else return 0
    }
    /**
     * Only returns the Mins of the remaining time
     * e.g. 01:12 -> 1 Min
     */
    //% block
    export function remainingMinute(): number {
        if (cdstate && remainingTime() > 0) {
            return Math.floor(Math.floor((end - input.runningTime()) / 1000) / 60)
        } else return 0
    }
    /**
     * Only returns the Secs of the remaining time
     * e.g. 01:12 -> 12 Secs
     */
    //% block
    export function remainingSecond(): number {
        if (cdstate && remainingTime() > 0) {
            return Math.floor((end - input.runningTime()) / 1000) - remainingMinute() * 60
        } else return 0
    }
}