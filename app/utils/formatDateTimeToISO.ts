import { DateTime } from "luxon"

function formatDateTimeToISO(date: DateTime): string {
  const formattedTime = date.toFormat("yyyy-MM-dd HH:mm:ss.SSSZZ")
  const paddedTime = formattedTime.replace(
    /(-\d{2}:\d{2})/,
    (_, offset) => `000${offset}`,
  )
  return paddedTime
}

export default formatDateTimeToISO
