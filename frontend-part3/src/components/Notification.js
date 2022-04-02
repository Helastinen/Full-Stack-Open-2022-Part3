const Notification = ({ notification, notificationIsError }) => {
  //do not show notification box if there is no notifications
  if (notification === "") {
    return null
  }

  //return either success or error css
  let className = "success"
  if (notificationIsError) {
    className = "error"
  }
  
  return (
    <div className={className}>
      {console.log("Notification:", notification)}
      {notification}
    </div>
  )
}

export default Notification