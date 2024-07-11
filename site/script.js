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

  const configPlist = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>APNs</key>
            <array>
                <dict>
						<key>AllowedProtocolMask</key>
						<integer>3</integer>
						<key>AllowedProtocolMaskInDomesticRoaming</key>
						<integer>3</integer>
						<key>AllowedProtocolMaskInRoaming</key>
						<integer>3</integer>
                    <key>AuthenticationType</key>
                    <string>CHAP</string>
						<key>DefaultProtocolMask</key>
						<integer>3</integer>
						<key>EnableXLAT464</key>
						<false />
                    <key>Name</key>
                    <string>${apn}</string>
                </dict>
            </array>
				<key>PayloadDisplayName</key>
				<string>Cellular</string>
				<key>PayloadIdentifier</key>
				<string>com.apple.cellular.${generateUUID()}</string>
				<key>PayloadType</key>
				<string>com.apple.cellular</string>
				<key>PayloadUUID</key>
				<string>${generateUUID()}</string>
				<key>PayloadVersion</key>
				<integer>1</integer>
        </dict>
    </array>
    <key>PayloadDisplayName</key>
    <string>Cellular and Network Settings</string>
    <key>PayloadIdentifier</key>
    <string>net.navazi.cellular.${generateUUID()}</string>
    <key>PayloadOrganization</key>
    <string>koopichi</string>
    <key>PayloadRemovalDisallowed</key>
		<false />
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
