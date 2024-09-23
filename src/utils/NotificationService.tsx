export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendBrowserNotification = (title: string, message: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else {
    console.warn("Notification permission not granted.");
  }
};
