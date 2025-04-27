const services = [
  {
    "route": "/globalhmis-user/v1",
    "target": "http://127.0.0.1:1111",
    "limit": 5,
    "windowMs": 60000
  },
  {
    "route": "/globalhmis-order/v1",
    "target": "http://127.0.0.1:2222",
    "limit": 20,
    "windowMs": 60000
  }
];

module.exports = services;
