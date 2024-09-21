'use client'

import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone'

export default function LocalDate({ timestamp }: { timestamp: string }) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    const userTimezone = moment.tz.guess()
    const dateTime = moment.tz(timestamp, userTimezone)
    const currentDate = moment.tz(userTimezone)

    let formatted: string

    if (dateTime.isSame(currentDate, 'day')) {
      formatted = dateTime.format('[Today at] hh:mm A')
    } else if (dateTime.isSame(currentDate.subtract(1, 'day'), 'day')) {
      formatted = dateTime.format('[Yesterday at] hh:mm A')
    } else if (dateTime.isSame(currentDate, 'week')) {
      formatted = dateTime.format('dddd [at] hh:mm A')
    } else if (dateTime.isSame(currentDate, 'year')) {
      formatted = dateTime.format('D MMM [at] hh:mm A')
    } else {
      formatted = dateTime.format('D MMM YYYY [at] hh:mm A')
    }

    setFormattedDate(formatted)
  }, [timestamp])

  return <span>{formattedDate || 'Loading...'}</span>
}
