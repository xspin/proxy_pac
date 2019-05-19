var proxy="SOCKS 127.0.0.1:1080";

function FindProxyForURL(url, host) {
    ow = [
        ".google.com", ".googlevideo.com",
        ".youtube.com", ".ytimg.com", ".ggpht.com", ".googlesyndication.com", ".youtube-nocookie.com",
        ".facebook.com",
        ".twitter.com", ".twimg.com"
    ];
    for (i = 0; i < ow.length; i++) {
        if (dnsDomainIs(host, ow[i])) {
            return proxy;
        }
    }
	return "DIRECT";
}