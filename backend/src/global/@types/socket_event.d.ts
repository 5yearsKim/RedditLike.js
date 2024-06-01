
interface ForwardEventT {
  name: string
  args: any
}

interface NotificationCreatedEventT extends ForwardEventT {
  name: "notification-created"
  args: [NotificationT]
}
