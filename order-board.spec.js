const OrderBoard = require('./order-board');
const constants = require('./order.constants');
const assert = require('chai').assert;

describe('OrderBoard', function() {
  let orderBoard;

  beforeEach(() => {
    orderBoard = new OrderBoard();
  })

  describe('#addOrder(user_id, quantity, price, type)', function() {
    it('should add an order', function() {
      const orderId = orderBoard.add('123', 2000, 303, constants.BUY);
      assert.typeOf(orderId, 'string');
    });
  });


  describe('#cancel(user_id, order_id)', function() {
    it('should support order cancellation', function() {
      const orderId = orderBoard.add('123', 2000, 303, constants.BUY);
      const cancelResponse = orderBoard.cancel('123', orderId);
      assert.typeOf(cancelResponse, 'object');
    });

    it('should fail if the order id doesn\'t exist', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      const cancelResponse = orderBoard.cancel('123', '0');
      assert.isFalse(cancelResponse);
    });    

    it('should fail if the order cancellation user differs from the creation user', function() {
      const orderId = orderBoard.add('123', 2000, 303, constants.BUY);
      const cancelResponse = orderBoard.cancel('124', orderId);
      assert.isFalse(cancelResponse);
    });
  });


  describe('#summary()', function() {
    it('should support order summary', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      const summary = orderBoard.summary();
      assert.equal(summary[constants.BUY][0].quantity, 2000);
      assert.equal(summary[constants.BUY][0].price, 303);
    });

    it('should add multiple orders for the same price', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      orderBoard.add('124', 1000, 303, constants.BUY);
      const summary = orderBoard.summary();
      assert.equal(summary[constants.BUY][0].quantity, 3000);
      assert.equal(summary[constants.BUY][0].price, 303);
    });

    it('should sepreate multiple orders for the different prices', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      orderBoard.add('124', 1000, 304, constants.BUY);
      const summary = orderBoard.summary();
      assert.equal(summary[constants.BUY][0].quantity, 1000);
      assert.equal(summary[constants.BUY][0].price, 304);
      assert.equal(summary[constants.BUY][1].quantity, 2000);
      assert.equal(summary[constants.BUY][1].price, 303);
    });

    it('should sepreate buy and sell orders for the same prices', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      orderBoard.add('124', 1000, 303, constants.SELL);
      const summary = orderBoard.summary();
      assert.equal(summary[constants.BUY][0].quantity, 2000);
      assert.equal(summary[constants.BUY][0].price, 303);
      assert.equal(summary[constants.SELL][0].quantity, 1000);
      assert.equal(summary[constants.SELL][0].price, 303);
    });

    it('should update after adding new orders', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      const summary1 = orderBoard.summary();
      orderBoard.add('124', 1000, 303, constants.BUY);
      const summary2 = orderBoard.summary();
      assert.equal(summary1[constants.BUY][0].quantity, 2000);
      assert.equal(summary1[constants.BUY][0].price, 303);
      assert.equal(summary2[constants.BUY][0].quantity, 3000);
      assert.equal(summary2[constants.BUY][0].price, 303);
    });
    
    it('should update after cancelling orders', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      const order2 = orderBoard.add('124', 1000, 303, constants.BUY);
      const summary1 = orderBoard.summary();
      orderBoard.cancel('124', order2);
      const summary2 = orderBoard.summary();
      assert.equal(summary1[constants.BUY][0].quantity, 3000);
      assert.equal(summary1[constants.BUY][0].price, 303);
      assert.equal(summary2[constants.BUY][0].quantity, 2000);
      assert.equal(summary2[constants.BUY][0].price, 303);
    });

    it('should order BUY orders descending', function() {
      orderBoard.add('123', 2000, 303, constants.BUY);
      orderBoard.add('124', 1000, 304, constants.BUY);
      orderBoard.add('124', 500, 308, constants.BUY);
      const summary = orderBoard.summary();
      assert.equal(summary[constants.BUY][0].quantity, 500);
      assert.equal(summary[constants.BUY][0].price, 308);
      assert.equal(summary[constants.BUY][1].quantity, 1000);
      assert.equal(summary[constants.BUY][1].price, 304);
      assert.equal(summary[constants.BUY][2].quantity, 2000);
      assert.equal(summary[constants.BUY][2].price, 303);
    });

    it('should order SELL orders descending', function() {
      orderBoard.add('123', 2000, 303, constants.SELL);
      orderBoard.add('124', 1000, 304, constants.SELL);
      orderBoard.add('124', 500, 308, constants.SELL);
      const summary = orderBoard.summary();
      assert.equal(summary[constants.SELL][0].quantity, 2000);
      assert.equal(summary[constants.SELL][0].price, 303);
      assert.equal(summary[constants.SELL][1].quantity, 1000);
      assert.equal(summary[constants.SELL][1].price, 304);
      assert.equal(summary[constants.SELL][2].quantity, 500);
      assert.equal(summary[constants.SELL][2].price, 308);
    });
  });
});