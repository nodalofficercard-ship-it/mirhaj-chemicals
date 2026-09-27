update stock set reorder_at = 0 where on_hand = 0 and reorder_at = 20;
alter table stock alter column reorder_at set default 0;
