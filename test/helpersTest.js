const { assert, expect } = require('chai');
const { extractCustomerObj,
  extractFoodObj,
  findOrderIndex,
  generateEmptyUser,
  generateQueryFromCart,
  refactorOrder} = require('../lib/helpers');

describe('#extractCustomerObj', function() {
  it(`Expect an empty object when submitted an empty value`, function() {
    const input = '';
    const output = {};
    assert.deepEqual(extractCustomerObj(input),output);
  });
});

describe('#extractCustomerObj', function() {
  it(`Expect a customer object when passed an order`, function() {
    const input =   {
      order_id: 2,
      ordered_at: "2019-07-26T10:01:20.000Z",
      order_status: "new",
      customer_comments: null,
      food_id: "1",
      food_name: "Tubby Dog",
      food_qty: "1",
      picture_url: "src/images/foods/dog_tubbydog.jpg",
      user_id: 4,
      customer_name: "robin",
      email: "robin@test.com",
      phone_number: "514-555-5555"
    };
    const output =   {
      user_id: 4,
      customer_name: "robin",
      email: "robin@test.com",
      phone_number: "514-555-5555"
    };
    assert.deepEqual(extractCustomerObj(input),output);
  });
});

describe('#extractFoodObj', function() {
  it(`Expect an empty object when submitted an empty value`, function() {
    const input = '';
    const output = {};
    assert.deepEqual(extractFoodObj(input),output);
  });
});

describe('#extractFoodObj', function() {
  it(`Expect a food object when passed an order`, function() {
    const input =   {
      order_id: 2,
      ordered_at: "2019-07-26T10:01:20.000Z",
      order_status: "new",
      customer_comments: null,
      food_id: "1",
      food_name: "Tubby Dog",
      food_qty: "1",
      picture_url: "src/images/foods/dog_tubbydog.jpg",
      customer_name: "robin",
      email: "robin@test.com",
      phone_number: "514-555-5555"
    };
    const output =   {
      food_id: "1",
      food_name: "Tubby Dog",
      food_qty: "1",
      picture_url: "src/images/foods/dog_tubbydog.jpg"
    };
    assert.deepEqual(extractFoodObj(input),output);
  });
});

describe('#findOrderIndex', function() {
  it(`return undefined if order isn't found`, function() {
    const orderId = 4;
    const ordersArray = [
      {order_id: 1, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 2, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 3, ordered_at: "2019-07-26T10:01:20.000Z"},
    ];
    const output = undefined;
    assert.strictEqual(findOrderIndex(orderId,ordersArray),output);
  });
});

describe('#findOrderIndex', function() {
  it(`return index of order in array if found`, function() {
    const orderId = 2;
    const ordersArray = [
      {order_id: 1, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 2, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 3, ordered_at: "2019-07-26T10:01:20.000Z"},
    ];
    const output = 1;
    assert.strictEqual(findOrderIndex(orderId,ordersArray),output);
  });
});

describe('#generateEmptyUser', function() {
  it(`return index of order in array if found`, function() {
    const output = {id: '', name: '', phone_number: '', email: '', admin: ''};
    assert.deepEqual(generateEmptyUser(),output);
  });
});







describe('#generateQueryFromCart', function() {
  it(`return a query object from a cart`, function() {
    const cartInput = [ { id: 1, name: 'Tubby Dog', price: 799, qty: 2 },
      { id: 2, name: 'Cheetah', price: 899, qty: 3 } ];
    const output = { text: "INSERT INTO food_orders (order_id, food_id) VALUES ($1, $2), ($1, $3), ($1, $4), ($1, $5), ($1, $6)", values: [1, 1, 1, 2, 2, 2] };
    assert.deepEqual(generateQueryFromCart(1,cartInput),output);
  });
});




describe('#refactorOrder', function() {
  it(`Takes an array of orders and return an empty array if the list is empty`, function() {
    const orderData = [];
    const structuredOrderData = [];
    assert.deepEqual(refactorOrder(orderData),structuredOrderData);
  });
});

describe('#refactorOrder', function() {
  it(`Takes an array of orders and return a structured list of orders`, function() {
    const orderData = [
      {
        order_id: 1,
        ordered_at: "2019-07-26T10:02:20.000Z",
        order_status: "new",
        customer_comments: null,
        food_id: 3,
        food_name: "Yogi Bear",
        food_qty: "1",
        picture_url: "src/images/foods/dog_yogi.jpg",
        user_id: 3,
        customer_name: "jess",
        email: "jess@test.com",
        phone_number: "514-555-5555",
        total_cost: 1799
      },
      {
        order_id: 1,
        ordered_at: "2019-07-26T10:02:20.000Z",
        order_status: "new",
        customer_comments: null,
        food_id: 4,
        food_name: "Harlo",
        food_qty: "3",
        picture_url: "src/images/foods/dog_harlo.jpg",
        user_id: 3,
        customer_name: "jess",
        email: "jess@test.com",
        phone_number: "514-555-5555",
        total_cost: 1799
      },
      {
        order_id: 2,
        ordered_at: "2019-07-26T10:01:20.000Z",
        order_status: "new",
        customer_comments: null,
        food_id: 1,
        food_name: "Tubby Dog",
        food_qty: "1",
        picture_url: "src/images/foods/dog_tubbydog.jpg",
        user_id: 7,
        customer_name: "robin",
        email: "robin@test.com",
        phone_number: "514-555-5555",
        total_cost: null
      },
      {
        order_id: 2,
        ordered_at: "2019-07-26T10:01:20.000Z",
        order_status: "new",
        customer_comments: null,
        food_id: 3,
        food_name: "Yogi Bear",
        food_qty: "3",
        picture_url: "src/images/foods/dog_yogi.jpg",
        user_id: 7,
        customer_name: "robin",
        email: "robin@test.com",
        phone_number: "514-555-5555",
        total_cost: null
      }
    ];

    const structuredOrderData = [
      {
        order_id: 1,
        ordered_at: "2019-07-26T10:02:20.000Z",
        order_status: "new",
        customer_comments: null,
        total_cost: 1799,
        foods: [{
          food_id: 3,
          food_name: "Yogi Bear",
          food_qty: "1",
          picture_url: "src/images/foods/dog_yogi.jpg",
        },{
          food_id: 4,
          food_name: "Harlo",
          food_qty: "3",
          picture_url: "src/images/foods/dog_harlo.jpg",
        }],
        user: {
          user_id: 3,
          customer_name: "jess",
          email: "jess@test.com",
          phone_number: "514-555-5555"
        }
      },
      {
        order_id: 2,
        ordered_at: "2019-07-26T10:01:20.000Z",
        order_status: "new",
        customer_comments: null,
        total_cost: null,
        foods: [{
          food_id: 1,
          food_name: "Tubby Dog",
          food_qty: "1",
          picture_url: "src/images/foods/dog_tubbydog.jpg",
        },{
          food_id: 3,
          food_name: "Yogi Bear",
          food_qty: "3",
          picture_url: "src/images/foods/dog_yogi.jpg",
        }],
        user: {
          user_id: 7,
          customer_name: "robin",
          email: "robin@test.com",
          phone_number: "514-555-5555"
        }
      }
    ];
    expect(refactorOrder(orderData)).to.eql(structuredOrderData);
  });
});
