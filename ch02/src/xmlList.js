const xmlparse = require('xml2js').parseString;

var xml_text = `
    <xml>
        <system>Linux</system>
        <distro>
            <release>Ubuntu</release>
            <release>CentOS</release>
            <release>Debian</release>
            <release>RedHat</release>
            <release>Arch</release>
        </distro>
    </xml>
`;

xmlparse(xml_text, {explicitArray : false}, (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
        console.log(result.xml.distro);
    }
});
