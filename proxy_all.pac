
var proxy="SOCKS 127.0.0.1:1080";

function FindProxyForURL(url, host) {
    return proxy;
}