
var proxy="SOCKS 127.0.0.1:1082";

function FindProxyForURL(url, host) {
    return proxy;
}