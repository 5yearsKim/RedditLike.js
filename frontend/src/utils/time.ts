import { format as dfFormat, formatDistance, getHours, getMinutes } from "date-fns";

export function toDateTime(ts: Date | string | null | undefined): Date | null {
  if (!ts) {
    return null;
  }
  if (ts instanceof Date) {
    return ts;
  }
  return new Date(ts);
}

export function vizDate(
  ts: Date | string | null | undefined,
  opt: {type: "short"|"literal", locale: string},
): string {
  ts = toDateTime(ts);
  if (!ts) {
    return "(unknown)";
  }
  const { locale, type } = opt;
  if (locale == "ko") {
    if (type == "short") {
      return dfFormat(ts, "yyyy-MM-dd");
    } else if (type == "literal") {
      return dfFormat(ts, "yyyy년 M월 d일");
    }
  } else {
    if (type == "short") {
      return dfFormat(ts, "MM/dd/yyyy");
    } else if (type == "literal") {
      return dfFormat(ts, "PPP");
    }
  }
  return "unknown type";
}

export function vizTime(
  ts: Date | string | null | undefined,
  opt: {type: "relative"|"absolute"|"chat", locale: string, noSuffix?: boolean}
): string {
  ts = toDateTime(ts);
  if (!ts) {
    return "(unknown)";
  }
  const { type, locale } = opt;
  const now = new Date();
  if (type == "relative") {
    if (locale == "ko") {
      const diff = now.getTime() - ts.getTime();
      const sec = diff / 1000;
      if (sec <= 60) {
      // return `${Math.ceil(sec)}초 전`;
        return "방금";
      }
      const min = sec / 60;
      if (min <= 60) {
        return `${Math.round(min)}분 전`;
      }
      const hour = min / 60;
      if (hour <= 24) {
        return `${Math.round(hour)}시간 전`;
      }
      const day = hour / 24;
      if (day <= 30) {
        return `${Math.round(day)}일 전`;
      }
      const month = day / 30;
      if (month <= 12) {
        return `${Math.round(month)}개월 전`;
      }
      const year = month / 12;
      return `${Math.round(year)}년 전`;
    } else {
      return formatDistance(ts, now, { addSuffix: opt.noSuffix ? false : true });
    }
  }
  if (type == "chat") {
    if (locale == "ko") {
      let apm = "오전";
      let hour = getHours(ts);
      const min = getMinutes(ts);
      if (hour > 12) {
        apm = "오후";
        hour = hour - 12;
      }
      if (hour == 0) {
        hour = 12;
      }
      return `${apm} ${hour}:${min < 10 ? "0" : ""}${min}`;
    } else {
      return dfFormat(ts, "h:mm a");
    }
  } else if (type == "absolute") {
    // if 'absoute'
    if (locale == "ko") {
      return dfFormat(ts, "yy/MM/dd HH:mm");
    } else {
      return dfFormat(ts, "MM/dd/yy HH:mm");
    }
  }
  return "unknown time type";
}
