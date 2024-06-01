export function simplifyUserAgent(userAgent: string): string {
  //Converts the user-agent to a lower case string
  userAgent = userAgent.toLowerCase();

  //Fallback in case the operating system can't be identified
  let os = "Unknown OS";

  const osDict: { [key: string]: string } = {
    blackberry: "BlackBerry",
    ipad: "iPad",
    ipod: "iPod",
    iphone: "iPhone",
    android: "Android",
    mac_powerpc: "Mac OS 9",
    "mac os x": "Mac OS X",
    "windows nt 10": "Windows 10",
    "windows nt 6.3": "Windows 8.1",
    "windows nt 6.2": "Windows 8",
    "windows nt 6.1": "Windows 7",
    "windows nt 6.0": "Windows Vista",
    "windows nt 5.2": "Windows Server 2003/XP x64",
    window: "Window",
    ubuntu: "Ubuntu",
    linux: "Linux",
  };

  const osKeys = Object.keys(osDict);
  //For each item in match array
  for (let i = 0; i < osKeys.length; i++) {
    //If the string is contained within the user-agent then set the os
    if (userAgent.indexOf(osKeys[i]) !== -1) {
      os = osDict[osKeys[i]];
      break;
    }
  }

  //Return the determined os
  return os;
}
