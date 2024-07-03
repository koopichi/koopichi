const configForm = document.getElementById('conform');

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    function handleFormSubmit(event) {
      event.preventDefault();


      const apn = document.getElementById('apn').value;


      const configPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadDisplayName</key>
            <string>Cellular</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.cellular</string>
            <key>PayloadType</key>
            <string>com.apple.cellular</string>
            <key>PayloadUUID</key>
            <string>${generateUUID()}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>APNs</key>
            <array>
                <dict>
                    <key>AuthenticationType</key>
                    <string>CHAP</string>
                    <key>Enabled</key>
                    <true/>
                    <key>Name</key>
                    <string>${apn}</string>
                </dict>
            </array>
            <key>SignalBoostEnabled</key>
            <true/>
            <key>Proxy</key>
            <dict>
                <key>Enabled</key>
                <true/>
                <key>PayloadType</key>
                <string>com.apple.proxy</string>
                <key>PayloadUUID</key>
                <string>${generateUUID()}</string>
                <key>PayloadVersion</key>
                <integer>1</integer>
                <key>HTTPEnable</key>
                <true/>
                <key>HTTPPort</key>
                <integer>8080</integer>
                <key>HTTPSEnable</key>
                <true/>
                <key>HTTPSPort</key>
                <integer>8080</integer>
                <key>FTPEnable</key>
                <true/>
                <key>FTPPort</key>
                <integer>21</integer>
                <key>SOCKSEnable</key>
                <true/>
                <key>SOCKSPort</key>
                <integer>1080</integer>
                <key>Server</key>
                <string>proxy.example.com</string>
                <key>ExclusionList</key>
                <array>
                    <string>localhost</string>
                    <string>127.0.0.1</string>
                    <string>169.254.0.0/16</string>
                </array>
            </dict>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>Cellular and Network Settings</string>
    <key>PayloadIdentifier</key>
    <string>com.example.cellular</string>
    <key>PayloadOrganization</key>
    <string>koopichi</string>
    <key>PayloadRemovalDisallowed</key>
    <false/>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadUUID</key>
    <string>${generateUUID()}</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
</dict>
</plist>
`;


      const configBlob = new Blob([configPlist], { type: 'application/xml' });


      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(configBlob);
      downloadLink.download = `${apn}.mobileconfig`;
      downloadLink.click();

      setTimeout(() => {
        URL.revokeObjectURL(downloadLink.href);
      }, 1000);
    }

    configForm.addEventListener('submit', handleFormSubmit);