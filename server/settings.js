var path = require('path');

module.exports = {
  "logging": {
    "level": "debug"
  },
  /**
   * how to mount external usb device on raspbian:
   *
   * list currently mounted devices:
   * mount -v | grep "^/" | awk '{print "\nPartition identifier: " $1  "\n Mountpoint: "  $3}'
   *
   * run 'dmesg' to see what letter it was assigned to
   * then run
   *
   * sudo mount -t vfat -o rw,umask=0022,gid=1000,uid=1000 /dev/sda1 /mnt/usb/
   *
   * -t : the type (fat32 in this case)
   * gid and uid : the id of the group and user to use when mounting (user "pi" = 1000)
   *
   * (assuming directory /mnt/usb) exists
   */
  //"storage": path.join("/mnt/usb/photbox_pictures"),
  "storage": path.join(__dirname, "./photos"),
  "useMockGphoto": true
};