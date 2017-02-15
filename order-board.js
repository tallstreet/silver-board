const uuid = require('uuid');
const constants = require('./order.constants');

class OrderBoard {
  constructor() {
    this.orders = [];
  }

  add(user_id, quantity, price, order_type) {
    const id = uuid();
    const current_order = {
      id,
      user_id,
      quantity,
      price,
      order_type
    };
    this.orders.push(current_order);
    return id;
  }

  cancel(user_id, order_id) {
    const idx = this.orders.findIndex((order) => order.id === order_id);
    if (idx >= 0 && this.orders[idx].user_id === user_id) {
      return this.orders.splice(idx, 1)[0];
    } else {
      return false;
    }
  }

  summary() {
    const summary = this.orders.reduce((acc, val) => {
      let idx;
      if (val.order_type === constants.BUY) {
        idx = acc[val.order_type].findIndex((summary) => summary.price <= val.price)
      } else {
        idx = acc[val.order_type].findIndex((summary) => summary.price >= val.price)
      }
      if (idx === -1) {
        idx = acc[val.order_type].length;
      }
      if (acc[val.order_type][idx] && acc[val.order_type][idx].price == val.price) {
        acc[val.order_type][idx].quantity += val.quantity;
      } else {
        acc[val.order_type].splice(idx, 0, {price: val.price, quantity: val.quantity});
      }
      return acc;
    }, {[constants.BUY]: [], [constants.SELL]: []});
    return summary;
  }
}

module.exports = OrderBoard;