const cart = {};

$(() => {

  $(".add-food-btn").click(function() {
    const foodId = $(this).val();

    if (!cart[foodId]) {
      cart[foodId] = 0;
    }
    cart[foodId] += 1;

    const counter = $("nav>h1");

    counter.text('Test');

    console.log(cart);
  });

  $('button').click(function(event) {
    event.preventDefault();
    const $form = $(this).closest('form');
    const cartUrl = "/checkout/" + JSON.stringify(cart);
    $form.attr('action', cartUrl).submit();
  });
});
