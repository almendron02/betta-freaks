insert into public.categories (slug, name, description, position)
values
  ('bettas', 'Bettas', 'Individually photographed live Betta splendens.', 0),
  ('accessories', 'Accessories', 'Selected aquarium-care products.', 1),
  ('live-foods', 'Live Foods', 'Live-food inventory and feeding products.', 2)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    position = excluded.position;
