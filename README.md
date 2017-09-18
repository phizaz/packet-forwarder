# Packet Forwarder

Forwarding all packets from a given local port to a remote port with fallback ports.

## Rationale

Let's say you have a home server listening port 22 for secure shell. It is normal for broadband internet not to have end-to-end direct access.

Thus, to connect to the home server from outside you need the router's public ip and the forwarded port. Let's say in this case it is 2022.

Now, you want to connect to your home server from inside you use `<local_ip>:22` but when you are outside you use `<real_ip>:2022`. This causes inconveniences.

This **Packet Forwarder** will unify this to `localhost:<port_of_your_choice>`. You give it a list of hosts and ips to which you want to forwar, it will forward to the "first" reachable host.

So, when you are inside the `<local_ip>:22` is reachable then it will forward to this. But, on the other hand, when you are outside `<local_ip>:22` is not reachable anymore then it will forward to `<real_ip>:2022` automatically instead.


## Usage

You must first open the `server.js` and change the configuration to suit your need then run:

```
node server.js
```

Example:

```
const OUTGOING = [
    { host: '192.168.1.100', port: 22 },
    { host: 'myhost.ddns.net', port: 2022 }
]
```

It will prioritize hosts descendingly according to the array index, the more the index the less the priority.

## Performance

I had a feeling that the performance migh not be stellar. So, I tried copy data over the forwarding port, and see the CPU usage at the time.

![](https://pictr.com/images/2017/09/19/d33d0b880d32845ca9e5c0d2c07a3d40.png)

It is clearly not scientific. Hope it might help.

Note: my connection at the time is Wi-Fi.

