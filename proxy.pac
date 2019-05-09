/******默认代理和自定义规则可以在下面两行中配置：******/
//自定义默认proxy：1. http代理->PROXY host:port 2. socks代理-> SOCKS host:port
// var proxy=typeof _proxy !="undefined"&&_proxy?_proxy:"SOCKS 127.0.0.1:1082; DIRECT";
var proxy = "SOCKS 127.0.0.1:1082"
//自定义规则.放在一个数组里。比如["a.com","b.com","-v2ex.com"]默认是append，如果以减号"-"开头就是从gfwlist中删除

var myHosts = [
    "githubusercontent.com", "assets-cdn.github.com", "xda-developers.com", "fastly.net", 
    "cdn.sstatic.net", "google.com", "stripe.com", "google.com.hk", 
    "smtp.google.com", "pop.google.com", "pop3.google.com", "imap.google.com",
    "gmail.com", "smtp.gmail.com", "pop.gmail.com", "pop3.gmail.com", "imap.gmail.com",
    "cdn.infoqstatic.com", "blogspot.com",
    "facebook.com",
    "twitter.com"
];

var switchyomega_rules = `
*.imgur.com +Proxy
*.facebook.com +Proxy
*.fbcdn.net +Proxy
*.bbc.com +Proxy
*.ctex.org +Proxy
*.compressjpeg.com +Proxy
*.quoracdn.net +Proxy
*.online2pdf.com +Proxy
*.kingdb.org +Proxy
*.go.org +Proxy
*.cmu.edu +Proxy
*.google-analytics.com +Proxy
*.go-zh.org +Proxy
*.golang.org +Proxy
*.reddit.com +Proxy
*.orcid.org +Proxy
*.quora.com +Proxy
*.tensorflow.org +Proxy
*.blog.google +Proxy
*.chrome.com +Proxy
*.twimg.com +Proxy
*.btbit.net +Proxy
*.thomas-cokelaer.info +Proxy
*.google.de +Proxy
*.linksynergy.com +Proxy
*.dc-storm.com +Proxy
*.airpr.com +Proxy
*.cnzz.com +Proxy
*.codejam.withgoogle.com +Proxy
*.nih.gov +Proxy
*.googleusercontent.com +Proxy
*.worldcat.org +Proxy
*.nyanblog.net +Proxy
*.amberlife.net +Proxy
*.xys.org +Proxy
*.twitter.com +Proxy
*.tellapart.com +Proxy
*.youtu.be +Proxy
*.mailboxapp.com +Proxy
*.t.co +Proxy
*.android.com +Proxy
*.pinimg.com +Proxy
*.facebook.net +Proxy
*.intellimize.co +Proxy
*.cloudfront.net +Proxy
*.infocommshow.org +Proxy
*.hostinger.com.hk +Proxy
*.wolfram.com +Proxy
*.wolframalpha.com +Proxy
*.walframalpha.com +Proxy
*.youtube.com +Proxy
*.s3.amazonaws.com +Proxy
*.wordreference.com +Proxy
*.wordreference.net +Proxy
*.netspeak.org +Proxy
*.libreoffice.org +Proxy
*.slideshare.net +Proxy
*.hakim.se +Proxy
*.grammarly.com +Proxy
*.du191j5nktvyb.cloudfront.net +Proxy
*.proofwiki.org +Proxy
*.sticksfight.com +Proxy
*.goo.gl +Proxy
*.pygtk.org +Proxy
*.shadowsocks.org +Proxy
*.gnu.org +Proxy
*.economist.com +Proxy
*.reuters.com +Proxy
*.ytimg.com +Proxy
*.googlevideo.com +Proxy
*.youtube-nocookie.com +Proxy
*.gstatic.com +Proxy
*.chromium.org +direct
*.googleapis.com +Proxy
*.google.com +Proxy
*.ggpht.com +Proxy
*.google.com.* +Proxy
*.google*.com +Proxy
*.zh.wikipedia.org +Proxy
`

function rule_process() {
    var rules = switchyomega_rules.split('\n')
    for(var i=0; i<rules.length; i++) {
        if(rules[i].length<4) continue;
        var t = rules[i].split(' ');
        if(t.length>1 && t[1]=='+direct') continue;
        if(t[0].indexOf('*.') == 0) host = t[0].slice(2);
        else host = t[0];
        if(host.indexOf('*')>=0) continue;
        myHosts.push(host);
    }
}

// process switchomega rules
rule_process();

var encodedHosts = typeof _encodedHosts != "undefined" ? _encodedHosts : "W10=";

function decode64(_1) {
    var _2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var _3 = "";
    var _4, _5, _6;
    var _7, _8, _9, _a;
    var i = 0;
    _1 = _1.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        _7 = _2.indexOf(_1.charAt(i++));
        _8 = _2.indexOf(_1.charAt(i++));
        _9 = _2.indexOf(_1.charAt(i++));
        _a = _2.indexOf(_1.charAt(i++));
        _4 = (_7 << 2) | (_8 >> 4);
        _5 = ((_8 & 15) << 4) | (_9 >> 2);
        _6 = ((_9 & 3) << 6) | _a;
        _3 = _3 + String.fromCharCode(_4);
        if (_9 != 64) {
            _3 = _3 + String.fromCharCode(_5);
        }
        if (_a != 64) {
            _3 = _3 + String.fromCharCode(_6);
        }
    } while (i < _1.length);
    return _3;
}
var hosts = eval(decode64(encodedHosts));

//处理自定义规则
if (myHosts && myHosts.length) {
    var removeHosts = [];
    for (var i = 0; i < myHosts.length; i++) {
        if (myHosts[i].charAt(0) != '-')
            hosts.push(myHosts[i]);
        else
            removeHosts.push(myHosts[i].substr(1));
    }
    if (removeHosts.length) {
        var tempHosts = [];
        for (var i = 0; i < hosts.length; i++) {
            var inRemovedHosts = false;
            for (var j = 0; j < removeHosts.length; j++) {
                if (removeHosts[j] == hosts[i]) {
                    inRemovedHosts = true;
                    break;
                }
            }
            if (!inRemovedHosts)
                tempHosts.push(hosts[i]);
        }
        hosts = tempHosts;
    }
}

var hostsObj = {};
for (var i = 0; i < hosts.length; i++) {
    hostsObj[hosts[i]] = true;
    hosts[i] = "." + hosts[i];
}

function FindProxyForURL(url, host) {
    url = url.toLowerCase();
    host = host.toLowerCase();
    if (hostsObj[host]) return proxy;
    for (var i = 0; i < hosts.length; i++) {
        if (host.substr(host.length - hosts[i].length) == hosts[i])
            return proxy;
    }
    return "DIRECT";
}