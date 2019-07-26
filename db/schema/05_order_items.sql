DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  dog_menu_id INTEGER REFERENCES dog_menus(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  extras_id INTEGER REFERENCES extras(id) ON DELETE CASCADE
);
